# OmniNotes

OmniNotes is a React note-taking application built with Vite, Tailwind CSS, Appwrite, TinyMCE, Redux Toolkit, and the OpenRouter API. It supports authentication, rich-text notes, image uploads, dark mode, search/filtering, public share links, AI note assistance, and productivity insights.

## Features

- User authentication with Appwrite
- Create, edit, delete, and view notes
- Rich text editor powered by TinyMCE
- Featured image upload through Appwrite Storage
- Dark mode with persisted theme preference
- Keyword search, tag filtering, and recently-updated sorting
- Public/private note sharing
- AI-generated summaries, action items, and suggested titles
- Productivity dashboard with note counts, recent edits, tags, AI usage, and weekly activity

## Architecture

The app is a frontend-first React application. Appwrite acts as the backend service for authentication, database records, file storage, and document permissions.

Main layers:

- `src/main.jsx`: React Router setup and route protection.
- `src/App.jsx`: App shell, theme bootstrap, header/footer layout.
- `src/appwrite/`: Appwrite database, auth, and storage service wrappers.
- `src/components/`: Reusable UI components, header/footer, forms, editor, AI assistant, cards.
- `src/components/pages/`: Route-level pages such as Home, All Posts, Dashboard, Post, Add/Edit Post, and Public Share page.
- `src/services/openai.js`: OpenRouter Chat Completions integration for AI note assistance.
- `src/store/`: Redux auth state.
- `src/utils/`: Note filtering, tag analytics, weekly activity, and AI usage helpers.

There is no custom Node/Express backend in this project. The backend is Appwrite.

## Prerequisites

- Node.js installed
- npm installed
- Appwrite project configured
- TinyMCE API key
- Optional: OpenRouter API key for AI features

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root. You can copy `.env.example` and fill in the values.

```env
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_PROJECT_NAME=
VITE_APPWRITE_URL=

VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_APPWRITE_BUCKET_ID=

VITE_API_KEY=

VITE_OPENROUTER_API_KEY=
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

Variable meaning:

- `VITE_APPWRITE_PROJECT_ID`: Appwrite project ID.
- `VITE_APPWRITE_PROJECT_NAME`: Appwrite project name.
- `VITE_APPWRITE_URL`: Appwrite endpoint, for example `https://cloud.appwrite.io/v1`.
- `VITE_APPWRITE_DATABASE_ID`: Appwrite database ID.
- `VITE_APPWRITE_COLLECTION_ID`: Notes collection ID.
- `VITE_APPWRITE_BUCKET_ID`: Storage bucket ID for featured images.
- `VITE_API_KEY`: TinyMCE API key.
- `VITE_OPENROUTER_API_KEY`: OpenRouter API key.
- `VITE_OPENROUTER_MODEL`: OpenRouter model used for AI note generation.

Important: Vite exposes all `VITE_` variables to the browser. For production, call OpenRouter through a backend or Appwrite Function instead of exposing the OpenRouter key in the frontend.

## Appwrite Setup

Create an Appwrite project, then configure Authentication, Database, Collection, and Storage.

### Authentication

Enable Email/Password authentication in Appwrite.

### Database Collection

Create a notes collection with these attributes:

- `title`: String, required
- `content`: String, required
- `featuredImage`: String, optional
- `status`: String, required
- `userId`: String, required
- `tags`: String, optional
- `isPublic`: Boolean, default `false`

Enable **Document Security** for the collection.

Recommended collection permissions:

- Create: `Users`
- Read: empty
- Update: empty
- Delete: empty

The app sets document-level permissions in code:

- Private notes: readable/updateable/deleteable by the owner only.
- Public notes: readable by anyone, update/delete by owner only.

### Storage Bucket

Create a bucket for note images.

Recommended simple setup:

- Read: `Any`
- Create: `Users`
- Update/Delete: keep restricted based on your security preference

For stricter production behavior, use file-level owner permissions instead of broad bucket update/delete permissions.

## Run The Frontend

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```txt
http://127.0.0.1:5173/
```

On Windows PowerShell, if `npm run dev` is blocked by execution policy, use:

```bash
npm.cmd run dev
```

## Run The Backend

This project uses Appwrite as the backend, so there is no local backend server to start.

Make sure your Appwrite project is active and the `.env` values point to the correct Appwrite endpoint, project, database, collection, and bucket.

## Build For Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Test The Application

This project does not currently include automated unit tests. Use these checks before submission:

1. Run lint:

```bash
npm run lint
```

2. Run production build:

```bash
npm run build
```

3. Manual test checklist:

- Sign up and log in.
- Create a note with title, content, tags, and image.
- Edit a note and verify recently-updated sorting changes.
- Search notes by keyword.
- Filter notes by tag.
- Toggle dark mode.
- Make a note public and copy the share link.
- Open the share link in a logged-out/private browser.
- Make the note private and verify the share page is blocked.
- Use AI assistant to generate summary/action items/title suggestions.
- Open dashboard and verify total notes, recent notes, tags, AI usage, and weekly activity.

## OpenRouter Notes

The AI assistant uses the OpenRouter Chat Completions API to produce JSON containing:

- `summary`
- `actionItems`
- `suggestedTitles`

If you see a quota, credit, or billing error, check your OpenRouter account usage and credits. The app is passing the API error through so it is visible in the UI.

## Common Issues

### Public share page does not load for guests

Check:

- Collection has Document Security enabled.
- Public note has `isPublic: true`.
- Document permission includes `Read: Any`.
- Storage bucket allows image read access if the public note has an image.

### AI assistant says API key is missing

Add this to `.env`:

```env
VITE_OPENROUTER_API_KEY=your_key_here
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

Then restart the dev server.

### OpenRouter quota or credits exceeded

The OpenRouter account for the API key has no remaining credits or has hit a usage limit. Check OpenRouter credits, limits, and usage.

### TinyMCE API warning

Make sure `VITE_API_KEY` is set to a valid TinyMCE API key.
