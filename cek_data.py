import pandas as pd

files = ["instructors.csv", "students.csv", "courses.csv", "enrollments.csv", "quiz_results.csv"]

for f in files:
    df = pd.read_csv(f)
    print(f"=== {f} ({df.shape[0]} baris, {df.shape[1]} kolom) ===")
    print("Kolom:", list(df.columns))
    print(df.head(2), "\n")