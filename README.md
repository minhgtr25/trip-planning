
  # Short Trip Planner Interface

This project now uses **Supabase** to store trip data in real time.
Clients share updates through a JSON column, enabling multiple users to edit concurrently.

## Setup
1. Create a new project on [Supabase](https://app.supabase.com).
2. In SQL editor execute:

   ```sql
   create extension if not exists "uuid-ossp";

   create table trips (
     id uuid primary key default uuid_generate_v4(),
     name text not null,
     data jsonb not null,
     created_at timestamptz default timezone('utc', now()),
     updated_at timestamptz default timezone('utc', now())
   );

   -- trigger to keep updated_at current
   create or replace function update_updated_at_column()
   returns trigger as $$
   begin
     new.updated_at = now();
     return new;
   end;
   $$ language 'plpgsql';

   create trigger set_timestamp
     before update on trips
     for each row
     execute procedure update_updated_at_column();
   ```

3. Enable Realtime on the `trips` table (Replication tab).
4. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` from project settings.
5. Add these as environment variables (e.g. `.env.local` or Vercel):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Install dependencies: `npm install` (or `pnpm`) will include `@supabase/supabase-js`.
7. Run the dev server with `npm run dev`.

When first connected, the app will automatically create an initial trip record if none exists.

  This is a code bundle for Short Trip Planner Interface. The original project is available at https://www.figma.com/design/I9hvCTT4XQ9BIPgzd3btkA/Short-Trip-Planner-Interface.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  