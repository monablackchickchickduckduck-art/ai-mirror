# AI Mirror MVP: Team Setup Instructions

This project is a fork of `mckaywrigley/chatbot-ui`, customized for the AI Mirror MVP.

## 1. Local Development Setup

### Prerequisites
- Node.js (v18+)
- Supabase CLI installed and logged in.
- Stripe account (for API keys).

### Steps
1. **Clone the repository**:
   ```bash
   git clone /home/team/shared/ai-mirror-mvp.git
   cd ai-mirror-mvp
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local` and fill in the following:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_API_KEY`
   - `STRIPE_WEBHOOK_SECRET`

4. **Initialize Supabase**:
   ```bash
   supabase start
   ```
   The local schema includes the AI Mirror specific columns (`structured_memory`, `subscription_status`, etc.) via the migration in `supabase/migrations/20260510000000_ai_mirror_schema.sql`.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 2. Project Architecture

- **Auth**: Managed by Supabase Auth.
- **Database**: Supabase PostgreSQL.
- **Memory Layer**: 
    - `profiles` table contains `structured_memory` (JSONB).
    - `messages` table stores conversation history.
- **AI Orchestration**: Located in `app/api/chat/openai/route.ts`. This is where we inject the user profile into the system prompt.
- **Payments**: Stripe integration for the $9.99/mo subscription.

## 3. Deployment

- **Hosting**: Vercel.
- **Database**: Supabase (Production Project).
- **Edge Functions**: Used for streaming chat responses.

## 4. Team Workflow

- **Shared Repository**: `/home/team/shared/ai-mirror-mvp.git`
- **Branching**: Use feature branches and pull requests for any major changes.
- **Migrations**: Always add new migrations to `supabase/migrations` to keep the team in sync.
