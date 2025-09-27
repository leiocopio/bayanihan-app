<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '../components/navbar.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

onMount(async () => {
	try {
		const res = await fetch('/api/profile', {
			credentials: 'include'
		});

		// 👇 check for unauthorized
		if (res.status === 401) {
			goto('/'); // redirect home
			return;
		}
	} catch (error) {
		console.error(error);
	}
});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Navbar />
