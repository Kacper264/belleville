import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export function useOgloszenia(limit) {
  const [ogloszenia, setOgloszenia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchOgloszenia() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('ogloszenia')
        .select('id, tytul, tresc, data_publikacji')
        .eq('opublikowane', true)
        .order('data_publikacji', { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error: fetchError } = await query;

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setOgloszenia(data ?? []);
      }
      setLoading(false);
    }

    fetchOgloszenia();
    return () => {
      active = false;
    };
  }, [limit]);

  return { ogloszenia, loading, error };
}
