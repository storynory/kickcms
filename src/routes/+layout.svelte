<script>
    import SideDrawer from '$lib/components/navs/SideDrawer.svelte';
    import Nav from '$lib/components/navs/apNav.svelte';
    let { children } = $props();
    import "$lib/app.css";
    
</script>

<div class="layout ">
    <SideDrawer />
   
        <Nav />

    <main class="container page-width">
        {@render children()}
    </main>
</div>

<style>
  
    .layout {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    main {
        flex: 1;
        padding: 100px 20px;
    }
    
</style>
