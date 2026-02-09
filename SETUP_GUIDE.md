# Quick Setup Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Sanity
```bash
npx sanity login
npx sanity init
```

When prompted, confirm the default plan.

**Important**: Copy your Project ID - you'll need it for the next step.

### 3. Set Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your **actual Sanity Project ID**:
```env
PUBLIC_SANITY_PROJECT_ID=your_project_id_here  # Paste your actual ID
PUBLIC_SANITY_DATASET=production              # Usually 'production'
PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Note**: The codebase reads credentials from environment variables only.

### 4. Start Sanity Studio
```bash
npm run studio
```

Open http://localhost:3333 and create:
- Profile (About Me + Image)
- At least one Work (mark as Featured)
- Optional: Add an Event

### 5. Start Astro Dev Server
```bash
npm run dev
```

Visit http://localhost:4321 to see your site!

### 6. Deploy Sanity Studio (for iPhone editing)
```bash
npm run studio:deploy
```

Bookmark the URL on your iPhone for mobile content editing.

### 7. Deploy to GitHub Pages

1. Enable GitHub Pages in repo settings (Source: GitHub Actions)
2. Add secrets with your **actual values**:
   - `PUBLIC_SANITY_PROJECT_ID` = (your project ID from step 2)
   - `PUBLIC_SANITY_DATASET` = `production`
   - `PUBLIC_SANITY_API_VERSION` = `2024-01-01`
3. Update `astro.config.mjs`:
   - Set `site` to `https://YOUR_USERNAME.github.io`
   - Set `base` to `/pottery-website`
4. Push to main branch

Your site will be live at: `https://YOUR_USERNAME.github.io/pottery-website/`

## Next Steps

- Customize colors in `tailwind.config.mjs`
- Update contact information in `src/pages/contact.astro`
- Add your social media links
- Upload your pottery photos to Sanity Studio

## Mobile Editing

1. Open your Sanity Studio URL on iPhone
2. Login
3. Edit content anytime, anywhere
4. Site rebuilds automatically (with webhook) or manually push to trigger

For detailed instructions, see README.md
