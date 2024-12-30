<div class="pagination">
    <button class="pagination__btn pagination__btn--prev" aria-label="Previous page" data-action="prev">
      &laquo; Previous
    </button>
  
    <ul class="pagination__list">
      <li class="pagination__item" data-page="1">
        <button class="pagination__link" aria-label="Page 1">1</button>
      </li>
      <li class="pagination__item" data-page="2">
        <button class="pagination__link" aria-label="Page 2">2</button>
      </li>
      <li class="pagination__item" data-page="3">
        <button class="pagination__link" aria-label="Page 3">3</button>
      </li>
      <li class="pagination__item" data-page="4">
        <button class="pagination__link" aria-label="Page 4">4</button>
      </li>
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
  