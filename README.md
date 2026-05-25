# Portfolio Demo Site

A clean, auto-updating portfolio website for local service businesses.
Photos are pulled live from a Google Drive folder — no CMS, no logins, no manual updates.

## How it works

1. Business owner creates a Google Drive folder and shares it publicly (Viewer)
2. They upload job photos to the folder
3. The site automatically displays those photos in the gallery
4. New photos appear on the site immediately — no code changes needed

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_GOOGLE_DRIVE_FOLDER_ID` | ID from the Google Drive folder URL |
| `VITE_BUSINESS_NAME` | Displayed in nav, footer, and page title |
| `VITE_CONTACT_EMAIL` | Shown on the Contact page |
| `VITE_CONTACT_PHONE` | Shown on the Contact page |
| `VITE_BIO` | Short tagline shown on the home page |
| `VITE_INSTAGRAM_HANDLE` | Optional — adds an Instagram link to the footer |

### 3. Get a Google Drive folder ID

1. Create a new folder in Google Drive
2. Right-click → **Share** → change to **"Anyone with the link"** → **Viewer**
3. Copy the folder ID from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_IS_THE_ID`**
4. Paste it as `VITE_GOOGLE_DRIVE_FOLDER_ID` in your `.env`

### 4. Set up Formspree (contact form)

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — copy the form ID (looks like `xabcdefg`)
3. In `src/components/ContactInfo.tsx`, replace `YOUR_FORMSPREE_ID` with your ID

### 5. Run locally

```bash
npm run dev
```

---

## Deploy to GitHub Pages

### One-time setup

1. Push the repo to GitHub
2. Go to **Settings → Secrets and variables → Actions**
3. Add each variable from `.env.example` as a Repository Secret
4. Go to **Settings → Pages** → set source to **GitHub Actions**

### Deploy

Push to `main` — GitHub Actions builds and deploys automatically.

---

## Customizing for a new client

| What to change | Where |
|---|---|
| Business name, phone, email | GitHub Secrets |
| Service descriptions | `src/components/Services.tsx` |
| Logo | Replace `public/images/logo-light.png` and `public/images/logo-dark.png` |
| Photo gallery | Client adds/removes photos in their Google Drive folder |
| Contact form destination | Formspree dashboard (no code change needed) |

---

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Formspree (contact form)
- GitHub Actions + GitHub Pages (deployment)
