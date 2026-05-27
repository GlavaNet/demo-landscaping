# Portfolio Demo Site

A clean, auto-updating portfolio website for local service businesses.
Photos are pulled live from a Google Drive folder — no CMS, no logins, no manual updates.

## How it works

1. Business owner creates a Google Drive folder and makes it publicly viewable
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
| `VITE_FORMSPREE_ID` | Form ID from formspree.io (enables contact form submissions) |
| `VITE_INSTAGRAM_HANDLE` | Optional — adds an Instagram link to the footer |

### 3. Set up the Google Drive folder

#### Create and share the folder

1. Go to [drive.google.com](https://drive.google.com) and create a new folder
2. Upload your photos into that folder
3. Right-click the folder and select **Share**
4. In the sharing dialog, find the **General access** section near the bottom
5. Click the dropdown (it likely says **Restricted**) and change it to **Anyone with the link**
6. Make sure the role is set to **Viewer**
7. Click **Done**

#### Get the folder ID

1. Open the folder in Google Drive by clicking on it
2. Look at the URL in your browser's address bar — it will look like this:
   ```
   https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs
   ```
3. The folder ID is everything after `/folders/` — in this example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs`
4. Copy that ID and paste it as the value for `VITE_GOOGLE_DRIVE_FOLDER_ID`

#### Verify it's working

To confirm the folder is publicly accessible before deploying, open a new **Incognito/Private** browser window and paste the folder URL. If you can see the photos without being logged in, the sharing is set up correctly.

### 4. Set up Formspree (contact form)

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — copy the form ID from the dashboard (looks like `xabcdefg`)
3. Add that ID as the value for `VITE_FORMSPREE_ID` in your `.env` or GitHub Secrets

No code changes needed — the contact form reads the ID from the environment automatically. If `VITE_FORMSPREE_ID` is not set, the form will display a warning and the submit button will be disabled.

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
| Formspree form ID | GitHub Secrets (`VITE_FORMSPREE_ID`) |
| Service descriptions | `src/components/Services.tsx` |
| Logo | Replace `public/images/logo-light.png` and `public/images/logo-dark.png` |
| Photo gallery | Client adds/removes photos in their Google Drive folder |

---

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Formspree (contact form)
- GitHub Actions + GitHub Pages (deployment)
