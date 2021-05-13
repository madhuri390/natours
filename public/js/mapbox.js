/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFkaHVydmVlcmFtcmVkZHkiLCJhIjoiY2tuZnh3bjBwMjVtcjJwbGN0M3QxbjMwNSJ9.1e4qyrYRU-1wn-WMwS1WgQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/madhurveeramreddy/cknh6z2ae57kq17o77khmg61l',
    scrollZoom: false,
    // center: [-118.24286279680537, 34.059990409778926],
    // zoom: 10,
    //interactive:false
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
