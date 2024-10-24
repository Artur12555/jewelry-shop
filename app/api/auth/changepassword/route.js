import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  const { email, currentPassword, newPassword } = await req.json();

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), {
        status: 400,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error during password change:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
