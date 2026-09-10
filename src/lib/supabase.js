import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // On avertit dans la console plutôt que de planter le build :
  // le site doit rester utilisable même si Supabase n'est pas encore configuré.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants — voir README.md § Supabase.',
  );
}

export const supabase = createClient(url ?? '', anonKey ?? '');
