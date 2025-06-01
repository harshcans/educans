// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeiingncbnklswuxunmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWluZ25jYm5rbHN3dXh1bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDcwMDksImV4cCI6MjA2MzEyMzAwOX0.-BZM8mCs5vpVtwtTcSGQEMnictz3NBiZRWbgOy9JUDQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
