<script>
    import Icon from '$lib/components/icons/socket.svelte'
</script>

<form class="form" method="POST">
    <header>
     
        <h1> Plugin To Socket CMS</h1>
        <Icon />
       
    </header>
    
  
	<label>
		Email
		<input class="input" name="email" type="email">
	</label>
	<label>
		Password
		<input class="input" name="password" type="password">
	</label>
	<button class="btn">Plugin</button>
</form>

<style>
header {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 100%;
}

</style>