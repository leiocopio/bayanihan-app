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
        .addTo(map)
        .bindPopup("San Jose del Monte, Bulacan")
        .openPopup();
    });
  </script>
  <div>
    <p>Maps</p>
  </div>
  <div id="map"></div>
  
  <style>
    #map {
      width: 100vw;
      height: 88.5vh;
      z-index: 0;
    }
  </style>
  