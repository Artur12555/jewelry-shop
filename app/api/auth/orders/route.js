import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
    });
  }

  try {
    // Fetch the user based on email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    // Fetch the orders based on the user ID
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id);

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return new Response(JSON.stringify({ message: 'Error fetching orders' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(orders), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
