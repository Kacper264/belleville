import type { Config } from '@netlify/functions';

declare const process: { env: Record<string, string | undefined> };

export default async () => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be configured');
  }

  const response = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/ogloszenia?select=id&limit=1`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    },
  );

  console.log('keepalive', response.status);

  if (!response.ok) {
    throw new Error(`Supabase keepalive failed with status ${response.status}`);
  }
};

export const config: Config = { schedule: '0 8 */2 * *' };