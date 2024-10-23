import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category'); // Get the category from query parameters

  try {
    let query = 'SELECT * FROM products';
    const queryParams = [];

    if (category) {
      query += ' WHERE category = $1'; // Parameterized query for security
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
