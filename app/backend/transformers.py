"""Custom scikit-learn transformers required by the RouteRight preprocessing pipeline.

These classes match the exact implementations used during model training in
notebooks/04_Leakage_Validation_Split.ipynb and provide a backward-compatibility
registration mechanism for unpickling models/preprocessing_pipeline.pkl.
"""

import sys
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin


class CategoryLabelCleaner(BaseEstimator, TransformerMixin):
    """Strips column-name-restating prefixes from this dataset's anonymized category labels

    (e.g. 'Opened by  17' -> '17') so one-hot column names don't stutter. Purely cosmetic —
    does not affect category frequencies, rare-category grouping, or feature counts.
    """

    def __init__(self, prefix_map=None):
        self.prefix_map = prefix_map or {}

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = pd.DataFrame(X).copy()
        for col, prefix_pattern in self.prefix_map.items():
            if col in X.columns:
                # Only touch non-null entries, so real missing values stay as-is
                # (plain NaN, not pandas' nullable NA) for SimpleImputer to handle next.
                not_null = X[col].notna()
                if not_null.any():
                    X.loc[not_null, col] = (
                        X.loc[not_null, col].astype(str)
                        .str.replace(prefix_pattern, "", regex=True)
                        .str.strip()
                    )
        return X

    def get_feature_names_out(self, input_features=None):
        return np.asarray(input_features)


class RareCategoryGrouper(BaseEstimator, TransformerMixin):
    """Groups categories below `threshold` frequency, learned from training data only, into 'Other'."""

    def __init__(self, threshold=0.01, other_label="Other"):
        self.threshold = threshold
        self.other_label = other_label

    def fit(self, X, y=None):
        X = pd.DataFrame(X)
        self.frequent_categories_ = {}
        for col in X.columns:
            freqs = X[col].value_counts(normalize=True, dropna=True)
            self.frequent_categories_[col] = set(freqs[freqs >= self.threshold].index)
        return self

    def transform(self, X):
        X = pd.DataFrame(X).copy()
        for col in X.columns:
            frequent = self.frequent_categories_.get(col, set())
            X[col] = X[col].where(X[col].isin(frequent), self.other_label)
        return X

    def get_feature_names_out(self, input_features=None):
        return np.asarray(input_features)


def register_custom_transformers():
    """Register custom transformers into __main__ so joblib/pickle can deserialize models/preprocessing_pipeline.pkl."""
    main_mod = sys.modules.get("__main__")
    if main_mod is not None:
        setattr(main_mod, "CategoryLabelCleaner", CategoryLabelCleaner)
        setattr(main_mod, "RareCategoryGrouper", RareCategoryGrouper)


# Automatically register on module import
register_custom_transformers()
