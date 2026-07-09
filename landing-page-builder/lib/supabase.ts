import { createClient } from '@supabase/supabase-js'
import { LandingRow } from '@/types/db'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

export const supabase = createClient<{ public: { Tables: { hackathon_landings: { Row: LandingRow } } } }>(
  supabaseUrl,
  supabaseKey
)

export async function getLandingById(id: string): Promise<LandingRow | null> {
  const { data, error } = await supabase
    .from('hackathon_landings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as LandingRow
}
