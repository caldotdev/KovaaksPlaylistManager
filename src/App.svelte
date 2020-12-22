<script>
let playlists = []
let selectedPlaylists = []
let availablePlaylists = []
let selectedAvailablePlaylists = []
let showFileEndings = false

const { ipcRenderer } = require('electron')
ipcRenderer.on('update-playlists', (event, message) => {
	playlists = message
})
ipcRenderer.on('available-playlists', (event, message) => {
	availablePlaylists = message
})

function handleDelete () {

}

function handleAdd () {
	ipcRenderer.send('add-playlists', selectedAvailablePlaylists)
}
</script>

<main>
	<h1>Playlist Manager</h1>
	<h2>Installed playlists</h2>
	<label>
		<input type=checkbox bind:checked={showFileEndings}>
		Show file endings
	</label>
	{#if playlists.length > 0}
	<select multiple bind:value={selectedPlaylists}>
		{#each playlists as playlist}
			<option value={playlist}>
				{#if showFileEndings}
					{playlist}
				{:else}
					 {playlist.replace(/\.[^/.]+$/, '')}
				{/if}
			</option>
		{/each}
		</select>
	{/if}

	<button on:click={handleDelete}>
		Delete selected Playlists
	</button>

	<h2>Available playlists</h2>
	{#if availablePlaylists.length > 0}
	<select multiple bind:value={selectedAvailablePlaylists}>
		{#each availablePlaylists as availablePlaylist}
			<option value={availablePlaylist}>
				{availablePlaylist.replace(/\.[^/.]+$/, '')}
			</option>
		{/each}
		</select>
	{/if}

	<button on:click={handleAdd}>
		Add selected playlists
	</button>
	
	<h2>Selected playlists</h2>
	<ul>
	{#each selectedPlaylists as name}
		<li>
			{#if showFileEndings}
				{name}
			{:else}
				 {name.replace(/\.[^/.]+$/, '')}
			{/if}
		</li>
	{/each}
	</ul>

	<a href="https://twitter.com/sens0001">by sens</a>
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