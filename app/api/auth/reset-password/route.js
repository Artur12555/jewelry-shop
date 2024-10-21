import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function POST(req) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return new Response(JSON.stringify({ message: 'Token and new password are required.' }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, new Date()]
    );

    const user = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token.' }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    return new Response(JSON.stringify({ message: 'Password has been reset successfully.' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
