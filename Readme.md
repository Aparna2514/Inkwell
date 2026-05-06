# 🖋️ Inkwell — Your Personal Digital Diary

> *Your thoughts, bound in beautiful pages. Write every day, cherish forever.*

**Live Demo:** [inkwell-orpin-beta.vercel.app](https://inkwell-orpin-beta.vercel.app)

---

##  Features

- 📔 **Book-themed UI** — every diary entry looks and feels like a real book on a shelf
- ✍️ **Lined paper writing experience** — write your daily entries on a beautiful lined page
- 😊 **Mood tracking** — tag each entry with how you're feeling
- 🎨 **Custom book covers** — pick a color for each day's book
- 🔐 **Secure authentication** — register and login with JWT-based auth
- 📚 **Personal shelf** — all your entries displayed as mini books
- 📖 **Read past entries** — open any book from your shelf and relive the memory
- ☁️ **Cloud hosted** — fully deployed and accessible from anywhere

---

## Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Axios
- CSS3 (3D book animations, lined paper effect)
- Google Fonts — Lora & Playfair Display

### Backend
- Node.js + Express
- PostgreSQL (hosted on Render)
- JWT + bcryptjs (authentication)
- CORS + dotenv

### Deployment
- **Frontend** → Vercel (auto deploys on push to main)
- **Backend** → Render (auto deploys on push to main)
- **Database** → Render PostgreSQL

---

## 🗂️ Project Structure

```
Inkwell/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── api/              # Axios instance with JWT header
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth context
│       ├── pages/            # Home, Dashboard, TodayPage, ReadPage
│       └── styles/           # Theme and book animations
│
└── server/                   # Node.js + Express backend
    ├── config/               # PostgreSQL connection
    ├── controllers/          # Auth and diary logic
    ├── middleware/            # JWT auth middleware
    ├── models/               # SQL schema
    ├── routes/               # API routes
    └── utils/                # JWT helpers
```

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Diary Entries
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  title VARCHAR(255),
  content TEXT,
  mood VARCHAR(50),
  cover_color VARCHAR(20),
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);
```

---

## 🚀 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user (protected) |

### Diary Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | Get all entries for logged in user |
| GET | `/api/entries/:date` | Get single entry by date |
| POST | `/api/entries` | Create a new entry |
| PUT | `/api/entries/:date` | Update an entry |
| DELETE | `/api/entries/:date` | Delete an entry |

---

## 🏃 Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL (or use Render free tier)

### Backend
```bash
cd server
npm install
# Create .env file with:
# DATABASE_URL=your_postgresql_url
# JWT_SECRET=your_secret
# PORT=5000
npm start
```

### Frontend
```bash
cd client
npm install
# Update src/api/axios.js baseURL to http://localhost:5000/api
npm run dev
```

---

## 🔮 Upcoming Features

- 🔍 Search entries by keyword or date
- 📅 Calendar view to navigate by month
- 🌙 Dark mode — dark ink theme
- 📸 Image uploads inside entries
- 📊 Mood analytics chart over time
- 📤 Export diary as PDF

---

## 👩‍💻 Author

**Aparna** — [GitHub @Aparna2514](https://github.com/Aparna2514)

---

> *Built with love, one page at a time* 🖋️