function init() {
  const input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
}

$('#searchTextField').change(() => {
  setTimeout(getCoordinates, 1000);
});

function getCoordinates() {
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  const request = {
    location: {
      lat: 0,
      lng: 0,
    },
    radius: '500',
    query: $('#searchTextField').val(),
  };

  service.textSearch(request, (places) => {
    const lat = places[0].geometry.location.lat();
    const long = places[0].geometry.location.lng();

    $('#lat').val(lat);
    $('#long').val(long);
  });
}

$(document).ready(() => {
  init();
  getCoordinates();
});
