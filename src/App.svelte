<script>
import { onMount } from 'svelte';

let installedPlaylists = []
let availablePlaylists = []
let selectedPlaylists = []
let selectedAvailablePlaylists = []
let showFileEndings = false

onMount(() => {
	window.api.receiveInstalledPlaylists().then(playlists => installedPlaylists = playlists)
	window.api.receiveAvailablePlaylists().then(playlists => availablePlaylists = playlists)
});

function setSteamPath () {
	window.api.openDialog()
}

function handleDelete () {
	window.api.deletePlaylists(selectedPlaylists).then(playlists => installedPlaylists = playlists)
}

function handleAdd () {
	window.api.addPlaylists(selectedAvailablePlaylists).then(playlists => installedPlaylists = playlists)
}
</script>

<main>
	<h1>Playlist Manager</h1>
	<button on:click={setSteamPath}>
		Set steam path
	</button>
	<h2>Installed playlists</h2>
	<label>
		<input type=checkbox bind:checked={showFileEndings}>
		Show file endings
	</label>
	{#if installedPlaylists.length > 0}
	<select multiple bind:value={selectedPlaylists}>
		{#each installedPlaylists as playlist}
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