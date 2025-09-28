<script>
	import { goto } from '$app/navigation';
	export let data; // comes from +page.js

	const user = data.user;

	async function handleLogout() {
		if (!confirm('Are you sure you want to log out?')) return;

		try {
			const res = await fetch('/api/logout', {
				method: 'POST',
				credentials: 'include'
			});

			if (res.ok) {
				goto('/'); // redirect home
			} else {
				const data = await res.json();
				alert(data.error || 'Logout failed');
			}
		} catch (err) {
			alert('Network error while logging out');
			goto('/');
		}
	}
</script>

<div class="mx-2 flex flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold">User Profile</h1>

	<div id="profile-pic"></div>

	{#if user}
		<div>
			<p><b>Name:</b><br />{user.first_name || 'N/A'} {user.last_name || ''}</p>
			<p>
				<b>Address:</b><br />
				{user.address_street || ''} {user.address_bgy || ''}
				{user.address_city || ''} {user.address_province || ''}
			</p>
			<p><b>Contact:</b><br />{user.contact_number || 'N/A'}</p>
			<p><b>Email:</b><br />{user.email}</p>
		</div>
	{:else}
		<p class="text-red-600">Failed to load profile</p>
	{/if}
</div>

<p>Settings</p>
<br />

<button
	on:click={handleLogout}
	class="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
	Log Out
</button>

<style>
	#profile-pic {
		background-color: gray;
		height: 10rem;
		width: 10rem;
		border-radius: 50%;
		margin-bottom: 1rem;
	}
</style>
<!-- --- a/file:///c%3A/Users/Lei%20Ocopio/OneDrive/Documents/bayanihan-app/frontend/src/routes/user/%2Bpage.js -->