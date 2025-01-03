import { error, redirect } from '@sveltejs/kit';




export const actions = {
    default: async ({ request, locals, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            const { token, record } = await locals.pb.collection('users').authWithPassword(email, password);
            
            console.log("logged in")
           
        } catch (err) {
            return error(401, { error: 'Invalid credentials' });
        }
        throw redirect(303, '/dashboard'); 
    }
};
