import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function GET(req) {
  try {
    const result = await pool.query('SELECT id, user_id, product_name, quantity, status FROM orders');
    return new Response(JSON.stringify(result.rows), { status: 200 });
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

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = ANY($2::int[]) RETURNING *',
      [status, orderIds]
    );

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update order status' }), { status: 500 });
  }
}
