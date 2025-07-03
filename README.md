# NotesOrganizer.com

**Beyond Note-Taking. Master Your Knowledge.**

[Live Site](https://www.notesorganizer.com) (Deployed on Vercel)

---

NotesOrganizer.com is the strategic content and utility hub for the future of Personal Knowledge Management (PKM). It's designed not just as a blog, but as a product to educate users on powerful PKM frameworks and provide AI-powered tools to transform their scattered notes into a structured, interconnected knowledge base.

This project serves as the foundation (Phase 1) for our ultimate vision, **KortexAI**, a SaaS platform that will intelligently and automatically manage a user's entire knowledge repository.

## ✨ Features

- **📚 In-depth Guides**: A "Learn Hub" with long-form, authoritative articles on PKM systems like Zettelkasten, PARA, and tools like Obsidian.
- **🛠️ Free AI Micro-Tools**:
  - **AI Note Summarizer**: Get a one-paragraph summary for any text.
  - **AI Title Generator**: Generate compelling titles for your notes and articles.
- **🚀 KortexAI Waitlist**: A conversion funnel to capture high-intent users for our upcoming flagship product, `KortexAI.app`.
- **✍️ Modern Blog**: Fully-featured blog powered by local MDX files.
- **SEO Optimized**: Built with Next.js SSG for maximum performance and search engine ranking.

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: Local [MDX](https://mdxjs.com/) files
- **Deployment**: [Vercel](https://vercel.com/)
- **Backend for AI Tools**: Vercel Serverless Functions
- **Database (Waitlist)**: [Supabase](https://supabase.io/)
- **DNS**: [Cloudflare](https://www.cloudflare.com/)

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notesorganizer.git
cd notesorganizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the necessary environment variables. These are used for connecting to Supabase and the AI APIs.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider (e.g., OpenAI)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: The core application routing (Next.js App Router).
  - `api/`: Serverless API endpoints for AI tools and the waitlist.
  - `knowledge-hub/`: The blog/learning center.
  - `tools/`: The free AI micro-tools.
  - `page.tsx`: The homepage.
- `components/`: Shared React components.
  - `layout/`: Components like Header and Footer.
  - `sections/`: Components for different sections of the homepage.
- `docs/`: Project documentation.
- `lib/`: Helper functions, like the MDX parser (`posts.ts`).
- `posts/`: The Markdown/MDX files for all blog posts.
- `public/`: Static assets like images and fonts.
- `styles/`: Global CSS styles.

## 🚧 Development Log

- **Sprint 3 (July 2024):** The AI Workbench.
  - Implemented the core feature for users to upload, analyze, and visualize their entire note collections.
  - Read the full retrospective and technical deep-dive in [docs/SPRINT3_SUMMARY.md](./docs/SPRINT3_SUMMARY.md).

## Project Management

Strategic planning, content calendar, and user research are managed in our shared Notion workspace.

## Development Documentation

All technical documentation, including architecture, deployment guides, and API design, is located in the `/docs` directory of this repository, following our Docs-as-Code principle.

---

This project is developed by our two-person agile team, following the principles outlined in `docs/00_CONSTITUTION.md`. 