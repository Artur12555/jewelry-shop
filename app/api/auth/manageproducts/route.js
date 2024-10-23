import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// GET all products or filter by category
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    let query = 'SELECT * FROM products';
    const queryParams = [];

    if (category) {
      query += ' WHERE category = $1';
      queryParams.push(category);
    }

    const result = await pool.query(query, queryParams);
    return new Response(JSON.stringify(result.rows), {
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
    const result = await pool.query(
      'INSERT INTO products (name, price, description, image_url, category, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, price, description, image_url, category, stock]
    );

    return new Response(JSON.stringify(result.rows[0]), {
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
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3, image_url = $4, category = $5, stock = $6 WHERE id = $7 RETURNING *',
      [name, price, description, image_url, category, stock, id]
    );

    return new Response(JSON.stringify(result.rows[0]), {
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
