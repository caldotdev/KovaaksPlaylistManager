<script>
	import { onMount } from "svelte";

	let installedPlaylists = [];
	let availablePlaylists = [];
	let selectedPlaylists = [];
	let selectedAvailablePlaylists = [];

	onMount(() => {
		window.api
			.receiveInstalledPlaylists()
			.then((playlists) => (installedPlaylists = playlists));
		window.api
			.receiveAvailablePlaylists()
			.then((playlists) => (availablePlaylists = playlists));
	});

	window.api.steamPathSet((success) => {
		if (response) {
			window.api
			.receiveInstalledPlaylists()
			.then((playlists) => (installedPlaylists = playlists));
		} else {
			// TODO handle that latert
			console.log('user has canceled the select dialog')
		}
	})

	function setSteamPath() {
		window.api.openDialog();
	}

	function handleDelete() {
		if (selectedPlaylists.length > 0) {
			window.api
				.deletePlaylists(selectedPlaylists)
				.then((playlists) => (installedPlaylists = playlists));
		}
	}

	function handleAdd() {
		if (selectedAvailablePlaylists > 0) {
			window.api
				.addPlaylists(selectedAvailablePlaylists)
				.then((playlists) => (installedPlaylists = playlists));
		}
	}

	function handleTwitterClick() {
		window.api.openTwitterLink();
	}
</script>

<style global lang="postcss">
	/* only apply purgecss on utilities, per Tailwind docs */
	/* purgecss start ignore */
	@tailwind base;
	@tailwind components;
	/* purgecss end ignore */

	@tailwind utilities;

	.btn {
		@apply rounded-lg p-1 px-2 shadow-md text-yellow-50 border-transparent appearance-none;
	}
</style>

<main class="container h-screen p-2">
	<div class="mb-3">
		<button
			class="btn uppercase bg-blue-300 text-yellow-50 w-3/12"
			on:click={setSteamPath}>set steam path</button>
	</div>
	<div class="flex space-x-6 h-5/6">
		<div
			class="shadow-lg flex-grow-0 flex-grow-0 flex flex-col w-1/2 p-4">
			<h3 class="text-3xl self-center text-yellow-50">
				Installed playlists
			</h3>

			{#if installedPlaylists.length > 0}
				<select
					multiple
					bind:value={selectedPlaylists}
					class="m-3 h-full">
					{#each installedPlaylists as playlist}
						<option value={playlist}>
							{playlist.replace(/(.json)$/i, '')}
						</option>
					{/each}
				</select>
			{/if}

			<button
				class="btn bg-red-400 self-center text-yellow-50 w-1/2"
				on:click={handleDelete}>Delete Playlists</button>
		</div>
		<div
			class="shadow-lg flex-grow-0 flex-shrink-0 flex flex-col w-1/2 p-4">
			<h3 class="text-3xl self-center text-yellow-50">
				Available playlists
			</h3>
			{#if availablePlaylists.length > 0}
				<select
					multiple
					bind:value={selectedAvailablePlaylists}
					class="m-3 h-full">
					{#each availablePlaylists as availablePlaylist}
						<option value={availablePlaylist}>
							{availablePlaylist.replace(/(.json)$/i, '')}
						</option>
					{/each}
				</select>
			{/if}

			<button
				class="btn bg-green-400 self-center text-yellow-50 w-1/2"
				on:click={handleAdd}>
				Add playlists
			</button>
		</div>
	</div>

	<p on:click={handleTwitterClick} class="text-yellow-50 cursor-pointer mt-2">
		created by sens
	</p>
</main>
