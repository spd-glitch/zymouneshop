# Deployment Guide — Zymoune Feeds Supply
# Platform: Render (Frontend + Backend — All in One)

Your Node.js backend already serves your HTML pages directly, so you only need **Render**.
No Netlify needed. One platform, one deployment, everything works together.

---

## How It Works

```
Render (One Service)
├── Backend  → src/app.js (Node.js API)
├── Frontend → login.html, admin-dashboard.html, staff-dashboard.html, etc.
└── Database → MongoDB Atlas (free cloud database)
```

---

## Files That Matter for Deployment

You don't need to copy or move anything. Just make sure these exist in your repo:

| File | Purpose |
|------|---------|
| `package.json` | Tells Render how to install and start your app |
| `src/app.js` | Your main server — serves both API and HTML pages |
| `render.yaml` | Auto-configures Render settings (already in your project) |
| `config.example.env` | Shows what environment variables you need to set |
| `.gitignore` | Makes sure your `.env` secrets are NOT uploaded to GitHub |

---

## Before You Start — Set Up MongoDB Atlas

Your app needs a database. Use MongoDB Atlas (free).

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free and create a new project
3. Click **Build a Database** → choose **Free (M0)** tier
4. Create a username and password — save these, you'll need them
5. Go to **Network Access** → click **Add IP Address** → choose **Allow Access from Anywhere** (`0.0.0.0/0`)
6. Go to **Database** → click **Connect** → **Drivers**
7. Copy the connection string, it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password and add the database name:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/feeds_store?retryWrites=true&w=majority&appName=Cluster0
   ```
   Save this — you'll paste it into Render later.

---

## Step 1 — Push Your Project to GitHub

Render deploys directly from GitHub, so your project must be there first.

1. Go to [https://github.com](https://github.com) and sign up or log in
2. Click **New repository**
3. Name it `zymounefeedsupply`, set it to **Public**, click **Create repository**
4. Upload your project files to that repo

> If your project is already on GitHub, skip this step.

---

## Step 2 — Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Click **Get Started for Free**
3. Sign up using your **GitHub account** — this links them together automatically

---

## Step 3 — Create a New Web Service

1. On the Render dashboard, click **New +**
2. Select **Web Service**
3. Click **Connect account** if GitHub isn't linked yet, then authorize it
4. Find your `zymounefeedsupply` repo in the list
5. Click **Connect**

---

## Step 4 — Configure Build Settings

Fill in these fields exactly:

| Field | Value |
|-------|-------|
| Name | `feeds-store-api` |
| Region | Choose the closest to your location |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

---

## Step 5 — Add Environment Variables

Scroll down to the **Environment Variables** section and add each one:

| Key | Value |
|-----|-------|
| `PORT` | `4000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string from earlier |
| `JWT_SECRET` | Any long random text (e.g. `zymoune-secret-key-2024`) |
| `JWT_EXPIRES_IN` | `24h` |
| `EMAIL_FROM` | `zymouneshop@gmail.com` |
| `SENDGRID_API_KEY` | Your SendGrid key (only needed if you use email features) |

> ⚠️ Never put these values in your code or upload your `.env` file to GitHub.
> Always enter them here in the Render dashboard.

---

## Step 6 — Deploy

1. Click **Create Web Service**
2. Render will start building — you'll see live logs at the bottom
3. Wait until you see **"Deploy succeeded"**
4. Your live URL will be:
   ```
   https://feeds-store-api.onrender.com
   ```

---

## Step 7 — Test Your Deployment

Open these URLs in your browser to confirm everything works:

| URL | What you should see |
|-----|-------------------|
| `https://feeds-store-api.onrender.com` | Redirects to login page |
| `https://feeds-store-api.onrender.com/login.html` | Login page |
| `https://feeds-store-api.onrender.com/api/health` | `{ "status": "OK" }` |
| `https://feeds-store-api.onrender.com/admin-dashboard.html` | Admin dashboard |

If the login page loads and `/api/health` returns OK — your app is fully live.

---

## Step 8 — Add a Custom Domain (Optional)

### 8.1 Add Domain in Render

1. Go to your Web Service on the Render dashboard
2. Click the **Settings** tab
3. Scroll down to **Custom Domains**
4. Click **Add Custom Domain**
5. Type your domain (e.g. `www.zymounefeedsupply.com`) and click **Save**

---

### 8.2 Set Up DNS in Your Domain Registrar

Go to wherever you bought your domain (GoDaddy, Namecheap, etc.) and add a DNS record.

**For `www.yourdomain.com`:**

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `feeds-store-api.onrender.com` |

**For root domain `yourdomain.com` (no www):**

| Type | Name | Value |
|------|------|-------|
| A | `@` | *(IP address shown by Render — copy it from the dashboard)* |

---

### 8.3 Wait for Verification

1. DNS changes take **5 minutes to 24 hours** to fully apply
2. Go back to Render — your domain will show a green ✅ when verified
3. Render automatically gives you a **free SSL certificate (HTTPS)**

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails | Check Build Command is `npm install` and Start Command is `npm start` |
| MongoDB connection error | In Atlas → Network Access → make sure `0.0.0.0/0` is added |
| Login works but data doesn't load | Double-check your `MONGODB_URI` value in Render env variables |
| Site goes to sleep | Free tier sleeps after 15 min of no traffic — upgrade to a paid plan for always-on |
| Custom domain not working | Wait longer — DNS can take up to 24 hours |
| Page loads but shows blank | Check Render logs for errors in the dashboard |
