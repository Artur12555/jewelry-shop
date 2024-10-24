import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET all products or filter by category
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
    });
  }
}

// POST to add a new product
export async function POST(req) {
  const { name, price, description, image_url, category, stock } = await req.json();

  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert([{ name, price, description, image_url, category, stock }])
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return new Response(JSON.stringify({ error: 'Failed to add product' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return new Response(JSON.stringify({ error: 'Failed to add product' }), {
      status: 500,
    });
  }
}

// PATCH to update an existing product
export async function PATCH(req) {
  const { id, name, price, description, image_url, category, stock } = await req.json();

  try {
    const { data: product, error } = await supabase
      .from('products')
      .update({ name, price, description, image_url, category, stock })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return new Response(JSON.stringify({ error: 'Failed to update product' }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
    });
  }
}
