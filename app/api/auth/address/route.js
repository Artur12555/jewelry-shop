import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
  
    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
      });
    }
  
    try {
      const result = await pool.query('SELECT name, surname, street, zipcode, city, country, region FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
        });
      }
  
      return new Response(JSON.stringify(user), {
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
      });
    }
  }
  

export async function POST(req) {
  const { email, name, surname, street, zipcode, city, country, region } = await req.json();

  try {
    await pool.query(
      'UPDATE users SET name = $1, surname = $2, street = $3, zipcode = $4, city = $5, country = $6, region = $7 WHERE email = $8',
      [name, surname, street, zipcode, city, country, region, email]
    );
    return new Response(JSON.stringify({ message: 'Address updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
