import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdueptanjfludebawaqz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdWVwdGFuamZsdWRlYmF3YXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjE1ODcsImV4cCI6MjA1NjIzNzU4N30.J2wMP5wfb_-84MEzuwvvrScM2xSdZZoQHxV0otFKXCA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;