$(document).ready(function () {

  var titleTag = document.getElementById('experienceName');
  var url = 'http://localhost:3000/api/' + titleTag.dataset.id;

  $.ajax({
    url: url,
    method: 'GET',
    success: printMapAndMarker,
    error: function (error) {
      console.log('error');
    }
  });

  function printMapAndMarker(experience) {
    var position = {
      lat: experience.location.coordinates[1],
      lng: experience.location.coordinates[0],
    };

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: position,
    });

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: experience.name,
    });
  }
});
