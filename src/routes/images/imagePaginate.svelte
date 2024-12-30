<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
  
      import { searchdata} from './sharedImages.svelte.js';
 let { 
       initialImages = [], // initial array of images 
    } = $props();
   
    let fetchImgs = async (page) => {
    try {
        let data = await pb.collection('images').getList(page, 5, {
            sort: '-created',
        });
        searchdata.pics = data.items; // Set the data to searchdata.pics
        searchdata.totalpages = data.length / 5 
        console.log("Fetched data:", data.items);
    } catch (error) {
        console.error("Error fetching images:", error);
    }
};

 
// this obviously change after search so need to think through
 searchdata.totalPages = initialImages.data.images.totalPages
  
/*
initialImages.data.images
{
  "page": 1,
  "perPage": 2,
  "totalItems": 10,
  "totalPages": 5,
  "items"

  */


</script>



<div class="pagination">
    <button class="pagination__btn pagination__btn--prev" aria-label="Previous page" data-action="prev">
      &laquo; Previous
    </button>
  
    <ul class="pagination__list">

        {#each Array(searchdata.totalPages) as _, i}
            <li class="pagination__item">
                <button 
                    class="pagination__link" 
                    aria-label="Page {i+1 }" 
                    onclick={()=>{ fetchImgs(i+1 )}}
                 >
                    {i+1 }
                </button>
            </li>
        {/each}
        
         
    </ul>
  
    <button class="pagination__btn pagination__btn--next" aria-label="Next page" data-action="next">
      Next &raquo;
    </button>
  </div>
  
  <style>
  .pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
  }
  
  .pagination__btn {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .pagination__btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .pagination__btn:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .pagination__list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 4px;
  }
  
  .pagination__item {
  }
  
  .pagination__link {
    padding: 8px 12px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s, border-color 0.3s;
  }
  
  .pagination__link:hover {
    background-color: #e2e6ea;
    border-color: #d6d8db;
  }
  
  .pagination__link[aria-current="true"] {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    cursor: default;
    border-color: #0056b3;
  }
  </style>
  