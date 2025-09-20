<script>

	import { DatePicker } from 'date-picker-svelte'
	let date = new Date()



</script>
<p class="text-2xl font-bold mb-4">Calendar</p>
<p class="text-center text-xs mb-4">Select a date to view the schedule</p>
<div class="mx-2 flex flex-col justify-center items-center h-full">
  <DatePicker />
</div>


<style></style>