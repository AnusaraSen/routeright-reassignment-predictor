"""
baseline_common.py -- shared setup for the Stage 6 baseline notebooks (05a-05e).

EVERYTHING that must be identical across models lives here, so the four per-model
notebooks are compared on exactly the same footing:
  * the data file and the target column
  * the TimeSeriesSplit definition (5 folds, no shuffling)
  * the decision threshold (0.5) and the metric definitions
  * the random seed and the class-weighting logic

Each model notebook only decides *which* model to run and how to interpret it.
The test set is never loaded anywhere in this module.
"""
import time
import warnings
from pathlib import Path
from typing import Any, Callable, Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, average_precision_score, f1_score,
                             precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import TimeSeriesSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.utils.class_weight import compute_sample_weight

warnings.filterwarnings("ignore")

# ----------------------------------------------------------------------------- constants
RANDOM_STATE = 42
TARGET = "reassignment_required"
N_SPLITS = 5
THRESHOLD = 0.5          # default decision threshold for a baseline
METRICS = ["pr_auc", "f1", "recall", "precision", "accuracy", "roc_auc", "train_accuracy"]


# ----------------------------------------------------------------------------- paths
def find_project_root(marker="config/config.yaml"):
    """Search the current folder and every parent for the project marker file."""
    here = Path.cwd().resolve()
    for p in [here, *here.parents]:
        if (p / marker).exists():
            return p
    raise FileNotFoundError(f"Could not find '{marker}' in {here} or any parent folder.")


ROOT = find_project_root()
TRAIN_PATH = ROOT / "data" / "processed" / "train.csv"
MODEL_DIR = ROOT / "models" / "baseline"
OUT_DIR = ROOT / "docs" / "deliverables_eval2"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)


def slug(name):
    return name.lower().replace(" ", "_")


# ----------------------------------------------------------------------------- data
def load_train(verbose: bool = True) -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
    """Load train.csv ONLY and verify the assumptions the validation strategy depends on."""
    train = pd.read_csv(TRAIN_PATH)
    X = train.drop(columns=[TARGET])
    y = train[TARGET].astype(int)
    assert train.isna().sum().sum() == 0, "Unexpected missing values in train.csv"
    assert not list(X.select_dtypes(exclude="number").columns), "Unexpected non-numeric columns"
    # TimeSeriesSplit assumes chronological row order; opened_month is the only time signal here
    assert train["opened_month"].is_monotonic_increasing, "Rows are NOT in chronological order!"
    if verbose:
        print("Shape:", train.shape, "| missing:", int(train.isna().sum().sum()),
              "| exact duplicate rows:", int(train.duplicated().sum()))
        print(f"Positive rate: {y.mean():.4f}  (neg:pos = {(1 - y.mean()) / y.mean():.2f}:1)")
        print("Rows per month (file order):",
              train["opened_month"].value_counts(sort=False).sort_index().to_dict())
        print("Chronological order check: PASSED")
    return X, y, train


def get_cv():
    return TimeSeriesSplit(n_splits=N_SPLITS)


def fold_table(X, y):
    rows = []
    for k, (tr, va) in enumerate(get_cv().split(X), start=1):
        assert tr.max() < va.min()      # training strictly earlier than validation
        rows.append({"fold": k, "n_train": len(tr), "n_val": len(va),
                     "train_pos_rate": round(y.iloc[tr].mean(), 4),
                     "val_pos_rate": round(y.iloc[va].mean(), 4),
                     "val_months": sorted(X.iloc[va]["opened_month"].unique().astype(int).tolist())})
    return pd.DataFrame(rows)


# ----------------------------------------------------------------------------- models
# Baseline = library defaults (only max_iter raised for LR so that it converges).
MODEL_FACTORIES = {
    "Logistic Regression": lambda cw: Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=1000, class_weight=cw, random_state=RANDOM_STATE))]),
    "Decision Tree": lambda cw: DecisionTreeClassifier(class_weight=cw, random_state=RANDOM_STATE),
    "Random Forest": lambda cw: RandomForestClassifier(class_weight=cw, random_state=RANDOM_STATE, n_jobs=-1),
    "Gradient Boosting": lambda cw: GradientBoostingClassifier(random_state=RANDOM_STATE),
}
VARIANTS = {"unweighted": None, "weighted": "balanced"}


def fit_model(name, cw, X_tr, y_tr):
    """scikit-learn's GradientBoostingClassifier has no class_weight / scale_pos_weight
    (those belong to XGBoost/LightGBM), so its weighted variant uses sample_weight."""
    model = MODEL_FACTORIES[name](cw)
    if name == "Gradient Boosting" and cw == "balanced":
        model.fit(X_tr, y_tr, sample_weight=compute_sample_weight("balanced", y_tr))
    else:
        model.fit(X_tr, y_tr)
    return model


def score(model, X_, y_):
    proba = model.predict_proba(X_)[:, 1]
    pred = (proba >= THRESHOLD).astype(int)
    return proba, pred, {
        "accuracy": accuracy_score(y_, pred),
        "precision": precision_score(y_, pred, zero_division=0),
        "recall": recall_score(y_, pred, zero_division=0),
        "f1": f1_score(y_, pred, zero_division=0),
        "roc_auc": roc_auc_score(y_, proba),
        "pr_auc": average_precision_score(y_, proba)}


def _cv_one(name: str, variant: str, cw: Any, X: pd.DataFrame, y: pd.Series,
            model_builder: Callable[[pd.DataFrame, pd.Series], Any]) -> Tuple[List[Dict[str, Any]], pd.DataFrame]:
    rows, oof_parts = [], []
    for k, (tr, va) in enumerate(get_cv().split(X), start=1):
        X_tr, y_tr, X_va, y_va = X.iloc[tr], y.iloc[tr], X.iloc[va], y.iloc[va]
        t0 = time.time()
        model = model_builder(X_tr, y_tr)
        fit_sec = time.time() - t0
        proba, pred, m = score(model, X_va, y_va)
        m["train_accuracy"] = accuracy_score(y_tr, (model.predict_proba(X_tr)[:, 1] >= THRESHOLD).astype(int))
        rows.append({"model": name, "variant": variant, "fold": k, "n_train": len(tr), "n_val": len(va),
                     "val_pos_rate": y_va.mean(), **m, "fit_seconds": fit_sec})
        oof_parts.append(pd.DataFrame({"model": name, "variant": variant, "fold": k, "row_index": va,
                                       "y_true": y_va.values, "y_pred": pred, "y_proba": proba}))
    return rows, pd.concat(oof_parts, ignore_index=True)


def run_cv(name: str, X: pd.DataFrame, y: pd.Series) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Cross-validate one model in both variants. Returns (per-fold results, out-of-fold predictions)."""
    all_rows, oofs = [], []
    for variant, cw in VARIANTS.items():
        rows, oof = _cv_one(name, variant, cw, X, y, lambda a, b, cw=cw: fit_model(name, cw, a, b))
        all_rows += rows; oofs.append(oof)
        print(f"cross-validated: {name} ({variant})")
    return pd.DataFrame(all_rows), pd.concat(oofs, ignore_index=True)


def run_reference(X: pd.DataFrame, y: pd.Series) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Majority-class 'no-skill' reference (NOT a fifth algorithm)."""
    name = "Reference: majority class"
    rows, oof = _cv_one(name, "n/a", None, X, y, lambda a, b: DummyClassifier(strategy="prior").fit(a, b))
    return pd.DataFrame(rows), oof


# ----------------------------------------------------------------------------- summaries
def summarize(folds_df):
    agg = folds_df.groupby(["model", "variant"])[METRICS].agg(["mean", "std"])
    out = pd.DataFrame(index=agg.index)
    for m in METRICS:
        out[m] = agg[m]["mean"].round(4)
        out[m + "_std"] = agg[m]["std"].round(4)
    out["fit_seconds"] = folds_df.groupby(["model", "variant"])["fit_seconds"].mean().round(2)
    return out.sort_values("pr_auc", ascending=False).reset_index()


def per_fold_view(folds_df):
    """Per-fold PR-AUC next to the no-skill level (= positive rate of that validation block)."""
    piv = folds_df.pivot_table(index="fold", columns="variant", values="pr_auc").round(3)
    piv.columns = [f"pr_auc_{c}" for c in piv.columns]
    piv.insert(0, "no_skill_pr_auc", folds_df.groupby("fold")["val_pos_rate"].first().round(3))
    piv.insert(0, "n_train", folds_df.groupby("fold")["n_train"].first())
    return piv


def full_fit_and_save(name: str, X: pd.DataFrame, y: pd.Series) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Refit on ALL of train.csv, save to models/baseline/. No test data involved."""
    rows, fitted = [], {}
    for variant, cw in VARIANTS.items():
        model = fit_model(name, cw, X, y)
        fitted[variant] = model
        _, _, m = score(model, X, y)
        rows.append({"model": name, "variant": variant,
                     "train_accuracy_full": round(m["accuracy"], 4), "train_f1_full": round(m["f1"], 4)})
        joblib.dump(model, MODEL_DIR / f"{slug(name)}_{variant}.pkl")
    return pd.DataFrame(rows), fitted


def save_outputs(name, folds_df, oof_df, full_df):
    s = slug(name)
    folds_df.to_csv(OUT_DIR / f"baseline_{s}_folds.csv", index=False)
    oof_df.to_csv(OUT_DIR / f"baseline_{s}_oof.csv", index=False)
    full_df.to_csv(OUT_DIR / f"baseline_{s}_full_fit.csv", index=False)
    print(f"Saved results for {name} to {OUT_DIR}")