export async function load({ fetch }) {
    const res = await fetch('/dashboard');
    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }
    const posts = await res.json();
   
   // console.log("ok", posts)
    return { posts, };
}
