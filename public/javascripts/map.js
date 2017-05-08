function initAutocomplete() {
  var infowindow = new google.maps.InfoWindow();

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: Number(loc.lat),
      lng: Number(loc.lng),
    },
    zoom: 14,
    scrollwheel: false,
    mapTypeId: 'roadmap',
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);


  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });


  map.addListener('dragend', function () {
    console.log("test");
    window.location.href = "http://localhost:3000/search?lat=" + map.center.lat() + "&long=" + map.center.lng();

  })

  let markers = [];

  let array = window.location.href.split("/")[3].split("=")
  let location = {
    lat: array[1].split("&")[0],
    lng: array[2],
  };

  $.ajax({
    url: "http://localhost:3000/search/json",
    data: location,
    type: "get",
    success: function (response) {
      response.forEach(function (response) {
          let title = response.name
          let position = {
            lat: response.location.coordinates[1],
            lng: response.location.coordinates[0]
          };
          var pin = new google.maps.Marker({
            position,
            map,
            title
          });
          var contentString = '<div class="pin-google"><h5>' + response.name + '</h5>' + '<h5>' + response.price + '$/hour</h5>' + '<h5>' + response.slogan + '</h5>';

          google.maps.event.addListener(pin, 'click', function () {
            infowindow.setContent(contentString + '<br>' + '<button class="btn btn-success"><a href="/users/' + response._id + '">Contact</a></button>');
            infowindow.open(map, this);
          });
      });
    },
    error: function (error) {
      console.log(error);
    },
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  $("#goSearch").on('click', function () {
    var places = $("#goSearch").getPlaces();
    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }


      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
