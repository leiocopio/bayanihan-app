<script>
    import { onMount } from "svelte";
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";
  
    onMount(() => {
      const map = L.map("map").setView([14.81389, 121.04528], 13);
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
  
      // Add a marker for San Jose del Monte
      L.marker([14.81389, 121.04528])

    });
  </script>
  <div class="mx-2 my-4">
    <p class="text-2xl font-bold mb-4">Maps</p>

  <br>
  <p>
    This map shows the location of garbage trucks in San Jose del Monte.
  </p>
  </div>
  <div id="map" ></div>
  
  <style>
    #map {
      width: 100%;
      height: 79vh;
      z-index: 0;
      
    }
  </style>
  