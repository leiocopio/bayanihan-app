<script>
	import { onMount } from "svelte";

  
    onMount(async () => {
      const res = await fetch("http://localhost:3000/api/test");
      const data = await res.json();
      console.log(data.message);

      
      
    });

  </script>