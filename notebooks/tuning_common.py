"""
tuning_common.py -- shared setup for the Stage 7 tuning notebooks (06a - 06e).

Every model is tuned under IDENTICAL rules so the tuned models can be compared fairly:
  * same data (train.csv only; the test set is never loaded)      -> baseline_common.load_train()
  * same folds: 5-fold TimeSeriesSplit (never random K-fold)      -> baseline_common.get_cv()
  * same search method and budget: RandomizedSearchCV, N_ITER random combinations per model
  * same selection metric: PR-AUC (average precision); F1, recall, precision, accuracy and
    ROC-AUC are recorded for every candidate as well
  * same seed for the sampler

Only the model and its search space differ between notebooks.
"""
import json
import os
from typing import Any, Dict, List, Tuple

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.stats import loguniform
from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.utils.class_weight import compute_sample_weight

import baseline_common as bc

# ----------------------------------------------------------------------------- settings
N_ITER = int(os.environ.get("RR_N_ITER", 40))    # random combinations per model (env override is for quick smoke tests)
N_JOBS = -1                                       # parallel CV fits; set to 1 if your machine has trouble with multiprocessing
SEARCH_SEED = bc.RANDOM_STATE
PRIMARY = "pr_auc"
METRICS = ["pr_auc", "f1", "recall", "precision", "accuracy", "roc_auc"]
SCORING = {"pr_auc": "average_precision", "f1": "f1", "recall": "recall",
           "precision": "precision", "accuracy": "accuracy", "roc_auc": "roc_auc"}

TUNE_DIR = bc.ROOT / "docs" / "deliverables_eval2" / "tuning"
TUNED_MODEL_DIR = bc.ROOT / "models" / "tuned"
TUNE_DIR.mkdir(parents=True, exist_ok=True)
TUNED_MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ----------------------------------------------------------------------------- Gradient Boosting with class weights
class WeightedGradientBoosting(ClassifierMixin, BaseEstimator):
    """
    scikit-learn's GradientBoostingClassifier has no class_weight argument, so it cannot be put
    into a search directly. This thin wrapper adds class_weight (None / "balanced") by passing
    sample_weight to fit(), which makes class weighting searchable like any other hyperparameter.
    The real model lives in .model_ (a plain GradientBoostingClassifier).
    """

    def __init__(self, class_weight=None, n_estimators=100, learning_rate=0.1,
                 max_depth=3, subsample=1.0, random_state=bc.RANDOM_STATE):
        self.class_weight = class_weight
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.subsample = subsample
        self.random_state = random_state

    def fit(self, X, y):
        self.model_ = GradientBoostingClassifier(
            n_estimators=self.n_estimators, learning_rate=self.learning_rate,
            max_depth=self.max_depth, subsample=self.subsample, random_state=self.random_state)
        weights = compute_sample_weight(self.class_weight, y) if self.class_weight else None
        self.model_.fit(X, y, sample_weight=weights)
        self.classes_ = self.model_.classes_
        return self

    def predict_proba(self, X):
        return self.model_.predict_proba(X)

    def predict(self, X):
        return self.model_.predict(X)

    @property
    def feature_importances_(self):
        return self.model_.feature_importances_


# ----------------------------------------------------------------------------- estimators and search spaces
def build_estimator(name: str):
    """Fresh, un-tuned estimator for `name` (n_jobs=1 inside because the SEARCH is what runs in parallel)."""
    if name == "Logistic Regression":
        return Pipeline([("scaler", StandardScaler()),
                         # liblinear supports both L1 and L2 penalties and class_weight, and is fast on this data size
                         ("clf", LogisticRegression(solver="liblinear", max_iter=2000, random_state=bc.RANDOM_STATE))])
    if name == "Decision Tree":
        return DecisionTreeClassifier(random_state=bc.RANDOM_STATE)
    if name == "Random Forest":
        return RandomForestClassifier(random_state=bc.RANDOM_STATE, n_jobs=1)
    if name == "Gradient Boosting":
        return WeightedGradientBoosting()
    raise ValueError(name)


# Choices confirmed with the team before building:
#   LR: C, penalty, class_weight | DT: max_depth, min_samples_leaf, criterion, ccp_alpha (+ class_weight)
#   RF: max_depth, min_samples_leaf, max_features, n_estimators (+ class_weight)
#   GB: n_estimators, learning_rate, max_depth, subsample (+ class_weight)  | 40 random combinations each
SEARCH_SPACES: Dict[str, Dict[str, Any]] = {
    "Logistic Regression": {
        "clf__C": loguniform(1e-3, 1e2),
        "clf__penalty": ["l1", "l2"],
        "clf__class_weight": [None, "balanced"],
    },
    "Decision Tree": {
        "max_depth": list(range(3, 21)),
        "min_samples_leaf": [5, 10, 20, 30, 50, 75, 100, 150, 200],
        "criterion": ["gini", "entropy"],
        "ccp_alpha": [0.0, 1e-5, 5e-5, 1e-4, 5e-4, 1e-3, 5e-3, 1e-2],
        "class_weight": [None, "balanced"],
    },
    "Random Forest": {
        "n_estimators": [100, 200, 300, 400, 500],
        "max_depth": [5, 8, 10, 12, 15, 20, None],
        "min_samples_leaf": [1, 2, 5, 10, 20, 50],
        "max_features": ["sqrt", "log2", 0.3, 0.5],
        "class_weight": [None, "balanced"],
    },
    "Gradient Boosting": {
        "n_estimators": [100, 200, 300, 400, 600],
        "learning_rate": loguniform(0.01, 0.2),
        "max_depth": [2, 3, 4, 5],
        "subsample": [0.6, 0.7, 0.8, 0.9, 1.0],
        "class_weight": [None, "balanced"],
    },
}


def clean_name(p: str) -> str:
    return p.replace("param_", "").replace("clf__", "")


def clean_params(params: Dict[str, Any]) -> Dict[str, Any]:
    out = {}
    for k, v in params.items():
        v = v.item() if hasattr(v, "item") else v      # numpy scalar -> plain Python
        out[clean_name(k)] = v
    return out


def describe_space(name: str) -> pd.DataFrame:
    """The search space as a readable table."""
    rows = []
    for p, dist in SEARCH_SPACES[name].items():
        if hasattr(dist, "rvs"):
            args = getattr(dist, "args", ())
            desc = f"log-uniform between {args[0]:g} and {args[1]:g}"
        else:
            desc = ", ".join(str(v) for v in dist)
        rows.append({"hyperparameter": clean_name(p), "candidate values": desc})
    return pd.DataFrame(rows)


# ----------------------------------------------------------------------------- the search
def run_search(name: str, X: pd.DataFrame, y: pd.Series) -> RandomizedSearchCV:
    """RandomizedSearchCV over TimeSeriesSplit, selecting on PR-AUC. Refits the best config on ALL of train.csv."""
    search = RandomizedSearchCV(
        estimator=build_estimator(name),
        param_distributions=SEARCH_SPACES[name],
        n_iter=N_ITER,
        scoring=SCORING,
        refit=PRIMARY,
        cv=bc.get_cv(),
        n_jobs=N_JOBS,
        random_state=SEARCH_SEED,
        return_train_score=True,
        error_score="raise",
    )
    search.fit(X, y)
    return search


def results_frame(search: RandomizedSearchCV) -> pd.DataFrame:
    """All tried combinations, best first: hyperparameters + mean/std CV scores."""
    cv = pd.DataFrame(search.cv_results_)
    keep = [c for c in cv.columns if c.startswith("param_")]
    out = cv[keep].copy()
    out.columns = [clean_name(c) for c in keep]
    # an un-set option (e.g. class_weight=None, max_depth=None) is shown as the word "None", not as a blank/NaN
    out = out.astype(object).where(out.notna(), "None")
    for m in METRICS:
        out[m] = cv[f"mean_test_{m}"].round(4)
    out["pr_auc_std"] = cv["std_test_pr_auc"].round(4)
    out["train_pr_auc"] = cv["mean_train_pr_auc"].round(4)
    out["fit_seconds"] = cv["mean_fit_time"].round(2)
    out["rank"] = cv[f"rank_test_{PRIMARY}"]
    return out.sort_values("rank").reset_index(drop=True)


def best_summary(name: str, search: RandomizedSearchCV) -> Dict[str, Any]:
    """Mean/std of every metric for the best configuration."""
    i = search.best_index_
    cv = search.cv_results_
    row: Dict[str, Any] = {"model": name, "variant": "tuned"}
    for m in METRICS:
        row[m] = round(float(cv[f"mean_test_{m}"][i]), 4)
        row[m + "_std"] = round(float(cv[f"std_test_{m}"][i]), 4)
    row["train_accuracy"] = round(float(cv["mean_train_accuracy"][i]), 4)
    row["train_pr_auc"] = round(float(cv["mean_train_pr_auc"][i]), 4)
    return row


def best_fold_scores(search: RandomizedSearchCV) -> pd.DataFrame:
    """Per-fold scores of the best configuration (one row per fold)."""
    i, cv = search.best_index_, search.cv_results_
    n = bc.N_SPLITS
    return pd.DataFrame({"fold": range(1, n + 1),
                         **{m: [float(cv[f"split{k}_test_{m}"][i]) for k in range(n)] for m in METRICS}}).round(4)


def baseline_reference(name: str) -> pd.DataFrame:
    """Baseline (05a-05d) summary rows for this model, from the CSVs the baseline notebooks saved."""
    path = bc.OUT_DIR / f"baseline_{bc.slug(name)}_folds.csv"
    if not path.exists():
        raise FileNotFoundError(f"{path} not found - run the matching 05x baseline notebook first.")
    return bc.summarize(pd.read_csv(path))


def compare_to_baseline(name: str, search: RandomizedSearchCV) -> pd.DataFrame:
    """Baseline variants and the tuned model side by side, with deltas against the better baseline variant."""
    base = baseline_reference(name)
    tuned = pd.DataFrame([best_summary(name, search)])
    cols = ["model", "variant"] + [c for m in METRICS for c in (m, m + "_std")] + ["train_accuracy"]
    table = pd.concat([base[[c for c in cols if c in base.columns]], tuned[cols]], ignore_index=True)
    best_base = base.sort_values("pr_auc", ascending=False).iloc[0]
    table["pr_auc_vs_best_baseline"] = (table["pr_auc"] - best_base["pr_auc"]).round(4)
    table["f1_vs_best_baseline"] = (table["f1"] - best_base["f1"]).round(4)
    return table


def train_vs_validation(search: RandomizedSearchCV) -> pd.DataFrame:
    """Overfitting check for the best configuration: PR-AUC on training rows vs unseen validation rows."""
    s = best_summary("x", search)
    return pd.DataFrame([{"train_pr_auc": s["train_pr_auc"], "validation_pr_auc": s["pr_auc"],
                          "gap": round(s["train_pr_auc"] - s["pr_auc"], 4),
                          "train_accuracy": s["train_accuracy"], "validation_accuracy": s["accuracy"]}])


def selection_optimism(search: RandomizedSearchCV, k: int = 5) -> pd.DataFrame:
    """
    The best score is the maximum over N_ITER noisy estimates, so it is slightly optimistic.
    Comparing it with the mean of the top-k configurations shows how flat the top of the search is.
    """
    r = results_frame(search)
    return pd.DataFrame([{"best_pr_auc": r["pr_auc"].iloc[0], f"mean_of_top_{k}": round(r["pr_auc"].head(k).mean(), 4),
                          "median_of_all_tried": round(r["pr_auc"].median(), 4),
                          "worst_tried": r["pr_auc"].min(), "std_across_folds_of_best": r["pr_auc_std"].iloc[0]}])


def unwrap(name: str, fitted):
    """The plain scikit-learn model to save (so the backend does not need this module to load it)."""
    return fitted.model_ if name == "Gradient Boosting" else fitted


def save_search(name: str, search: RandomizedSearchCV) -> Dict[str, str]:
    """Write every result file the comparison notebook (06e) reads, and save the tuned model."""
    s = bc.slug(name)
    paths = {
        "cv_results": TUNE_DIR / f"tuning_{s}_cv_results.csv",
        "best_folds": TUNE_DIR / f"tuning_{s}_best_folds.csv",
        "summary": TUNE_DIR / f"tuning_{s}_summary.csv",
        "best_json": TUNE_DIR / f"tuning_{s}_best.json",
        "model": TUNED_MODEL_DIR / f"{s}_tuned.pkl",
    }
    results_frame(search).to_csv(paths["cv_results"], index=False)
    best_fold_scores(search).to_csv(paths["best_folds"], index=False)
    compare_to_baseline(name, search).to_csv(paths["summary"], index=False)
    payload = {"model": name, "best_params": clean_params(search.best_params_),
               "search_n_iter": N_ITER, "scoring": PRIMARY, "cv": f"TimeSeriesSplit({bc.N_SPLITS})",
               **best_summary(name, search)}
    paths["best_json"].write_text(json.dumps(payload, indent=2, default=str))
    joblib.dump(unwrap(name, search.best_estimator_), paths["model"])
    return {k: str(v) for k, v in paths.items()}


# ----------------------------------------------------------------------------- plotting
def plot_param_effects(name: str, search: RandomizedSearchCV, save: bool = True):
    """One panel per hyperparameter: every tried value against its CV PR-AUC."""
    res = results_frame(search)
    params = [clean_name(p) for p in SEARCH_SPACES[name]]
    n = len(params)
    cols = 3 if n > 3 else n
    rows = int(np.ceil(n / cols))
    fig, axes = plt.subplots(rows, cols, figsize=(4.6 * cols, 3.6 * rows), squeeze=False)
    for ax, p in zip(axes.ravel(), params):
        vals = res[p]
        numeric = pd.to_numeric(vals.where(vals.notna(), np.nan), errors="coerce")
        if numeric.notna().all() and vals.nunique() > 3:
            ax.scatter(numeric, res["pr_auc"], alpha=0.7)
            if numeric.max() / max(numeric[numeric > 0].min(), 1e-12) > 100:
                ax.set_xscale("log")
        else:
            cats = vals.map(str)
            def _key(v):                       # numbers in numeric order, the word "None" last
                try:
                    return (0, float(v), v)
                except ValueError:
                    return (1, 0.0, v)
            order = sorted(cats.unique(), key=_key)
            for i, c in enumerate(order):
                sub = res.loc[cats == c, "pr_auc"]
                ax.scatter(np.full(len(sub), i) + np.random.RandomState(0).uniform(-0.12, 0.12, len(sub)), sub, alpha=0.7)
            ax.set_xticks(range(len(order))); ax.set_xticklabels(order, rotation=30, ha="right", fontsize=8)
        ax.set_title(p, fontsize=10); ax.set_ylabel("CV PR-AUC")
    for ax in axes.ravel()[n:]:
        ax.axis("off")
    plt.suptitle(f"{name}: effect of each hyperparameter on CV PR-AUC ({len(res)} combinations tried)")
    plt.tight_layout()
    if save:
        plt.savefig(TUNE_DIR / f"tuning_{bc.slug(name)}_param_effects.png", dpi=130)
    plt.show()