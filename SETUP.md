# Website Setup Guide

## Email Subscription Setup (Buttondown)

Your events page now has a subscription form for collecting email addresses.

### Steps to activate:

1. **Sign up for Buttondown** (free for up to 100 subscribers)
   - Go to https://buttondown.email
   - Create a free account
   - Choose your username (e.g., "yufangceramics")

2. **Configure in Sanity Studio**
   - Run `npm run dev` and go to http://localhost:4321/admin
   - Click "Profile" in the sidebar
   - Scroll down to "Buttondown Username" field
   - Enter your Buttondown username (without @)
   - Click "Publish"
   - The subscription form will automatically use this username!

3. **Send newsletters**
   - Log in to Buttondown
   - Click "New Email"
   - Write your event update
   - Click "Send" - it goes to all subscribers automatically
   - Unsubscribe links are added automatically (legal requirement)

4. **Export subscribers** (if you ever need to switch services)
   - In Buttondown, go to Settings → Export
   - Download CSV file
   - Import to any other email service

## Managing Content in Sanity Studio

### How to access Sanity Studio:
1. Run `npm run dev` in your terminal
2. Go to http://localhost:4321/admin

### Studio Organization:
Your Sanity Studio is now organized to match your website structure:
- **Profile** → Content for About page + site settings (logo, home hero image, email, Buttondown username)
- **Collections** → Bodies of work (e.g., Hand-painted Porcelain, Wood Fired), each with its own page
- **Selected Works** → Full gallery of your pottery work; tick "Featured on Home Page" to show a work on the Home page
- **Events** → Events page content

### How to delete an event:

1. **Open Sanity Studio**
2. Click "Event" in the left sidebar
3. Find the event you want to delete
4. Click on it to open
5. Click the **three dots menu (⋯)** in the top right corner
6. Select **"Delete"**
7. Confirm the deletion
8. The event is permanently removed from your website

**Note**: Deletion is permanent! If you want to keep the event but remove it from "Upcoming", use the "Mark as Past Event" toggle instead.

### How to delete a work item:

1. **Open Sanity Studio**
2. Click "Selected Works" in the left sidebar
3. Find the work you want to delete
4. Click on it to open
5. Click the **three dots menu (⋯)** in the top right corner
6. Select **"Delete"**
7. Confirm the deletion
8. The work is permanently removed from Selected Works

### How to add/manage Home page photos:

1. **Open Sanity Studio**
2. Click "Selected Works" in the left sidebar
3. Open each work you want on the Home page and tick **Featured on Home Page** (3 recommended)
4. Click "Publish"

**Note**: Featured works show a ★ before their title in the list. They appear on the Home page in their Display Order. If none are featured, the first 3 works by Display Order are shown.

### How to manage Selected Works ordering:

1. **Open Sanity Studio**
2. Click "Selected Works" in the left sidebar
3. **Sort by Display Order** (use the dropdown at the top to sort by order, year, etc.)
4. Open a work you want to feature at the top
5. Set **Display Order** to a low number (1, 2, 3, etc.)
6. Leave other works at 999 for automatic newest-first ordering
7. Click "Publish"

**Note**: The order numbers show in brackets in the list, like [1], [2], so you can easily see which works are featured at the top.

### How to mark an event as past:

You have two ways to mark events as past:

1. **Automatic** (default)
   - Events are automatically marked as past when their date/end date passes
   - No action needed

2. **Manual override**
   - Open the event in Sanity Studio
   - Scroll down to "Mark as Past Event" field
   - Toggle it to ON
   - Click "Publish"
   - The event will immediately move to the "Past Events" section

## New Features Added

### Content Management
- ✅ **Home page features works from Selected Works**
  - Tick "Featured on Home Page" on a work; featured works show ★ in Studio lists
  - Featured cards link to each work's own page
  - Order numbers visible in brackets [1], [2], [3] in Studio lists

### Events Page
- ✅ Events automatically sorted by date
- ✅ Events automatically move to "Past Events" when date passes
- ✅ Manual override to mark events as past (in Sanity CMS)
- ✅ Subscribe button for email updates (requires Buttondown setup)
- ✅ Supports date ranges (start and end dates)

### Selected Works Page
- ✅ Lightbox now shows:
  - Materials (e.g., "Porcelain", "Stoneware")
  - Dishwasher safe status (Yes/No)
  - Sold/Available status with color coding

### Navigation
- ✅ Mobile-responsive hamburger menu
- ✅ Full-screen mobile menu on small screens
- ✅ Desktop horizontal navigation on larger screens
  - Home | Selected Works | Events | About | Contact
- ✅ Clean URLs: Home (`/`), Selected Works (`/works/`), Events (`/events/`), About (`/about/`), Contact (`/contact/`)

### Work Schema (Already in Sanity)
You can now manage these fields for each work in Selected Works:
- **Dimensions**: Size of the piece
- **Materials**: Type of clay/glaze used
- **Dishwasher Safe**: Yes/No toggle
- **Sold**: Yes/No toggle
- **Display Order**: Control position in Selected Works page (see above for how to use)

## Need Help?

- **Buttondown Support**: https://buttondown.email/help
- **Sanity Documentation**: https://www.sanity.io/docs
