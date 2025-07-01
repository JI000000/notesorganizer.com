# Deployment Guide

This project is deployed on **Vercel**.

## Process

Deployment is automated through Vercel's Git integration.

1.  **Repository Connection**: The GitHub repository for this project is connected to a Vercel project.
2.  **Branch Trigger**: A push or merge to the `main` branch automatically triggers a new deployment on Vercel.
3.  **Build**: Vercel uses the `npm run build` command (defined in `package.json`) to build the Next.js application.
4.  **Deploy**: After a successful build, Vercel deploys the application to production and assigns it to the `notesorganizer.com` domain. The previous deployment is kept available for instant rollbacks if needed.

## Environment Variables

All sensitive keys (Supabase keys, AI API keys) must be configured in the Vercel project's environment variable settings. They should not be hardcoded in the repository.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (or other AI provider keys)

## Domains

The `notesorganizer.com` domain is assigned as the production domain in Vercel.
The `notesorganizer.app` domain is configured at the DNS provider (Cloudflare) to have a permanent (301) redirect to `https://www.notesorganizer.com`. 