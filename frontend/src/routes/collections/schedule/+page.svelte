<script>
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let userType = null;
	let session = null;
	let schedule = [
		{ day: 'Monday', active: false },
		{ day: 'Tuesday', active: false },
		{ day: 'Wednesday', active: false },
		{ day: 'Thursday', active: false },
		{ day: 'Friday', active: false },
		{ day: 'Saturday', active: false },
		{ day: 'Sunday', active: false }
	];

	// ✅ Load user info
	const loadUser = async () => {
		const { data: { session: s } } = await supabase.auth.getSession();
		session = s;

		if (session) {
			const { data } = await supabase
				.from('users')
				.select('user_type')
				.eq('id', session.user.id)
				.single();

			if (data) userType = data.user_type;
		}
	};

	// ✅ Load current schedule (and insert missing weekdays)
	const loadSchedule = async () => {
		const { data, error } = await supabase
			.from('garbage_schedule')
			.select('day_of_week, is_active');

		if (error) {
			console.error('Error loading schedule:', error);
			return;
		}

		// Map active/inactive values
		if (data && data.length > 0) {
			schedule = schedule.map(day => {
				const found = data.find(d => d.day_of_week === day.day);
				return found ? { ...day, active: found.is_active } : day;
			});
		} else {
			// ✅ Auto-insert 7 rows if table is empty
			await supabase.from('garbage_schedule').insert(
				schedule.map(d => ({
					day_of_week: d.day,
					is_active: false
				}))
			);
		}
	};

	// ✅ Save updated schedule
	const saveSchedule = async () => {
		if (userType !== 'Collector') {
			alert('Only collectors can edit the schedule.');
			return;
		}

		for (const day of schedule) {
			const { error } = await supabase
				.from('garbage_schedule')
				.update({
					is_active: day.active,
					updated_by: session.user.id,
					updated_at: new Date()
				})
				.eq('day_of_week', day.day);

			if (error) console.error('Error saving schedule:', error);
		}

		alert('Schedule saved successfully!');
		goto('/collections');
	};

	onMount(async () => {
		await loadUser();
		await loadSchedule();
	});
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-2">Schedule Collection</h1>
	<p class="mb-4">Select the days to schedule garbage collection.</p>

	<div class="flex flex-col gap-2">
		{#each schedule as item}
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={item.active}
					disabled={userType !== 'Collector'}
				/>
				<span>{item.day}</span>
			</label>
		{/each}
	</div>

	{#if userType === 'Collector'}
		<button
			class="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
			on:click={saveSchedule}
		>
			Save Schedule
		</button>
	{/if}
</div>
