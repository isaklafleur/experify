$('#goMap').click(function () {
  if ($('#lat').val() !== '' && $('#long').val() !== '') {
    $(this).find('a').attr('href', `/search?lat=${$('#lat').val()}&long=${$('#long').val()}`);
  }
});

$(document).ready(() => {
  init();
});

