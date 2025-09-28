<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { regions, provinces, cities, barangays } from 'select-philippines-address';

	let email = '';
	let pass = '';
	let confirm_pass = '';
	let first_name = '';
	let last_name = '';
	let address_street = '';
	let address_bgy = '';
	let address_city = '';
	let address_province = '';
	let address_region = '';
	let user_type = '';
	let contact_number = '';

	let errorMessage = '';
	let successMessage = '';

	// For dropdown options
	let regionOptions = [];
	let provinceOptions = [];
	let cityOptions = [];
	let barangayOptions = [];

	// Load regions on mount
	regions().then((data) => {
		regionOptions = data;
	});

	// When region changes
	async function handleRegionChange(e) {
		address_region = e.target.value;
		address_province = '';
		address_city = '';
		address_bgy = '';
		provinceOptions = [];
		cityOptions = [];
		barangayOptions = [];

		if (address_region) {
			const data = await provinces(address_region);
			provinceOptions = data;
		}
	}

	// When province changes
	async function handleProvinceChange(e) {
		address_province = e.target.value;
		address_city = '';
		address_bgy = '';
		cityOptions = [];
		barangayOptions = [];

		if (address_province) {
			const data = await cities(address_province);
			cityOptions = data;
		}
	}

	// When city changes
	async function handleCityChange(e) {
		address_city = e.target.value;
		address_bgy = '';
		barangayOptions = [];

		if (address_city) {
			const data = await barangays(address_city);
			barangayOptions = data;
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
			const res = await fetch('/api/signup', {

				credentials: 'include',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					pass,
					first_name,
					last_name,
					address_street,
					address_bgy,
					address_city,
					address_province,
					address_region,
					user_type,
					contact_number
				})
			});

			const data = await res.json();

			if (!res.ok) {
				errorMessage = data.error;
				successMessage = '';
			} else {
				successMessage = `Account created for ${data.user.email}`;
				errorMessage = '';
				setTimeout(() => goto('/home'), 2000);
			}
		} catch (err) {
			errorMessage = 'Network error';
		}
	}
</script>

<div class="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
	<h2 class="mb-6 text-center text-2xl font-extrabold text-gray-800">Sign Up</h2>
	<form on:submit|preventDefault={handleSignup} class="space-y-4">
		<div>
			<input
				type="text"
				bind:value={first_name}
				placeholder="First Name"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			/>
		</div>
		<div>
			<input
				type="text"
				bind:value={last_name}
				placeholder="Last Name"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			/>
		</div>
		<div>
			<input
				type="email"
				bind:value={email}
				placeholder="Email"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			/>
		</div>
		<div>
			<input
				type="password"
				bind:value={pass}
				placeholder="Password"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			/>
		</div>
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
		<div>
			<input
				type="text"
				bind:value={address_street}
				placeholder="Street"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
			/>
		</div>
		<div>
			<select
				bind:value={address_region}
				on:change={handleRegionChange}
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			>
				<option value="">Select Region</option>
				{#each regionOptions as r}
					<option value={r.region_code}>{r.region_name}</option>
				{/each}
			</select>
		</div>

		<div>
			<select
				bind:value={address_province}
				on:change={handleProvinceChange}
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			>
				<option value="">Select Province</option>
				{#each provinceOptions as p}
					<option value={p.province_code}>{p.province_name}</option>
				{/each}
			</select>
		</div>

		<div>
			<select
				bind:value={address_city}
				on:change={handleCityChange}
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			>
				<option value="">Select City</option>
				{#each cityOptions as c}
					<option value={c.city_code}>{c.city_name}</option>
				{/each}
			</select>
		</div>

		<div>
			<select
				bind:value={address_bgy}
				on:change={handleBarangayChange}
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
				required
			>
				<option value="">Select Barangay</option>
				{#each barangayOptions as b}
					<option value={b.brgy_code}>{b.brgy_name}</option>
				{/each}
			</select>
		</div>
		<div>
			<input
				type="text"
				bind:value={user_type}
				placeholder="User Type"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
			/>
		</div>
		<div>
			<input
				type="text"
				bind:value={contact_number}
				placeholder="Contact Number"
				class="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded bg-green-600 p-3 font-semibold text-white transition hover:bg-green-700"
		>
			Sign Up
		</button>
	</form>

	{#if errorMessage}
		<p class="mt-4 text-center text-red-600">{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="mt-4 text-center text-green-600">{successMessage}</p>
	{/if}
</div>
