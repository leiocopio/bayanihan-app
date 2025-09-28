<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { regions, provinces, cities, barangays } from 'select-philippines-address';

	// Form fields
	let first_name = '';
	let last_name = '';
	let email = '';
	let pass = '';
	let confirm_pass = '';
	let contact_number = '';
	let address_street = '';

	// Address codes
	let address_region = '';
	let address_province = '';
	let address_city = '';
	let address_bgy = '';

	// Address options
	let regionOptions = [];
	let provinceOptions = [];
	let cityOptions = [];
	let barangayOptions = [];

	let errorMessage = '';

	onMount(async () => {
		regionOptions = await regions();
	});

	async function handleRegionChange(e) {
		address_region = e.target.value;
		address_province = '';
		address_city = '';
		address_bgy = '';
		provinceOptions = [];
		cityOptions = [];
		barangayOptions = [];

		if (address_region) {
			provinceOptions = await provinces(address_region);
		}
	}

	async function handleProvinceChange(e) {
		address_province = e.target.value;
		address_city = '';
		address_bgy = '';
		cityOptions = [];
		barangayOptions = [];

		if (address_province) {
			cityOptions = await cities(address_province);
		}
	}

	async function handleCityChange(e) {
		address_city = e.target.value;
		address_bgy = '';
		barangayOptions = [];

		if (address_city) {
			barangayOptions = await barangays(address_city);
		}
	}

	function handleBarangayChange(e) {
		address_bgy = e.target.value;
	}

	async function handleSignup() {
		if (pass !== confirm_pass) {
			errorMessage = 'Passwords do not match';
			return;
		}
		try {
			// Map codes -> names
			const regionName =
				regionOptions.find((r) => r.region_code === address_region)?.region_name || '';
			const provinceName =
				provinceOptions.find((p) => p.province_code === address_province)?.province_name || '';
			const cityName = cityOptions.find((c) => c.city_code === address_city)?.city_name || '';
			const barangayName =
				barangayOptions.find((b) => b.brgy_code === address_bgy)?.brgy_name || '';

			const res = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					first_name,
					last_name,
					email,
					pass,
					contact_number,
					address_street,

					// Save codes
					address_region_code: address_region,
					address_province_code: address_province,
					address_city_code: address_city,
					address_bgy_code: address_bgy,

					// Save names
					address_region: regionName,
					address_province: provinceName,
					address_city: cityName,
					address_bgy: barangayName
				})
			});

			if (res.ok) {
				goto('/home');
			} else {
				const data = await res.json();
				errorMessage = data.error || 'Signup failed';
			}
		} catch (err) {
			errorMessage = 'Network error';
		}
	}
</script>

<div class="mx-auto max-w-md p-4">
	<h1 class="mb-4 text-2xl font-bold">Sign Up</h1>

	{#if errorMessage}
		<p class="text-red-600">{errorMessage}</p>
	{/if}

	<form on:submit|preventDefault={handleSignup} class="flex flex-col gap-3">
		<input type="text" bind:value={first_name} placeholder="First Name" class="input" required />
		<input type="text" bind:value={last_name} placeholder="Last Name" class="input" required />
		<input type="email" bind:value={email} placeholder="Email" class="input" required />
		<input type="password" bind:value={pass} placeholder="Password" class="input" required />
		<div>
			<input
				type="password"
				bind:value={confirm_pass}
				placeholder="Confirm Password"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			/>
			{#if confirm_pass && pass !== confirm_pass}
				<p class="text-sm text-red-600">Passwords do not match</p>
			{/if}
		</div>
		<input
			type="text"
			bind:value={contact_number}
			placeholder="Contact Number"
			class="input"
			required
		/>
		<input type="text" bind:value={address_street} placeholder="Street" class="input" required />

		<!-- Region -->
		<select class="input" on:change={handleRegionChange} required>
			<option value="">Select Region</option>
			{#each regionOptions as r}
				<option value={r.region_code}>{r.region_name}</option>
			{/each}
		</select>

		<select class="input" on:change={handleProvinceChange} required>
			<option value="">Select Province</option>
			{#each provinceOptions as p}
				<option value={p.province_code}>{p.province_name}</option>
			{/each}
		</select>

		<select class="input" on:change={handleCityChange} required>
			<option value="">Select City</option>
			{#each cityOptions as c}
				<option value={c.city_code}>{c.city_name}</option>
			{/each}
		</select>

		<select class="input" on:change={handleBarangayChange} required>
			<option value="">Select Barangay</option>
			{#each barangayOptions as b}
				<option value={b.brgy_code}>{b.brgy_name}</option>
			{/each}
		</select>

		<button type="submit" class="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
			Sign Up
		</button>
	</form>
</div>

<style>
	.input {
		border: 1px solid #ccc;
		padding: 0.5rem;
		border-radius: 0.25rem;
	}
</style>
