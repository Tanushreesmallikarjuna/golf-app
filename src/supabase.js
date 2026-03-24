import { createClient } from '@supabase/supabase-js'  // ← @supabase/ NOT supabase/


const supabaseUrl = "https://lvevbejdhzvvtfuuprue.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZXZiZWpkaHp2dnRmdXVwcnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTM5NTEsImV4cCI6MjA4OTkyOTk1MX0.KuAaJMBESCICLjXy_BOpVquFCi6riRKTtySx-BE4pWM"

export const supabase = createClient(supabaseUrl, supabaseKey)
