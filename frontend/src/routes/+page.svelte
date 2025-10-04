<script>
	import { goto } from "$app/navigation";
	import { supabase } from "$lib/supabaseClient"; // ✅ direct Supabase client

	let email = "";
	let pass = "";
	let errorMessage = "";
	let successMessage = "";

	// ✅ Direct Supabase login
	async function handleLogin() {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password: pass,
			});

			if (error) {
				errorMessage = error.message;
				successMessage = "";
				return;
			}

			successMessage = `Welcome ${data.user.email}`;
			errorMessage = "";

			// redirect to home
			goto("/home");
		} catch (err) {
			errorMessage = "Unexpected error: " + err.message;
		}
	}

	function signUp() {
		goto("/signup");
	}
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

		<button
			class="mt-4 w-full rounded bg-green-600 p-2 text-white hover:bg-green-700"
			on:click={signUp}
		>
			Sign Up
		</button>
	</div>
</div>
