<script>
	let playlists = []
	let selectedPlaylists = []
	let showFileEndings = false

	const {ipcRenderer} = require('electron');
	ipcRenderer.on('update-playlists', (event, message) => {
		playlists = message
	})
</script>

<main>
	<h1>Playlist Manager</h1>
	<h2>Installed playlists</h2>
	<select multiple bind:value={selectedPlaylists}>
	{#each playlists as playlist}
		<option value={playlist}>
			{#if showFileEndings}
				{playlist}
			{:else}
				 {playlist.replace(/\.[^/.]+$/, "")}
			{/if}
		</option>
	{/each}
	</select>
	<label>
		<input type=checkbox bind:checked={showFileEndings}>
		Show file endings
	</label>

	<h2>Selected playlists</h2>
	<ul>
	{#each selectedPlaylists as name}
		<li>
			{#if showFileEndings}
				{name}
			{:else}
				 {name.replace(/\.[^/.]+$/, "")}
			{/if}
		</li>
	{/each}
	</ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	h2 {
		color: #ff3e00;
		font-weight: 100;
	}

	label {
		color: #ff3e00;
		font-weight: 100;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>