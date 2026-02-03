import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldkvjoglhrrnslefvayh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxka3Zqb2dsaHJybnNsZWZ2YXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzgzNzAsImV4cCI6MjA4NTU1NDM3MH0.iyNSEDMCi6Sc7opvHSlR4lc4ftQgBcyllY-P4QHtRpU';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
