# Pottery Website

A modern, high-performance pottery portfolio website built with Astro and Sanity.io. Features a mobile-friendly CMS backend that allows content updates directly from your iPhone, with a sophisticated lightbox gallery inspired by contemporary art galleries.

## Tech Stack

- **Frontend**: Astro 4.x with Tailwind CSS
- **CMS**: Sanity.io (Headless CMS)
- **Hosting**: GitHub Pages (Static Site Generation)
- **Forms**: Formspree/Getform integration
- **Error Tracking**: Sentry
- **Language**: TypeScript

## Features

### Design
- Modern gallery aesthetic with high letter-spacing navigation
- White background with dark grey text (inspired by barrystedman.co.uk)
- Clean, minimal responsive design
- Mobile-first approach

### Gallery & Lightbox
- Interactive lightbox for full-screen image viewing
- Multiple images per pottery piece
- Thumbnail navigation within lightbox
- Keyboard shortcuts (←/→ arrows, ESC to close)
- Touch-friendly mobile navigation
- Smooth transitions and animations

### Content Management
- Mobile-friendly Sanity Studio for iPhone editing
- Multiple images per work with captions
- Category organization (Vessels, Bowls, Plates, etc.)
- Year and dimensions tracking
- Instagram integration
- Stockists listing
- Events management with date sorting

### Performance
- Optimized image loading with Sanity CDN
- WebP format with automatic fallbacks
- Static site generation for fast loading
- SEO-friendly architecture

## Project Structure

```
pottery-website/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment workflow
├── src/
│   ├── components/
│   │   └── ProjectCard.astro      # Reusable card component with lightbox
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main layout with modern navigation
│   ├── pages/
│   │   ├── index.astro            # Home page with gallery grid
│   │   ├── events.astro           # Events/announcements listing
│   │   ├── about.astro            # About page with Instagram link
│   │   ├── stockists.astro        # Stockists listing page
│   │   └── contact.astro          # Contact page with Formspree form
│   └── lib/
│       ├── sanityClient.ts        # Sanity client & TypeScript types
│       └── sentry.ts              # Sentry error tracking
├── schemas/
│   ├── work.ts                    # Work schema (images[], year, dimensions, category)
│   ├── event.ts                   # Event schema with date sorting
│   ├── profile.ts                 # Profile with Instagram handle
│   ├── stockist.ts                # Stockists schema
│   └── index.ts                   # Schema exports
├── sanity.config.ts               # Sanity Studio configuration
├── sanity.cli.ts                  # Sanity CLI configuration
├── astro.config.mjs               # Astro + Sentry configuration
└── tailwind.config.mjs            # Tailwind CSS configuration
```

## Phase 1: Sanity.io Setup

### Step 1: Initialize Sanity Project

1. Install dependencies:
```bash
npm install
```

2. Login to Sanity (first time only):
```bash
npx sanity login
```

3. Initialize the Sanity project:
```bash
npx sanity init
```

When prompted, select:
- Create new project
- Use default dataset configuration (production)
- Confirm the default plan when asked

This will:
- Create a new Sanity project
- Give you a Project ID
- Create a production dataset

4. Update configuration files with your Project ID:
   - Update `sanity.config.ts` line 8
   - Update `sanity.cli.ts` line 4

### Step 2: Start Sanity Studio Locally

```bash
npm run studio
```

This starts the Sanity Studio at `http://localhost:3333`

### Step 3: Create Initial Content

1. Open the Studio and create a Profile:
   - Click "Profile" in the sidebar
   - Add your "About Me" text
   - Upload a profile image

2. Add some works:
   - Click "Work" in the sidebar
   - Create new work entries
   - Add title, year, dimensions, and category
   - Upload multiple images for each piece
   - Mark some as "Featured" to display on homepage

3. Add stockists (optional):
   - Click "Stockist" in the sidebar
   - Add shops/galleries that carry your work
   - Include name, location, website, and description

4. Add events (optional):
   - Click "Event" in the sidebar
   - Add upcoming events with dates and locations

### Step 4: Deploy Sanity Studio (Mobile Access)

Deploy the Studio so you can edit content from your iPhone:

```bash
npm run studio:deploy
```

This will give you a URL like: `https://your-project.sanity.studio`

You can now:
- Bookmark this URL on your iPhone
- Login and edit content from anywhere
- Changes appear on your website after rebuild

## Phase 2: Astro Frontend Setup

### Step 1: Configure Environment Variables

**IMPORTANT**: All Sanity credentials are stored in environment variables, never hardcoded.

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your actual Sanity project values:
```env
PUBLIC_SANITY_PROJECT_ID=your_project_id_here  # Replace with your actual project ID
PUBLIC_SANITY_DATASET=production              # Or your dataset name
PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Where to find your Project ID:**
- Go to https://sanity.io/manage
- Select your project
- Copy the Project ID from the dashboard

**Note**: These values must match what you added to GitHub Secrets.

### Step 2: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Step 3: Customize

1. **Update site metadata** in `astro.config.mjs`:
   - Change `site` to your GitHub Pages URL
   - Update `base` if using a different repo name

2. **Update navigation** in `src/layouts/BaseLayout.astro`:
   - Change site title
   - Update footer text

3. **Update contact info** in `src/pages/contact.astro`:
   - Change email address
   - Update Formspree form ID (line 21)
   - Update Instagram handle

4. **Customize colors** in `tailwind.config.mjs`:
   - Adjust the zinc/grey color palette to your preference

5. **Set up contact form**:
   - Sign up for [Formspree](https://formspree.io) or [Getform](https://getform.io)
   - Update the form action URL in `src/pages/contact.astro`

## GitHub Pages Deployment

### Step 1: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to Pages
3. Under "Build and deployment", select:
   - Source: GitHub Actions

### Step 2: Add Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**Required:**
- `PUBLIC_SANITY_PROJECT_ID` = (your Sanity project ID)
- `PUBLIC_SANITY_DATASET` = `production`
- `PUBLIC_SANITY_API_VERSION` = `2024-01-01`

**Optional:**
- `PUBLIC_SENTRY_DSN` = (your Sentry DSN for error tracking)

**How Environment Variables Work:**
- 🏠 **Local Development**: Reads from `.env` file (not committed to git)
- ☁️ **GitHub Actions**: Reads from repository secrets
- 📱 **Sanity Studio**: Reads from `.env` file

This architecture ensures credentials never appear in your codebase.

### Step 3: Deploy

Push to the main branch:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

GitHub Actions will automatically build and deploy your site.

Your site will be available at: `https://YOUR_USERNAME.github.io/pottery-website/`

## Content Management Workflow

### From iPhone:

1. Open your Sanity Studio URL in Safari
2. Login with your Sanity credentials
3. Edit content (add works, events, update profile)
4. Changes are saved to Sanity immediately

### Updating the Website:

After making content changes in Sanity:

1. **Automatic**: Set up a webhook in Sanity to trigger rebuilds
2. **Manual**: Push any commit to trigger a rebuild via GitHub Actions
3. **Scheduled**: Use GitHub Actions scheduled workflows

### Setting up Automatic Rebuilds (Recommended):

1. In Sanity Studio, go to: Manage → API → Webhooks
2. Create a new webhook:
   - Name: "Rebuild Website"
   - URL: `https://api.github.com/repos/YOUR_USERNAME/pottery-website/dispatches`
   - Trigger on: Create, Update, Delete
   - Dataset: production
   - Add Authorization header: `Bearer YOUR_GITHUB_TOKEN`
   - Payload: `{"event_type": "sanity-update"}`

## Image Optimization

Images are automatically optimized using Sanity's image pipeline:

- Automatic format conversion (WebP)
- Responsive sizing
- Hotspot/crop support
- CDN delivery

Example usage:
```typescript
urlFor(image)
  .width(800)
  .height(600)
  .fit('crop')
  .auto('format')
  .url()
```

## Sentry Integration

Sentry is configured for error tracking. To enable:

1. Create a Sentry account at https://sentry.io
2. Create a new project
3. Copy your DSN
4. Add it to your `.env` and GitHub secrets

## Development Commands

```bash
npm run dev          # Start Astro dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run studio       # Start Sanity Studio
npm run studio:deploy # Deploy Sanity Studio
```

## Content Types

### Work
- Title (required)
- Slug (auto-generated from title)
- Year (required, number)
- Dimensions (optional, e.g., "15cm H x 10cm W")
- Category (required: Vessels, Bowls, Plates, Cups, Other)
- Images (required, array with captions)
- Description (optional)
- Featured (boolean - displays on homepage)

### Event
- Title (required)
- Date (required, datetime)
- Location (required)
- Description (optional)
- Link (optional, for registration/info)

### Profile (Singleton)
- About Me (required, text)
- Profile Image (required, with hotspot)
- Instagram Handle (optional, without @)

### Stockist
- Name (required)
- Location (required)
- Address (optional)
- Website (optional, URL)
- Description (optional)
- Display Order (number, lower = appears first)

## Customization Tips

1. **Fonts**: Update Google Fonts import in `src/layouts/BaseLayout.astro`
2. **Colors**: Edit the clay palette in `tailwind.config.mjs`
3. **Layout**: Modify grid columns in page components
4. **Navigation**: Add/remove menu items in `BaseLayout.astro`

## Troubleshooting

### Build fails on GitHub Actions
- Check that all secrets are added correctly
- Ensure environment variables match `.env.example`

### Images not loading
- Verify `PUBLIC_SANITY_PROJECT_ID` is correct
- Check image assets are uploaded in Sanity Studio
- Ensure CORS is enabled in Sanity settings

### Content not updating
- Trigger a new build after content changes
- Clear browser cache
- Check Sanity Studio connection

## License

MIT
