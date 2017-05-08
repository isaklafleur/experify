$(document).ready(() => {
  const titleTag = document.getElementById('experienceName');
  const url = `http://localhost:3000/api/${titleTag.dataset.id}`;

  $.ajax({
    url,
    method: 'GET',
    success: printMapAndMarker,
    error(error) {
      console.log('error');
    },
  });

  function printMapAndMarker(experience) {
    const position = {
      lat: experience.location.coordinates[1],
      lng: experience.location.coordinates[0],
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: position,
    });

    const marker = new google.maps.Marker({
      position,
      map,
      title: experience.name,
    });
  }
});
