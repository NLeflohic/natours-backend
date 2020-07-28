/* eslint-disable */
const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoidmlra2luZyIsImEiOiJja2Q0a3dxMGsxOWt3MzFudHg5NXh4ajlsIn0.kHIzA-G2_ok0Gw928-9g4g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vikking/ckd4l1ycl052u1io7a3ics1vc',
    scrollZoom: false,
    // center: [-122.148846, 37.761235],
    // zoom: 9,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    //create markers
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //extends map bounds to include current location
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

export default displayMap;
