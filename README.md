# TaskR — Skilled Worker Marketplace

Ethiopia's #1 platform connecting customers with verified skilled workers (plumbers, electricians, painters, carpenters, drivers, laborers).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS + Framer Motion |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (stored in localStorage) |
| File Upload | Cloudinary |
| Email | Nodemailer |
| Icons | Lucide React |

---

## 📁 Project Structure

```
taskr/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, WorkerCard, ContactModal, Toast, etc.
│       ├── pages/        # Home, Login, Register, WorkerSearch, Dashboards, etc.
│       ├── hooks/        # useAuth, useWorkers, useContacts, useReviews
│       └── utils/        # api.js, helpers.js
└── server/          # Express backend
    ├── models/       # User, WorkerProfile, ContactRequest, Review, SavedWorker
    ├── controllers/  # auth, worker, contact, review, dashboard
    ├── routes/       # All API routes
    ├── middleware/   # auth.js, errorHandler.js
    └── utils/        # cloudinary.js, emailTemplates.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier works)
- Gmail app password (for Nodemailer)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/taskr.git
cd taskr
```

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskr
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=TaskR <noreply@taskr.com>

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev   # Development with nodemon
npm start     # Production
```

> Backend runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs on **http://localhost:5173**

---

### 4. Seed Database (Optional)

```bash
cd server
node seed.js
```

This creates sample workers, customers, reviews, and contact requests for demo purposes.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@taskr.com | password123 |
| Worker | worker@taskr.com | password123 |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Protected | Get current user |
| PATCH | `/api/auth/password` | Protected | Update password |

### Workers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/workers` | Public | Search & filter workers |
| GET | `/api/workers/:id` | Public | Single worker profile |
| POST | `/api/workers/:id/view` | Public | Increment view count |
| PATCH | `/api/workers/profile` | Worker | Update own profile |
| PATCH | `/api/workers/availability` | Worker | Toggle availability |
| POST | `/api/workers/upload-photo` | Worker | Upload profile photo |
| POST | `/api/workers/upload-sample` | Worker | Add work sample |
| DELETE | `/api/workers/sample/:index` | Worker | Remove work sample |

### Contacts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/contacts` | Customer | Send job request |
| GET | `/api/contacts/customer` | Customer | View own requests |
| GET | `/api/contacts/worker` | Worker | View received requests |
| PATCH | `/api/contacts/:id` | Worker | Accept/Decline/Complete |

### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reviews` | Customer | Submit review |
| GET | `/api/reviews/worker/:id` | Public | Get worker reviews |
| GET | `/api/reviews/customer` | Customer | Get reviews I wrote |

### Bookmarks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookmarks/:workerId` | Customer | Toggle save worker |
| GET | `/api/bookmarks` | Customer | Get saved workers |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/customer` | Customer | Customer stats & activity |
| GET | `/api/dashboard/worker` | Worker | Worker stats & requests |

---

## 🎨 Design System

### Colors
```js
'trust-blue': '#1E40AF'        // Primary — nav, buttons, badges
'construction-orange': '#EA580C' // Accent — CTA, highlights
```

### Fonts
- **Headings**: Montserrat (700, 800, 900)
- **Body**: Inter (400, 500, 600)

### Animations (Framer Motion)
- Page transitions: fade + Y shift (0.22s ease)
- Worker cards: hover lift 4px + shadow deepens
- Stats counter: spring count-up on scroll
- Toast: spring slide-in from right
- Modal: spring scale + slide-up
- Category icons: hover rotate + lift
- Availability toggle: spring thumb translation

---

## 📧 Email Notifications

TaskR sends automatic emails for:
- ✅ New contact request (to worker)
- ✅ Request accepted/declined (to customer)
- ✅ Job completed + review prompt (to customer)
- ✅ Welcome email (to new users)

---

## ☁️ Cloudinary Setup

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `server/.env`

Images are automatically:
- Profile photos: cropped to 400×400, face-gravity
- Work samples: resized to max 800×600
- All: auto-quality and format optimization

---

## 🚢 Deployment

### Backend (Railway / Render)
```bash
# Set all .env variables in your hosting dashboard
# Start command: node server.js
```

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Upload /dist folder or connect GitHub repo
# Set VITE_API_URL to your deployed backend URL
```

### MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string
3. Replace `MONGODB_URI` in backend env

---

## 🧪 Running Tests

```bash
# Backend
cd server && npm test

# Frontend  
cd client && npm test
```

---

## 📝 License

MIT License — free to use for personal and commercial projects.

---

## 🙏 Credits

Built with ❤️ for Ethiopian skilled workers and the people who need them.
