<script>
    import { searchdata} from './sharedImages.svelte.js';
   import Pagination from "./ImagePaginate.svelte";
   import Search from './imageSearch.svelte'
   import Upload from './imageUpload.svelte'

 // initial values
    let images = $props();
    let gridimages = images.data.images.items;
 // state    
    searchdata.pagenum = 1;
    searchdata.gridimages =  gridimages;
    searchdata.pics = gridimages;
    searchdata.query = "";
    searchdata.pageInfo = images.data.images;
   
</script>
 
  <h1>Image Gallery</h1>
   <Upload />

  <Search />

  {#if  searchdata.showPagination === true}
     <Pagination initialImages={images}/>
  {/if}

  <style>
    /* General Styling */
    h1 {
      text-align: center;
      margin: 20px 0;
    }
  
</style>