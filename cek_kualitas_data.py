import pandas as pd

files = {
    "instructors": "instructors.csv",
    "students": "students.csv",
    "courses": "courses.csv",
    "enrollments": "enrollments.csv",
    "quiz_results": "quiz_results.csv"
}

dfs = {name: pd.read_csv(path) for name, path in files.items()}

print("=== 1. CEK MISSING VALUES & DUPLIKAT ===")
for name, df in dfs.items():
    print(f"\n--- {name.upper()} (Total: {len(df)} baris) ---")
    print(f"Duplikat baris persis : {df.duplicated().sum()}")
    
    missing = df.isnull().sum()
    missing = missing[missing > 0]
    if missing.empty:
        print("Missing value         : Tidak ada (0)")
    else:
        for col, cnt in missing.items():
            pct = (cnt / len(df)) * 100
            print(f"Missing '{col}' : {cnt} baris ({pct:.2f}%)")

print("\n=== 2. CEK ANOMALI & KONSISTENSI DATA ===")
# Cek status kursus
print("Distribusi status courses:\n", dfs["courses"]["status"].value_counts(dropna=False))

# Cek anomali di enrollments (selesai 100% tapi completion_date kosong, atau sebaliknya)
enr = dfs["enrollments"]
aneh_enr = enr[(enr["completion_pct"] == 100) & (enr["completion_date"].isnull())]
print(f"\nEnrollments 100% tapi tanggal selesai kosong : {len(aneh_enr)}")
print(f"Rentang completion_pct : {enr['completion_pct'].min()} s/d {enr['completion_pct'].max()}")

# Cek anomali skor di quiz_results
qz = dfs["quiz_results"]
print(f"Rentang skor kuis      : {qz['score'].min()} s/d {qz['score'].max()}")
print(f"Skor kuis < 0 atau > 100: {len(qz[(qz['score'] < 0) | (qz['score'] > 100)])}")

# Cek integritas relasi ID (orphan records)
orphan_stu = set(enr["student_id"]) - set(dfs["students"]["student_id"])
orphan_crs = set(enr["course_id"]) - set(dfs["courses"]["course_id"])
print(f"Student ID di enrollments tanpa profil : {len(orphan_stu)}")
print(f"Course ID di enrollments tanpa katalog : {len(orphan_crs)}")