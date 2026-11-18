import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from pydantic import BaseModel
from typing import List, Optional

class CustomUserProfile(BaseModel):
    name: str
    preferred_categories: List[str]
    current_level: str  # "Beginner", "Intermediate", atau "Advanced"
    liked_course_ids: Optional[List[str]] = []

app = FastAPI(title="Skillaju Hybrid Course Recommendation API")

# Izinkan akses dari Frontend React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. LOAD & PREPROCESSING DATA
instructors = pd.read_csv("instructors.csv")
students = pd.read_csv("students.csv")
courses = pd.read_csv("courses.csv")
enrollments = pd.read_csv("enrollments.csv")
quiz_results = pd.read_csv("quiz_results.csv")

# Filter hanya kursus yang berstatus 'published' (45 kursus)
published_courses = courses[courses["status"] == "published"].copy()
published_courses = published_courses.merge(
    instructors[["instructor_id", "name", "expertise"]],
    on="instructor_id",
    how="left"
).rename(columns={"name": "instructor_name"})

# Hitung rata-rata skor kuis per enrollment_id
quiz_agg = quiz_results.groupby("enrollment_id").agg(
    avg_quiz_score=("score", "mean"),
    pass_rate=("passed", "mean")
).reset_index()

# Gabungkan enrollments dengan hasil kuis & metadata kursus
interactions = enrollments.merge(quiz_agg, on="enrollment_id", how="left")
interactions["avg_quiz_score"] = interactions["avg_quiz_score"].fillna(0)
interactions["pass_rate"] = interactions["pass_rate"].fillna(0)

# Buat Implicit Rating (skala 1.0 - 5.0) berdasarkan progres + nilai kuis + sertifikat
interactions["implicit_rating"] = (
    1.0
    + (interactions["completion_pct"] / 100.0) * 2.0
    + (interactions["avg_quiz_score"] / 100.0) * 1.5
    + interactions["certificate_issued"].astype(int) * 0.5
).round(2)

# Filter interaksi hanya pada kursus published
valid_interactions = interactions[
    interactions["course_id"].isin(published_courses["course_id"])
].copy()

# 2. MODEL COLLABORATIVE FILTERING (ITEM-BASED COSINE SIMILARITY)
user_item_matrix = valid_interactions.pivot_table(
    index="student_id",
    columns="course_id",
    values="implicit_rating",
    fill_value=0
)
item_similarity = cosine_similarity(user_item_matrix.T)
item_sim_df = pd.DataFrame(
    item_similarity,
    index=user_item_matrix.columns,
    columns=user_item_matrix.columns
)

# 3. MODEL CONTENT-BASED FILTERING (TF-IDF + COSINE SIMILARITY)
published_courses["content_features"] = (
    published_courses["title"] + " "
    + published_courses["category"] + " "
    + published_courses["level"] + " "
    + published_courses["expertise"].fillna("")
)
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(published_courses["content_features"])
content_sim = cosine_similarity(tfidf_matrix)
content_sim_df = pd.DataFrame(
    content_sim,
    index=published_courses["course_id"],
    columns=published_courses["course_id"]
)

# ================= ENDPOINTS API =================

@app.get("/")
def root():
    return {
        "status": "OK",
        "total_students": len(students),
        "published_courses": len(published_courses),
        "total_interactions": len(valid_interactions)
    }

@app.get("/students")
def get_sample_students(limit: int = 20):
    """Mengambil daftar sampel siswa untuk dropdown login/simulasi di web"""
    sample = students.head(limit)[["student_id", "name", "city", "plan_type"]]
    return sample.to_dict(orient="records")

@app.get("/courses")
def get_all_courses():
    """Mengambil semua katalog kursus yang sudah published"""
    cols = ["course_id", "title", "category", "level", "price_idr",
            "duration_hours", "avg_rating", "total_enrolled", "instructor_name"]
    return published_courses[cols].to_dict(orient="records")

@app.get("/recommend/student/{student_id}")
def recommend_for_student(student_id: str, top_n: int = 5):
    """Rekomendasi Hybrid Personal & Adaptif untuk Siswa"""
    if student_id not in students["student_id"].values:
        raise HTTPException(status_code=404, detail="Student ID tidak ditemukan")

    student_info = students[students["student_id"] == student_id].iloc[0].to_dict()
    student_history = valid_interactions[valid_interactions["student_id"] == student_id].merge(
        published_courses[["course_id", "title", "category", "level"]],
        on="course_id"
    )

    taken_courses = set(student_history["course_id"])
    candidates = published_courses[~published_courses["course_id"].isin(taken_courses)].copy()

    # Cold-start handler jika siswa belum pernah mengambil kursus apa pun
    if student_history.empty:
        popular = candidates.sort_values(by=["avg_rating", "total_enrolled"], ascending=False).head(top_n)
        popular["recommendation_reason"] = "Kursus Terpopuler untuk Pemula"
        return {
            "student": student_info,
            "history": [],
            "recommendations": popular.drop(columns=["content_features"]).to_dict(orient="records")
        }

    # Hitung skor Collaborative Filtering dari riwayat kursus siswa
    cf_scores = {}
    for cid in candidates["course_id"]:
        if cid in item_sim_df.columns:
            sim_scores = [
                item_sim_df.loc[cid, taken_cid] * rating
                for taken_cid, rating in zip(student_history["course_id"], student_history["implicit_rating"])
                if taken_cid in item_sim_df.columns
            ]
            cf_scores[cid] = np.mean(sim_scores) if sim_scores else 0.0
        else:
            cf_scores[cid] = 0.0

    candidates["cf_score"] = candidates["course_id"].map(cf_scores)

    # Deteksi kebutuhan adaptif berdasarkan rata-rata nilai kuis siswa per kategori
    cat_perf = student_history.groupby("category")["avg_quiz_score"].mean().to_dict()
    reasons = []
    boost_scores = []

    for _, row in candidates.iterrows():
        cat = row["category"]
        lvl = row["level"]
        boost = 0.0
        reason = "Disukai siswa dengan pola belajar serupa"

        if cat in cat_perf:
            avg_sc = cat_perf[cat]
            if avg_sc < 70 and lvl.lower() == "beginner":
                boost = 0.35
                reason = f"Penguatan materi dasar {cat} (rata-rata kuis: {avg_sc:.1f})"
            elif avg_sc >= 80 and lvl.lower() in ["intermediate", "advanced"]:
                boost = 0.35
                reason = f"Lanjutan level {lvl} di {cat} (rata-rata kuis: {avg_sc:.1f})"

        boost_scores.append(boost)
        reasons.append(reason)

    candidates["final_score"] = candidates["cf_score"] + boost_scores
    candidates["recommendation_reason"] = reasons

    top_recs = candidates.sort_values(by="final_score", ascending=False).head(top_n)
    return {
        "student": student_info,
        "history": student_history[["course_id", "title", "category", "level", "completion_pct", "avg_quiz_score"]].to_dict(orient="records"),
        "recommendations": top_recs.drop(columns=["content_features"]).to_dict(orient="records")
    }

@app.get("/recommend/course/{course_id}")
def recommend_similar_courses(course_id: str, top_n: int = 4):
    """Rekomendasi Kursus Serupa (Content-Based Filtering)"""
    if course_id not in content_sim_df.index:
        raise HTTPException(status_code=404, detail="Course ID tidak ditemukan atau masih draft")

    sim_series = content_sim_df[course_id].drop(course_id).sort_values(ascending=False).head(top_n)
    similar = published_courses[published_courses["course_id"].isin(sim_series.index)].copy()
    similar["similarity_score"] = similar["course_id"].map(sim_series).round(3)
    similar = similar.sort_values(by="similarity_score", ascending=False)

    return similar.drop(columns=["content_features"]).to_dict(orient="records")

@app.post("/recommend/custom")
def recommend_for_custom_user(profile: CustomUserProfile, top_n: int = 6):
    """Rekomendasi real-time untuk pengguna baru berdasarkan minat, level, dan kursus yang disukai"""
    candidates = published_courses[
        ~published_courses["course_id"].isin(profile.liked_course_ids)
    ].copy()

    scores = []
    reasons = []

    for _, row in candidates.iterrows():
        cid = row["course_id"]
        score = 0.0
        reason_parts = []

        # 1. Skor dari Collaborative Filtering & Content-Based jika user memilih kursus favorit
        if profile.liked_course_ids:
            cf_vals = [
                item_sim_df.loc[cid, liked_id]
                for liked_id in profile.liked_course_ids
                if liked_id in item_sim_df.columns and cid in item_sim_df.columns
            ]
            cb_vals = [
                content_sim_df.loc[cid, liked_id]
                for liked_id in profile.liked_course_ids
                if liked_id in content_sim_df.index and cid in content_sim_df.index
            ]
            cf_score = np.mean(cf_vals) if cf_vals else 0.0
            cb_score = np.mean(cb_vals) if cb_vals else 0.0
            score += (cf_score * 1.5) + (cb_score * 1.5)
            if cf_score > 0.1 or cb_score > 0.1:
                reason_parts.append("Mirip kursus pilihanmu")

        # 2. Skor kecocokan Kategori Minat
        if row["category"] in profile.preferred_categories:
            score += 1.2
            reason_parts.append(f"Sesuai minat {row['category']}")

        # 3. Skor kecocokan Level Kemahiran
        if row["level"].lower() == profile.current_level.lower():
            score += 0.8
            reason_parts.append(f"Cocok untuk level {row['level']}")

        # 4. Bobot kualitas (rating kursus)
        score += (row["avg_rating"] / 5.0) * 0.3

        scores.append(score)
        reasons.append(" • ".join(reason_parts) if reason_parts else "Rekomendasi Populer Terbaik")

    candidates["final_score"] = scores
    candidates["recommendation_reason"] = reasons

    top_recs = candidates.sort_values(by="final_score", ascending=False).head(top_n)
    return {
        "user_name": profile.name,
        "recommendations": top_recs.drop(columns=["content_features"]).to_dict(orient="records")
    }

CUSTOM_USERS_FILE = "custom_users.json"

def load_custom_users():
    if os.path.exists(CUSTOM_USERS_FILE):
        with open(CUSTOM_USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/custom-users")
def get_saved_custom_users():
    """Mengambil semua profil pengguna yang sudah disimpan"""
    return load_custom_users()

@app.post("/custom-users")
def save_custom_user(profile: CustomUserProfile):
    """Menyimpan profil pengguna baru secara permanen ke custom_users.json"""
    users = load_custom_users()
    # Update jika nama sudah ada, atau tambah baru jika belum ada
    existing_idx = next((i for i, u in enumerate(users) if u["name"].lower() == profile.name.lower()), None)
    user_dict = profile.model_dump()
    if existing_idx is not None:
        users[existing_idx] = user_dict
    else:
        users.append(user_dict)

    with open(CUSTOM_USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

    return {"status": "saved", "profile": user_dict, "all_profiles": users}

@app.delete("/custom-users/{user_name}")
def delete_custom_user(user_name: str):
    """Menghapus profil pengguna berdasarkan nama dari custom_users.json"""
    users = load_custom_users()
    new_users = [u for u in users if u["name"].lower() != user_name.lower()]
    if len(new_users) == len(users):
        raise HTTPException(status_code=404, detail="Profil tidak ditemukan")

    with open(CUSTOM_USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(new_users, f, indent=2, ensure_ascii=False)

    return {"status": "deleted", "name": user_name, "all_profiles": new_users}

@app.delete("/custom-users")
def delete_all_custom_users():
    """Menghapus semua profil pengguna tersimpan dari custom_users.json"""
    with open(CUSTOM_USERS_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, indent=2, ensure_ascii=False)

    return {"status": "deleted_all", "all_profiles": []}
