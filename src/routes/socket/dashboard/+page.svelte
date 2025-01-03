<script>
	import { login } from '$lib/convert.svelte.js';
    
    import PostCard from '$lib/components/postCard.svelte'
   
    let { data} = $props();
 
  
    //console.log("dashboard", data.posts, data.user);
    let posts = data.posts.items;
    //let user = data.user
 
 
  </script>

    <div class="gallery">
    
  {#each posts as post}
  <div class="gallery-item">  
    <PostCard cardData = {post} />
</div>
  {/each}
  
</div>
  <style>

.gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  
   
  </style>
