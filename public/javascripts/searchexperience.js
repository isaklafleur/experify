function init() {
  const input = document.getElementById('locationName');
  const autocomplete = new google.maps.places.Autocomplete(input);
}

$('#locationName').change(() => {
  setTimeout(getCoordinates, 100);
});

function getCoordinates() {
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  const request = {
    location: {
      lat: 0,
      lng: 0,
    },
    radius: '500',
    query: $('#locationName').val(),
  };

  service.textSearch(request, (places) => {
    const lat = places[0].geometry.location.lat();
    const long = places[0].geometry.location.lng();

    $('#lat').val(lat);
    $('#long').val(long);
  });
}

$('#goMap').click(function () {
  if ($('#lat').val() !== '' && $('#long').val() !== '') {
    $(this).find('a').attr('href', `/search?lat=${$('#lat').val()}&long=${$('#long').val()}`);
  }
});

$(document).ready(() => {
  init();
});
