import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
    // 1. Get the authenticated user session
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
        // Redirect if not logged in
        throw redirect(303, '/'); 
    }
    
    const user = authData.user;

    // 2. Fetch the custom profile data from your database table
    const { data: profile, error: profileError } = await supabase
        .from('users') // <-- Replace 'profiles' with your actual table name if different
        .select(`
            first_name, 
            last_name, 
            address_street, 
            address_bgy, 
            address_city, 
            address_province, 
            contact_number
        `)
        .eq('id', user.id) // <-- Link the profile using the user's ID
        .single(); // <-- Expecting one row

    if (profileError) {
        console.error('Error fetching profile:', profileError);
        // You might want to throw an error or redirect here too
    }

    // 3. Combine the Auth data and the Profile data into a single object
    const completeUser = {
        ...user, // Includes standard fields like 'email' and 'id'
        ...profile // Includes custom fields like 'first_name' and 'address_street'
    };

    // Return the complete user object to the Svelte component
    return {
        user: completeUser
    };
}