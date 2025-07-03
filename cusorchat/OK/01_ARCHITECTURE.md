# Technical Architecture

This document details the architecture of `notesorganizer.com`.

## Core Philosophy

The architecture is designed around the principles of the JAMstack and Serverless computing to achieve maximum performance, security, and scalability with minimal operational overhead.

## Technology Choices

- **Frontend Framework**: **Next.js** is used for its hybrid rendering capabilities.
  - **Static Site Generation (SSG)**: For the blog, guides, and marketing pages to ensure they are pre-rendered as static HTML for fast load times and optimal SEO.
  - **Server-Side Rendering (SSR) / Incremental Static Regeneration (ISR)**: Can be used for pages that need more dynamic data.
  - **Client-Side Rendering (CSR)**: Used within the AI tool interfaces for interactivity.
- **Styling**: **Tailwind CSS** is used for its utility-first approach, enabling rapid development of a custom, modern UI.
- **Deployment**: **Vercel** is the chosen platform because of its seamless integration with Next.js, providing automatic builds, global CDN, and serverless function hosting.

## AI API Provider Strategy

A key architectural decision is the use of **OpenRouter.ai** as our exclusive AI API gateway, instead of directly integrating with providers like OpenAI.

- **Rationale**:
  1.  **Cost-Effectiveness**: OpenRouter provides access to a wide range of models at or below their base cost, significantly reducing our operational expenses for AI features.
  2.  **Model Flexibility**: It gives us access to hundreds of models from various providers (Google, Anthropic, Mistral, etc.) through a single, unified API. This prevents vendor lock-in and allows us to dynamically choose the best model for a specific task without code changes.
  3.  **Reliability & Redundancy**: OpenRouter offers automatic failover to other models in case of an outage from a primary provider, increasing the resilience of our AI tools.
- **Implementation**: All backend serverless functions call the OpenRouter endpoint. The specific model to be used (e.g., `openai/gpt-3.5-turbo`) is specified in the body of the request, making our architecture highly adaptable.

## Data Flow for AI Micro-Tools

The AI micro-tools (`Summarizer`, `Title Generator`) follow a secure serverless pattern:

1.  **Client (Browser)**: The user interacts with a React component in `app/tools/`.
2.  **API Request**: On form submission, the client makes a `POST` request to our own backend API endpoint (e.g., `/api/summarize`). **The client never calls the AI provider's API directly.**
3.  **Serverless Function**: Vercel invokes the corresponding serverless function located in `app/api/`.
4.  **Secure API Call**: The serverless function, which has secure access to environment variables (e.g., `OPENROUTER_API_KEY`), makes a request to the OpenRouter.ai API.
5.  **Response**: OpenRouter.ai responds to the serverless function.
6.  **Client Response**: The serverless function sends the processed data back to the client, which then updates the UI.

This architecture ensures our API keys are never exposed and allows us to handle pre-processing, post-processing, and error handling on the backend.

## Content Management

Content is managed via a **"Docs-as-Code"** approach.
- All articles are stored as `.md` or `.mdx` files within the `/posts` directory of the GitHub repository.
- The `lib/posts.ts` file contains utility functions to parse these files, read their frontmatter metadata, and render them as HTML.
- This approach eliminates the need for an external CMS, reduces costs, and allows content to be version-controlled alongside the code. 