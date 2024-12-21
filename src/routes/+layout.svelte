<!-- src/routes/+layout.svelte -->
<script>
	let { children } = $props();
  import "./app.css";
  import Nav from '$lib/components/navs/apNav.svelte';
 

</script>
<div class="j-bk-prime ">
    <Nav />


{@render children()}
</div>
<style>

</style>