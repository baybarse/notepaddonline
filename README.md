<div align="center">
  <img src="public/favicon.svg" alt="PadSync Logo" width="80" />
  <h1>PadSync</h1>
  <p><strong>Free Online Notepad & Note-Taking App</strong></p>
  <p>Create, organize, and share your notes from anywhere — completely free.</p>
  
  <a href="https://padsync.easywaytools.online/">🚀 Try PadSync Now</a> · 
  <a href="https://kreosus.com/baybarse/about">☕ Buy Me a Coffee</a>
  
  <br /><br />
  
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Price-Free-brightgreen?style=flat-square" alt="Free" />
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Rich Text Editor** | WYSIWYG editor with headings, bold, italic, lists, tables, code blocks, task lists |
| 📑 **Markdown Mode** | Full Markdown editor with live preview and syntax highlighting |
| 📁 **Nested Folders** | Organize notes in unlimited nested folders with drag & drop |
| 🔒 **Password Protection** | Lock individual notes or entire folders with passwords |
| 🔗 **Link Sharing** | Share notes via public links or protect with secret access keys |
| 🖨️ **PDF Export & Print** | Export any note as a beautifully formatted PDF |
| 🖼️ **Image Upload** | Drag & drop, paste from clipboard, or insert via URL (10 free uploads) |
| 🗑️ **Trash & Recovery** | Soft delete with easy restore — never lose a note by accident |
| 👁️ **Live Preview** | Split-screen or fullscreen preview while editing |
| 📱 **Mobile Responsive** | Fully optimized for phones and tablets with dedicated mobile UI |
| 🌐 **Offline Support** | Works offline — changes sync automatically when reconnected |
| 🔐 **Google Sign-In** | One-click authentication with your Google account |
| ☁️ **Cloud Sync** | Real-time sync powered by Supabase |
| 🎨 **Dark Theme** | Beautiful dark UI with glassmorphism design |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- Google OAuth credentials

### Setup

```bash
# Clone the repository
git clone https://github.com/baybarse/notepaddonline.git
cd notepaddonline

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_BASE_URL=/
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

Run this SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  title TEXT DEFAULT 'Untitled Note',
  content JSONB,
  content_html TEXT DEFAULT '',
  is_shared BOOLEAN DEFAULT false,
  share_id UUID,
  share_mode TEXT DEFAULT 'public',
  share_key_hash TEXT,
  share_key_hint TEXT,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Folders table
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  password_hash TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shared notes" ON notes FOR SELECT USING (is_shared = true);
CREATE POLICY "Users can manage own folders" ON folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Editor**: TipTap (ProseMirror-based)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Auth**: Google OAuth via Supabase
- **Styling**: Custom CSS with design tokens
- **Deployment**: GitHub Pages + GitHub Actions

## 📱 Screenshots

| Editor | Folders | Sharing |
|--------|---------|---------|
| Rich WYSIWYG editor with toolbar | Nested folder tree with drag & drop | Share via links with access keys |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## ☕ Support

If you enjoy PadSync, consider [buying me a coffee](https://kreosus.com/baybarse/about) to support development!

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/baybarse">baybarse</a></p>
  <p><a href="https://padsync.easywaytools.online/">padsync.easywaytools.online</a></p>
</div>
