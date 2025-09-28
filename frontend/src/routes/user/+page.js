import { redirect } from '@sveltejs/kit';

export async function load({ fetch }) {
	// ask backend for profile
	const res = await fetch('/api/profile', {
		credentials: 'include'
	});

	// not authenticated → redirect
	if (res.status === 401) {
		throw redirect(302, '/');
	}

	// parse response
	const data = await res.json();

	if (!res.ok) {
		// optionally throw an error that SvelteKit will catch
		throw new Error(data.error || 'Failed to load profile');
	}

	return {
		user: data.user
	};
}
// user is authenticated → return user data to the page