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
        const { data: user, error } = await supabase
            .from('users')
            .select('name, surname, street, zipcode, city, country, region')
            .eq('email', email)
            .single();

        if (error || !user) {
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
        const { error } = await supabase
            .from('users')
            .update({
                name,
                surname,
                street,
                zipcode,
                city,
                country,
                region
            })
            .eq('email', email);

        if (error) {
            console.error('Error updating address:', error);
            return new Response(JSON.stringify({ message: 'Internal server error' }), {
                status: 500,
            });
        }

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
