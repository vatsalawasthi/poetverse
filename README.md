# PoetVerse — Social & Collaborative Platform for Poets

A full-stack social media and collaborative writing sanctuary designed specifically for poets, writers, spoken word artists, and literature enthusiasts.

Built with **React 19 + Vite + Tailwind CSS** on the frontend, **Spring Boot 3.3.x (Java)** on the backend, and **MongoDB** for document storage.

---

## ✨ Key Features

1. **Poet Feed & Discovery:**
   - Explore verses curated across traditional and contemporary forms: *Sonnets, Haiku & Tanka, Spoken Word, Ghazals, Free Verse, Romanticism, and Elegies*.
   - Filter by Trending (applause), Latest stanzas, Open VerseCollabs, or your Personal Following Circle.
   - Search by bard name, keyword, theme, or poetic meter.

2. **Poetic Sanctuary & Reader Experience:**
   - Distraction-free reading modal with custom reading atmospheres: *Midnight Ink, Warm Parchment, Amber Dusk, and Emerald Moss*.
   - Interactive Marginalia & Line Annotations: Click any line to leave line-by-line feedback, reflections, and rhyme analysis.
   - Poetic typography switchers (*Lora Serif, Playfair Display, Modern Sans*) with custom font-size and line-number controls.
   - Applause and Bookmark mechanics with celebratory animations.

3. **VerseCollab Studio (Co-Writing & Round-Robin):**
   - Collaborative writing threads where poets co-author pieces stanza-by-stanza.
   - Progress trackers, co-author attribution badges, and automatic publishing to the main circle upon completion.
   - Launch custom prompts and invite specific bards to collaborate.

4. **Poet Matchmaker (Synergy Engine):**
   - Proprietary compatibility algorithm (Jaccard similarity index) comparing preferred poetic genres, recurring motifs, and thematic inspirations.
   - View mutual resonance percentages (e.g. *94% Resonance on Sonnets & Melancholy*) and directly invite compatible writers to joint projects.

5. **Bard Portfolios & Personas:**
   - Dedicated poet profiles showcasing solo verses, co-authored pieces, earned accolades (*Master Sonneteer, Crown Poet*), and bio/location.
   - Built-in instant persona switcher to test multi-user collaborative flows effortlessly.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router DOM, Canvas Confetti, Axios.
- **Backend:** Java 17/21+, Spring Boot 3.3.x, Spring Web, Spring Data MongoDB, Lombok, Bean Validation.
- **Database:** MongoDB (Local instance or MongoDB Atlas Cloud URI).

---

## 🚀 Quick Start Guide

### 1. Database Setup (MongoDB)

You can use either a **local MongoDB** or a free cloud **MongoDB Atlas** database:

- **Option A (MongoDB Atlas Cloud - Recommended & Fast):**
  Set the environment variable or update `backend/src/main/resources/application.properties`:
  ```properties
  spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/poetverse?retryWrites=true&w=majority
  ```

- **Option B (Docker Local):**
  Run in the project root:
  ```bash
  docker compose up -d
  ```

---

### 2. Run Backend (Spring Boot)

Navigate to the `backend/` directory:
```bash
cd backend
mvnw.cmd spring-boot:run
```
*(On Linux/macOS: `./mvnw spring-boot:run`)*

The REST API will start on `http://localhost:8080` and automatically seed initial poet personas, published poems, comments, and collaborative threads.

---

### 3. Run Frontend (React + Vite)

Navigate to the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 👥 Seeded Demo Personas

The application comes pre-configured with 5 distinct poet personas for testing:
- **Elena Solis (`@elena_solis`):** Master of Classical Sonnets & Romanticism (Granada, Spain).
- **Malik Vance (`@malik_spoken`):** Spoken Word artist & rhythm architect (Chicago, USA).
- **Kaito Tanaka (`@kaito_tanka`):** Minimalist Haiku & Zen nature observer (Kyoto, Japan).
- **Zoya Mir (`@zoya_mir`):** Contemporary Ghazal & mystic longing writer (Lahore, Pakistan).
- **Vatsal Awasthi (`@vatsal_poet`):** Modern free verse & cosmic philosophy (New Delhi, India).

Switch between these personas in 1-click using the navbar dropdown menu to test round-robin collaboration and matchmaking!
