# Deployment Guide

This document outlines the steps for deploying the project.

*This is a living document and will be updated as the project evolves.*

## Initial Deployment (Vercel)

1.  Connect the GitHub repository (`JI000000/notesorganizer.com`) to your Vercel account.
2.  Vercel will automatically detect that this is a Next.js project.
3.  No special build commands or environment variables are needed for the initial deployment.
4.  Vercel will build and deploy the `main` branch to the production URL.
5.  All subsequent pushes to the `main` branch will trigger automatic production deployments.
6.  All Pull Requests will generate their own preview deployment URLs for review. 