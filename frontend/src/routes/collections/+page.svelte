<script>
	import { DatePicker } from 'date-picker-svelte';
	let date = new Date();
</script>

<div class="mx-2 my-4">
	<p class="mb-4 text-2xl font-bold">Calendar</p>
	<p class="mb-4 text-center">Select a date to view the schedule</p>
	<div class="mx-2 flex h-full flex-col items-center justify-center">
		<DatePicker />
	</div>
</div>

<style></style>
