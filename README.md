# TrueWheels

The Automotive Operating System.

## Week 1 local setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Create `.env.local` locally and never commit secrets:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Supabase project creation, authentication providers, storage buckets, and secret values must be configured in the Supabase dashboard or local environment. They cannot be safely provisioned from GitHub.
