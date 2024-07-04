import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://zfdlhwlqhryychoudjkv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZGxod2xxaHJ5eWNob3Vkamt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NDg0NTYsImV4cCI6MjAzMjAyNDQ1Nn0.fu2Wx8y-xC0QXdRHSlB7kIYW2dmmFcx70z_aiA8Jw2I';

export default supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});