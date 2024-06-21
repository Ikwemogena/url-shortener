import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {

    const { supabaseUrl, supabaseKey } = useRuntimeConfig().public
    const supabase = createClient(supabaseUrl, supabaseKey)

    return supabase
}