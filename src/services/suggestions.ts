import { supabase } from '@/lib/supabase';

export interface SpotSuggestion {
  name: string;
  details: string;
}

/**
 * Sends a "Share a spot" suggestion for the team to review.
 * Returns 'not-sent' when there's no backend yet, so the UI can say so honestly.
 */
export async function submitSpotSuggestion(suggestion: SpotSuggestion): Promise<'sent' | 'not-sent'> {
  if (!supabase) return 'not-sent';
  const { error } = await supabase.from('spot_suggestions').insert(suggestion);
  if (error) throw error;
  return 'sent';
}
