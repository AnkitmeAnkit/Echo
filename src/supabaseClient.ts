import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPlaybookDownloadLink = async (slug: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('playbook_files')
    .select('drive_link')
    .eq('playbook_slug', slug)
    .single();

  if (error || !data) return null;
  return data.drive_link;
};
