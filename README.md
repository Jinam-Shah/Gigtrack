# 💼 GigTrack — Hustle Tracker & Earnings Dashboard

> A full-stack personal side hustle tracker for students in the gig economy.
> Log every gig, rate your clients, track earnings on a visual dashboard,
> set monthly income goals, and monitor your payout progress — all in one place.

---

## 👥 Authors

| Name           | GitHub                                                 |
| -------------- | ------------------------------------------------------ |
| Jinam Shah     | [@Jinam-Shah](https://github.com/Jinam-Shah)           |
| Sanket Kothari | [@Reachout-git-sk](https://github.com/Reachout-git-sk) |

---

## 🔗 Links

- **Class:** [Web Development Online — Spring 2026](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)
- **GitHub Repo:** [https://github.com/Jinam-Shah/Gigtrack](https://github.com/Jinam-Shah/Gigtrack)
- **Live Demo:** [https://gigtrack.onrender.com](https://gigtrack.onrender.com)
- **Video Demo:** [https://youtu.be/uvl8GMEbcXE](https://youtu.be/uvl8GMEbcXE)

---

## 🖼️ Screenshots

### Login Page

![Home Page](screenshots/login.png)

### My Gigs

![My Gigs](screenshots/Mygigs.png)

### Earnings Dashboard

![Dashboard](screenshots/dashboard.png)

### Goals & Payouts

![Goals](screenshots/goals.png)

---

## 🎯 Project Objective

Students juggle more side hustles than ever — tutoring, DoorDash, freelance design,
retail shifts, and campus jobs — but have no single place to see what they actually
earned, which clients were worth it, and whether they are hitting their monthly income
target.

**GigTrack** is a personal side hustle tracker that solves this with two independent
but complementary modules:

- **Gigs Module (Jinam):** Log every gig with full details, rate clients, filter
  entries, and view a visual earnings dashboard with monthly totals and gig-type
  breakdown.
- **Goals Module (Sanket):** Set monthly income targets, log payouts as received
  or pending, view color-coded health status (on track / at risk / missed), and
  track a goal streak for consecutive months hitting the target.

Each module is fully functional on its own and together they form a complete
earnings dashboard for the gig economy.

---

## 👤 User Personas

### 🎓 The Multi-Hustle Student — Caleb

Caleb juggles tutoring, library shifts, and Fiverr work. He wants one place to
log all his income streams and see a real monthly total without using complex
invoicing software. GigTrack gives him a single dashboard for all his work.

### 🚗 The Gig Economy Regular — Chet

Chet does DoorDash and retail shifts regularly. He wants to compare his hourly
rate across gig types and see which month was most profitable. GigTrack's
earnings dashboard and gig-type breakdown give him exactly that.

### 💰 The Goal-Driven Saver — Scarlet

Scarlet is saving for a specific purchase. She sets a monthly income target,
logs every payout, and wants a clear on-track or at-risk indicator rather than
raw numbers. GigTrack's color-coded goal health status gives her instant clarity.

---

## 📖 User Stories

### Jinam Shah — Gig Entries & Earnings Dashboard

- As a **new user**, I want to register with a name, email, and password so my
  gig data is tied to my account.
- As a **returning user**, I want to log in and log out so my dashboard is private.
- As a **user**, I want to log a gig with a title, client name, gig type
  (tutoring / delivery / design / retail / other), date, hours worked, and rate
  (hourly or flat) so I have a full record of my work.
- As a **user**, I want to rate my client on a 1–5 scale and add a short note so
  I remember who is worth working with again.
- As a **user**, I want to edit or delete a gig entry so I can correct mistakes
  or remove cancelled work.
- As a **user**, I want to filter my gigs by type, client, and date range so I
  can find specific entries quickly.
- As a **user**, I want a visual earnings dashboard showing monthly totals and a
  breakdown by gig type so I can see where my money comes from.

### Sanket Kothari — Income Goals & Payout Tracking

- As a **user**, I want to create a monthly income goal with a target amount,
  month, and label so I have something concrete to work toward.
- As a **user**, I want to edit or delete a goal so I can adjust targets as my
  plans change.
- As a **user**, I want to log a payout against a goal with an amount, source,
  date, and status (received / pending) so I know what has landed in my account
  versus what I am still owed.
- As a **user**, I want to edit or delete a payout entry so I can correct
  mistakes in my ledger.
- As a **user**, I want each goal to show a color-coded health status — on track
  (green), at risk (amber), or missed (red) — based on received amount versus
  target and days left in the month.
- As a **user**, I want to filter goals by month and health status so I can
  quickly find goals that need attention.
- As a **user**, I want to see how many months in a row I have hit my income
  goal (my goal streak) so staying consistent feels rewarding.

---

## 🛠️ Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Frontend       | React 19 + Vite + React Bootstrap 5           |
| Routing        | React Router v7                               |
| Backend        | Node.js + Express (ES Modules)                |
| Database       | MongoDB (native Node.js driver — no Mongoose) |
| Authentication | Passport.js (LocalStrategy) + bcrypt          |
| Sessions       | express-session + connect-mongo               |
| Build Tool     | Vite                                          |
| Linting        | ESLint                                        |
| Formatting     | Prettier                                      |

---

## 📁 Project Structure

```
Gigtrack/
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── _redirects               # Routing for deployment
│   ├── src/
│   │   ├── components/
│   │   │   ├── EarningsDashboard/   # EarningsDashboard.jsx + EarningsDashboard.css
│   │   │   ├── GigCard/             # GigCard.jsx + GigCard.css
│   │   │   ├── GigForm/             # GigForm.jsx + GigForm.css
│   │   │   ├── GigList/             # GigList.jsx + GigList.css
│   │   │   ├── GoalCard/            # GoalCard.jsx + GoalCard.css
│   │   │   ├── GoalForm/            # GoalForm.jsx + GoalForm.css
│   │   │   ├── GoalList/            # GoalList.jsx + GoalList.css
│   │   │   ├── LoginForm/           # LoginForm.jsx + LoginForm.css
│   │   │   ├── Navbar/              # Navbar.jsx + Navbar.css
│   │   │   ├── PayoutForm/          # PayoutForm.jsx + PayoutForm.css
│   │   │   ├── PayoutList/          # PayoutList.jsx + PayoutList.css
│   │   │   ├── RegisterForm/        # RegisterForm.jsx + RegisterForm.css
│   │   │   └── StreakBadge/         # StreakBadge.jsx + StreakBadge.css
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Earnings dashboard page
│   │   │   ├── GigsPage.jsx         # Gig list page
│   │   │   ├── GoalsPage.jsx        # Goals page
│   │   │   ├── HomePage.jsx         # Landing page
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   └── RegisterPage.jsx     # Registration page
│   │   ├── App.jsx                  # Root component + routing
│   │   └── main.jsx                 # React entry point
│   ├── .eslintrc.json
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node/Express backend
│   ├── db/
│   │   └── connection.js            # MongoDB connection singleton
│   ├── routes/
│   │   ├── users.js                 # Auth routes + Passport.js config
│   │   ├── gigs.js                  # Gigs CRUD + dashboard aggregation
│   │   └── goals.js                 # Goals + embedded payouts CRUD
│   ├── seed/
│   │   ├── seedGigs.js              # Seeds 1000 synthetic gig records
│   │   ├── seedGoals.js             # Seeds synthetic goal records
│   │   └── fixDemoUser.js           # Utility to reset demo user
│   ├── .eslintrc.json
│   ├── index.js                     # Express app entry point
│   └── package.json
│
├── screenshots/                     # App screenshots for README
├── LICENSE                          # MIT License
└── README.md
```

---

## 🗄️ Database Schema

### `users` collection (Jinam)

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string (bcrypt)",
  "createdAt": "Date"
}
```

### `gigs` collection (Jinam)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "title": "string",
  "clientName": "string",
  "gigType": "tutoring | delivery | design | retail | other",
  "date": "Date",
  "hoursWorked": "number",
  "rate": "number",
  "rateType": "hourly | flat",
  "earnings": "number (computed server-side)",
  "clientRating": "1–5 | null",
  "clientNote": "string",
  "status": "completed | in-progress | unpaid",
  "createdAt": "Date"
}
```

### `goals` collection (Sanket)

```json
{
  "_id": "ObjectId",
  "label": "string",
  "targetAmount": "number",
  "month": "YYYY-MM",
  "payouts": [
    {
      "_id": "ObjectId",
      "source": "string",
      "amount": "number",
      "date": "Date",
      "status": "received | pending"
    }
  ],
  "createdAt": "Date"
}
```

---

## 🚀 Instructions to Build Locally

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A MongoDB Atlas account (free tier is sufficient)

### 1. Clone the Repository

```bash
git clone https://github.com/Jinam-Shah/Gigtrack.git
cd Gigtrack
```

### 2. Configure the Server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gigtrack?retryWrites=true&w=majority
SESSION_SECRET=any_long_random_string_here
PORT=5000
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

### 3. Configure the Client

```bash
cd ../client
npm install
```

### 4. Seed the Database

```bash
cd ../server
node seed/seedGigs.js
node seed/seedGoals.js
```

This creates:

- **1000 synthetic gig records** spread across 2024
- **Synthetic goal records** for each month
- A **demo account** you can use to log in immediately:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `seed@gigtrack.com` |
| Password | `demo1234`          |

### 5. Run the Application

Open **two terminals simultaneously**:

**Terminal 1 — Start the backend:**

```bash
cd server
node index.js
# Expected output:
# Connected to MongoDB
# Server running on http://localhost:5000
```

**Terminal 2 — Start the frontend:**

```bash
cd client
npm run dev
# Expected output:
# VITE ready in Xs
# Local: http://localhost:5173/
```

### 6. Open in Browser

Navigate to **[http://localhost:5173](http://localhost:5173)**

---

## 💡 How to Use GigTrack

1. **Register** a new account or use the **Demo Account** on the login page
2. **Log a Gig** — click "+ Log a Gig" on the My Gigs page, fill in the details
3. **Rate your client** — give a 1–5 star rating and add a note
4. **View Dashboard** — see your monthly earnings and breakdown by gig type
5. **Create a Goal** — go to Goals, click "+ New Goal", set a target amount and month
6. **Log Payouts** — expand any goal and click "+ Add Payout" to track income
7. **Monitor Health** — goals show 🟢 On Track / 🟡 At Risk / 🔴 Missed automatically
8. **Track Streak** — hit your goal multiple months in a row to see your 🔥 streak

---

## ✅ Technical Independence

Both modules are **fully functional independently**:

| Feature        | Jinam Shah                                                            | Sanket Kothari                                                    |
| -------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Collections    | `users`, `gigs`                                                       | `goals`                                                           |
| CRUD           | Full CRUD on gigs                                                     | Full CRUD on goals + payouts                                      |
| Components     | LoginForm, RegisterForm, GigList, GigForm, GigCard, EarningsDashboard | GoalList, GoalForm, GoalCard, PayoutForm, PayoutList, StreakBadge |
| Extra Features | Gig filtering, earnings aggregation, visual dashboard                 | Health status logic, streak tracking, payout status               |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
