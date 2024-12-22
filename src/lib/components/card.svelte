<script>
        import {formatFriendlyDate} from "$lib/utils/dateFormater.js"
    let { 
        title = '', 
        created = '', 
        featuredImage = null, 
        alt = '', 
        excerpt = '', 
        id=''
     } = $props();

</script>

<div class="post-card">
  
    <div class="post-thumbnail">
      {#if ! featuredImage === null}
        <img src="{featuredImage}" alt="{title}" />
      {:else}
        <div class="placeholder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ccc" width="48" height="48">
            <path d="M3 4v16h18V4H3zm16 14H5V6h14v12zm-4-6H7v-2h8v2zm2 4H7v-2h10v2z" />
          </svg>
        </div>
      {/if}
    </div>
    <div class="post-content">
      <h3>{title}</h3>
      <p class="post-excerpt">{excerpt || 'No excerpt available.'}</p>
      <p><small>{formatFriendlyDate(created)}</small></p>  
      <div class="post-actions">
       
        <a href="/posts/{id}" class="edit-button">Edit</a>
      </div>
    </div>
  </div>
  <style>

.post-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

/* Thumbnail */
.post-thumbnail {
  height: 160px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Post Content */
.post-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-content h3 {
  font-size: 1.4rem;
  color: #202124;
  font-weight: 500;
  margin: 0;
}

.post-content .post-excerpt {
  font-size: 1rem;
  color: #5f6368;
  margin: 0;
}

/* Post Actions */
.post-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.edit-button {
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  border-radius: 6px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #1a73e8;
}

.edit-button:hover {
  background-color: #1558b3;
}



/* Responsive Design */
@media (max-width: 768px) {
 
  .post-content h3 {
    font-size: 1.2rem;
  }

  .post-content .post-excerpt {
    font-size: 0.9rem;
  }
}


  </style>