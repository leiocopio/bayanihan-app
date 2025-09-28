<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let pass = '';
	let errorMessage = '';
	let successMessage = '';
	let backend_url = import.meta.env.VITE_BACKEND_URL;

	async function handleLogin() {
		try {
			const res = await fetch((backend_url) + '/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, pass})
			});

			const data = await res.json();

			if (!res.ok) {
				errorMessage = data.error;
				successMessage = '';
			} else {
				successMessage = `Welcome ${data.user.email}`;
				goto('/home');
				errorMessage = '';
			}
		} catch (err) {
			errorMessage = 'Network error';
		}
	}

	function signUp() {
		goto('/signup');
	}

	onMount(async () => {
		const res = await fetch('/api/test', {
			credentials: 'include'
		});
		const data = await res.json();
		console.log(data.message);

		
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
	<h1 class="mb-4 text-3xl font-bold text-center">Bayanihan App</h1>
	<p class="mb-6 text-center">Sign in to continue to your account</p>

	<div class="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-md">
	<h2 class="mb-4 text-xl font-bold">Sign In</h2>
	<form on:submit|preventDefault={handleLogin} class="space-y-4">
		<input
			type="email"
			bind:value={email}
			placeholder="Email"
			class="w-full rounded border p-2"
			required
		/>
		<input
			type="password"
			bind:value={pass}
			placeholder="Password"
			class="w-full rounded border p-2"
			required
		/>
		<button type="submit" class="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700">
			Sign In
		</button>
	</form>

	{#if errorMessage}
		<p class="mt-2 text-red-600">{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="mt-2 text-green-600">{successMessage}</p>
	{/if}

	<button class="mt-4 w-full rounded bg-green-600 p-2 text-white hover:bg-green-700" on:click={signUp}>
		Sign Up
	</button>
</div>

</div>

