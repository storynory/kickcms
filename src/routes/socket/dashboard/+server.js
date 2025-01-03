export async function GET({ locals }) {
    try {
        const result = await locals.pb.collection('posts').getList(1, 5, {
            sort: '-created',
            expand: 'featuredImage', 
        });

        const posts = result;
       // const user = locals.pb.authStore.isValid ? locals.pb.authStore.model : null;
       // console.log(user)

        return new Response(
            JSON.stringify({ posts }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                 
                },
            }
        );
    } catch (error) {
        console.error('Failed to fetch posts:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to fetch posts' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        
    }
}

export async function POST({ locals, request }) {
    try {
        const body = await request.json();

        if (!locals.pb.authStore.isValid) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const newPost = await locals.pb.collection('posts').create(body);

        return new Response(
            JSON.stringify({ post: newPost }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Failed to create post:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to create post' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PUT({ locals, request }) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Post ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!locals.pb.authStore.isValid) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const updatedPost = await locals.pb.collection('posts').update(id, updates);

        return new Response(
            JSON.stringify({ post: updatedPost }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Failed to update post:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to update post' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function DELETE({ locals, request }) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Post ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!locals.pb.authStore.isValid) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await locals.pb.collection('posts').delete(id);

        return new Response(
            JSON.stringify({ message: 'Post deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Failed to delete post:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to delete post' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
