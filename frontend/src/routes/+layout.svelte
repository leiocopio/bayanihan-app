<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '../components/navbar.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';



	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Navbar />
