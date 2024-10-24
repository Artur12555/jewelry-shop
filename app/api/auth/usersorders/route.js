// app/api/orders/route.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, user_id, product_name, quantity, status');

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { orderIds, status } = await req.json();

    if (!Array.isArray(orderIds) || orderIds.length === 0 || !status) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .in('id', orderIds)
      .select('*');

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update order status' }), { status: 500 });
  }
}
