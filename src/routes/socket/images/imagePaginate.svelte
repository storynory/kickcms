<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import { searchdata } from './sharedImages.svelte.js';
  
    let { initialImages = [] } = $props();
  
    let fetchImgs = async (page) => {
      try {
        let data = await pb.collection('images').getList(page, 5, {
          sort: '-created',
        });
        searchdata.pics = data.items; // Set the data to searchdata.pics
        searchdata.totalPages = Math.ceil(data.totalItems / 5); // Calculate total pages
        searchdata.page = page;
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
  
    searchdata.page = 1;
    searchdata.totalPages = initialImages.data.images.totalPages;
  

    // for  ellipsis 
    function getVisiblePages(currentPage, totalPages) {
  const pages = [];
  
  if (totalPages <= 5) {
    // Show all pages if there are 5 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      // Show first few pages if near the start
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Show last few pages if near the end
      pages.push(1, '...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show middle range of pages
      pages.push(1, '...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...', totalPages);
    }
  }

  return pages;
}

  </script>
  
  <div class="pagination">
    {#if searchdata.page > 1}
      <button
        class="pagination__btn pagination__btn--prev"
        aria-label="Previous page"
        onclick={() => fetchImgs(searchdata.page - 1)}
      >
        &laquo; Previous
      </button>
    {/if}
  
    <ul class="pagination__list">
      {#each getVisiblePages(searchdata.page, searchdata.totalPages) as page}
        <li class="pagination__item">
          {#if page === '...'}
            <span class="pagination__ellipsis">...</span>
          {:else}
            <button
              class="pagination__link"
              aria-current={searchdata.page === page ? 'true' : null}
              aria-label="Page {page}"
              onclick={() => fetchImgs(page)}
            >
              {page}
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  
    {#if searchdata.page < searchdata.totalPages}
      <button
        class="pagination__btn pagination__btn--next"
        aria-label="Next page"
        onclick={() => fetchImgs(searchdata.page + 1)}
      >
        Next &raquo;
      </button>
    {/if}
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
  
    .pagination__ellipsis {
      padding: 8px 12px;
      font-size: 14px;
      color: #6c757d;
      cursor: default;
    }
  </style>
  