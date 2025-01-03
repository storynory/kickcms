<script>
  import { imageresize  } from '$lib/images.js';   
  let { cardData } = $props();

</script>

<div class="card">
    <header>
    <h2>{cardData.title}</h2>
    </header>
    {#if cardData.expand?.featuredImage}
    <a href="/post/">
        <img 
        src="{imageresize}/sq/300/{cardData.expand.featuredImage.id}/{cardData.expand.featuredImage.image}" 
        alt={cardData.expand.featuredImage.alt || alt || title || 'Image'} 
        width=300
        height=300
      />
    </a>
   {/if}
   <p>{cardData.excerpt}</p>
   <footer><button class="btn">Edit</button></footer>
</div>

<style>

.card {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      max-width: 300px;
      padding: 0.5em;
    }


</style>