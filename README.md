# Development Platforms CA – News Platform (Supabase Frontend)

## Overview
This is my submission for the Development Platforms course assignment (FED2-24).
I chose Option 2 – Supabase Frontend.

The project is a simple news platform where:
- Users can register and log in with email/password.
- Logged-in users can submit articles (title, body, category, optional image).
- Everyone (even logged-out visitors) can browse all articles.
- Logged-in users can delete their own articles.
- The app is responsive and styled with a dark/red theme.

---

## ⚙️ Setup Instructions

### 1. Clone repo
git clone <repo-url>
cd development-platforms-ca

### 2. Install dependencies
⚠️ The React app lives inside the web folder, so make sure to move into it before installing:
cd web
npm install

### 3. Supabase setup
1. Create a new Supabase project (https://supabase.com/).
2. Create a table called `articles`
3. Enable Row Level Security (RLS) on the `articles` table.
4. Add these policies:

-- Anyone can read articles
create policy "Public can view articles"
on articles for select
using (true);

-- Only authenticated users can insert
create policy "Authenticated users can insert their own articles"
on articles for insert
to authenticated
with check (submitted_by = auth.email());

-- Allow users to delete their own articles
create policy "Users can delete their own articles"
on articles for delete
to authenticated
using (submitted_by = auth.email());

5. Create a storage bucket called `article-images` (public).
Add a policy so authenticated users can upload and public can read.

### 4. Configure environment
In the web folder, create a `.env` file:

VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

### 5. Run app
From inside the web folder:
npm run dev

The app will be available at http://localhost:5173.

---

## Features Checklist

- [x] User registration with email confirmation
- [x] User login and logout
- [x] Articles visible to all users (public select policy)
- [x] Authenticated users can submit articles
- [x] Authenticated users can delete only their own articles
- [x] Optional image upload to Supabase Storage
- [x] Responsive, dark/red styled frontend

---

## Notes for Grading
- Log out → browse feed (works without login).
- Log in/register → you’ll see the submission form.
- Uploading an image is optional.
- Delete button appears only for articles created by the logged-in user.
- Responsive design: works on desktop and mobile.

---

## Project Structure
web/
  src/
    App.jsx          # Main app, manages auth + navbar
    Auth.jsx         # Login & registration forms
    Articles.jsx     # Fetch + display articles, submit form when logged in
    supabaseClient.js# Supabase client setup
    index.css        # Dark/red themed styling

---

## Demo Script (for graders)

1. Register new user
   - Go to login form, click register, confirm email.

2. Login
   - Use new credentials.

3. Browse articles (logged in)
   - Feed of articles is visible.

4. Submit article
   - Fill in form with title, body, category, optional image → click submit.
   - Article appears in feed instantly.

5. Log out
   - Feed is still visible, but form disappears.

6. Delete own article
   - Log back in as the same user.
   - Delete button is visible only on own articles.
   - After deleting, the article is removed.
