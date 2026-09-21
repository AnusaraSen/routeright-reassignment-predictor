# RouteRight AI

**Machine Learning-Based IT Support Ticket Reassignment Risk Prediction System**

IT3051 – Fundamentals of Data Mining | Mini Project 2026

---

## 1. Overview

IT support incidents are assigned to a support group or analyst at the time they are created, using only the
information available at that point. Some incidents are later **reassigned** to a different group or analyst,
which increases handling time, adds workload, and can affect service-level targets.

**RouteRight AI** is a supervised binary classification system that predicts, at the moment a ticket is created,
whether it is likely to require reassignment later in its lifecycle — so that high-risk assignments can be
flagged for review before an unnecessary transfer happens.

- **Target variable:** `Reassignment Required` → `1` if the incident's final `reassignment_count > 0`, else `0`
- **Task type:** Supervised binary classification
- **Framing:** Decision support only — the system does not automatically reassign tickets

## 2. Problem Statement

> Given the information available when an IT support incident is initially created, can a machine learning
> model predict whether the incident will later require reassignment to another support group or analyst?

Only information available **at ticket creation** is used as input. Anything generated later in the incident
lifecycle (reassignment count, resolution info, later assignment history, etc.) is excluded to prevent data
leakage.

## 3. Dataset

| | |
|---|---|
| **Name** | Incident Management Process Enriched Event Log |
| **Source** | UCI Machine Learning Repository |
| **URL** | https://archive.ics.uci.edu/dataset/498/incident%2Bmanagement%2Bprocess%2Benriched%2Bevent%2Blog |
| **DOI** | 10.24432/C57S4H |
| **License** | CC BY 4.0 |
| **Raw records** | 141,712 event rows |
| **Unique incidents** | 24,918 |
| **Attributes** | 36 |

The raw data is event-level (multiple rows per incident as it moves through states) and is transformed into an
**incident-level** dataset before modelling. Full citation is in [`docs/references.md`](docs/references.md).

## 4. Project Stages & Evaluation Mapping

This project follows the 12-stage workflow defined in the IT3051 Mini Project brief.

| Stage | Description | Weight | Where it lives |
|---|---|---|---|
| 1 | Problem scenario understanding | — | `docs/proposal.pdf` |
| 2 | Dataset identification & instructor validation | — | `docs/dataset_validation/` |
| 3 | EDA | Eval 1 (30%) | `notebooks/02_EDA.ipynb`, `eda_figures/` |
| 4 | Preprocessing & feature engineering | Eval 1 (30%) | `notebooks/03_...ipynb`, `notebooks/04_...ipynb` |
| 5 | **Progress Evaluation 1** — individual viva | 30% | `docs/deliverables_eval1/` |
| 6 | Model development (4+ algorithms) | Eval 2 (30%) | `notebooks_future/05_Model_Baseline.ipynb` |
| 7 | Model optimization & final selection | Eval 2 (30%) | `notebooks_future/06_...ipynb`, `07_...ipynb` |
| 8 | **Progress Evaluation 2** — individual viva | 30% | `docs/deliverables_eval2/` |
| 9 | Backend development | — | `app/backend/` |
| 10 | Frontend development | — | `app/streamlit_app.py` |
| 11 | Technical Report | 20% | `report/technical_report/` |
| 12 | Final Presentation & Demo | 20% | `presentation/` |

## 5. Team & Task Ownership (Evaluation 1)

| Member | ID | Responsibility |
|---|---|---|
| Vidanapathirana A.U.S | IT23666160 | Data understanding, incident-level reconstruction, target construction |
| A.A.V. Pahasera | IT23647428 | Full EDA and data quality analysis |
| M.A.M.D.H. Muhandiram | IT23627314 | Data cleaning, preprocessing, feature engineering |
| I.A. Samararathna | IT23648036 | Leakage validation, feature finalisation, train/test pipeline |

Each member's viva-ready deliverables are documented individually in `docs/deliverables_eval1/`, and updated
per-person contributions are tracked continuously in `docs/contributions.md`.

## 6. Folder Structure

```
routeright-ai/
├── config/                     # config.yaml — paths, seeds, split dates, feature list
├── data/
│   ├── raw/                    # untouched UCI event log
│   ├── interim/                # incident-level reconstructed dataset
│   └── processed/              # final train/test sets
├── eda_figures/                # EDA charts and visualisations
├── notebooks/                  # Evaluation 1 notebooks (01–04)
├── notebooks_future/           # Evaluation 2 notebooks (05–07)
├── models/                     # baseline + tuned model artifacts, fitted pipeline
├── app/                        # Streamlit frontend + backend prediction service
├── tests/                      # leakage, reconstruction, and pipeline consistency tests
├── docs/
│   ├── proposal.pdf
│   ├── references.md
│   ├── dataset_validation/     # instructor approval evidence
│   ├── deliverables_eval1/     # viva prep — Stage 5
│   ├── deliverables_eval2/     # viva prep — Stage 8
│   ├── system_testing_results.md
│   └── contributions.md
├── report/technical_report/    # final Stage 11 submission
└── presentation/                # slides + demo script — Stage 12
```

## 7. Methodology Summary

1. **Reconstruction** — group event rows by `number`, extract initial ticket state, collapse to one row per incident.
2. **Target construction** — derive `Reassignment Required` from the final `reassignment_count`. This column is used **only** to build the label, never as a feature.
3. **EDA** — class balance, missing values, duplicates, cardinality, outliers, and relationships between the target and category/priority/urgency/contact type/location.
4. **Preprocessing & feature engineering** — missing-value imputation, categorical standardisation and encoding (one-hot / frequency / rare-category grouping), time-based features from `opened_at` (hour, day of week, weekend, working hours).
5. **Leakage prevention** — explicit exclusion of `reassignment_count`, `reopen_count`, `resolved_at`, `closed_at`, `close_code`, `resolved_by`, and any later-lifecycle fields from the feature set.
6. **Split strategy** — incident-level, optionally time-aware (older incidents → train, newer → test), ensuring no incident's rows appear in both sets.
7. **Modelling** *(Evaluation 2)* — Logistic Regression, Decision Tree, Random Forest, Gradient Boosting; baseline vs. hyperparameter-tuned comparison using accuracy, precision, recall, F1, confusion matrix, ROC-AUC, and PR-AUC.
8. **Deployment** *(Stages 9–10)* — trained model + preprocessing pipeline served through a backend, with a Streamlit frontend for entering ticket details and viewing a LOW/HIGH reassignment-risk prediction.

## 8. Tools & Technologies

| Category | Tools |
|---|---|
| Language | Python |
| Data handling | Pandas, NumPy |
| Modelling | Scikit-learn, XGBoost / LightGBM |
| Visualisation | Matplotlib, Seaborn |
| Interface | Streamlit |
| Environment | Jupyter Notebook |

## 9. Setup

```bash
git clone <repo-url>
cd routeright-ai
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Place the raw dataset at `data/raw/incident_event_log.csv` (download link in Section 3).

Run notebooks in order from `notebooks/01_Data_Understanding_Reconstruction.ipynb` through
`notebooks/04_Leakage_Validation_Split.ipynb` to reproduce the Evaluation 1 pipeline.

To launch the prediction app once a final model is trained (post–Evaluation 2):

```bash
streamlit run app/streamlit_app.py
```

## 10. Limitations & Ethical Considerations

- Raw records are event-level, not ticket-level, and required reconstruction before modelling.
- The binary target is derived, not directly provided in the source data.
- The dataset is anonymised; the project analyses operational patterns only and does not attempt to identify individuals.
- Results come from a single organisation's ServiceNow instance and should not be assumed to generalise elsewhere.
- The system is intended purely as decision support — it does not automatically reassign tickets.

## 11. References

Amaral, C. A. L., Fantinato, M., & Peres, S. M. (2018). *Incident Management Process Enriched Event Log*
[Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C57S4H

Full reference list in [`docs/references.md`](docs/references.md).