# UptimeV

UptimeV is an offline-first Expo / React Native application using Expo Router, Supabase Auth and WatermelonDB.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set:

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

   Configure the existing WatermelonDB sync endpoints in the same file if your environment uses them. Never put a Supabase `service_role` key in the mobile app or a client-side environment variable. `.env` is ignored by Git.

3. Configure Supabase Auth:
   - Enable Email and Password and choose whether email confirmation is required.
   - Enable Google as an OAuth provider and configure its client credentials in the Supabase dashboard.
   - Add `uptimev://auth/callback` to the Supabase Auth redirect URL allow list.
   - Configure Google OAuth's authorized redirect URI to the callback URL shown by the Supabase Google provider setup page (usually the Supabase project's `/auth/v1/callback` URL). The application deep link is a Supabase redirect target, not Google's provider callback.
   - Configure `public.teams` so `id uuid` is its primary key and references `auth.users(id) on delete cascade`; set its default to `auth.uid()`. Keep `team_name text`, `members_count int2`/`int4`, `status text`, and millisecond Unix `created_at`/`updated_at bigint` columns.
   - Enable RLS on `public.teams` and add authenticated-user policies for select, insert, update, and delete, each restricted to `id = auth.uid()`. This repository change does not include a Supabase SQL migration; apply the schema and policies separately after checking existing data.

4. Start Expo:

   ```bash
   npx expo start
   ```

   Native builds must be rebuilt after changing the app scheme or native dependencies.

## Authentication and local data

- Email/password sign-up and sign-in, Google OAuth, email confirmation callback handling, and sign-out are implemented with Supabase Auth.
- Auth sessions are persisted in Expo SecureStore. The auth client uses a chunked SecureStore adapter so larger session values are stored without switching to unencrypted AsyncStorage.
- A user with no team is required to create one before entering the job tabs. The user's single team is the row whose `teams.id` equals the authenticated user's UUID. Team records are created in Supabase and cached in WatermelonDB; RLS restricts operations to `id = auth.uid()`.
- The current WatermelonDB team schema does not expose an owner column. Version 4 migrates existing local team IDs and their known job/report references from the previous optional `owner_id` value to the user's UUID. WatermelonDB does not provide a supported column-drop migration, so the old physical SQLite column is retained as an unused legacy column for upgraded installations; the application no longer reads or writes it.
- On sign-in as a different user, the local database is cleared before binding it to that account, preventing one account from seeing another account's offline data.
- Offline mode can restore a previously persisted session and use local team/data records for the same account. It cannot validate a new password or create a team when the server is unreachable.
- The current application schema does not define employee roles. The profile screen shows a role only when the trusted Supabase `app_metadata.role` value is present; assign that metadata from a trusted server/admin workflow, never from client-editable user metadata.

## Checks

```bash
npx tsc --noEmit
npm run lint
```
