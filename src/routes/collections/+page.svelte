<script>
  import { Calendar, DayGrid } from "@event-calendar/core";


  //let options = $state({
    // Make it a comment, I'll use it later
    //events: [
    //],
  //});
</script>

<div class="flex justify-center items-center h-screen">
  <div class="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4">
    <Calendar plugins={[DayGrid]} />
  </div>
</div>

<style></style>