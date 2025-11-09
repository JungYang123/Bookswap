import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://ikpzphcbugnxoghbrzfc.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcHpwaGNidWdueG9naGJyemZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTY2NTEsImV4cCI6MjA3NzIzMjY1MX0.0SdFZ3dN-9r-9aIKYghSqxzBFyLvzW8A16SyPja6S34"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
