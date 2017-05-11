  $(() => {
    let socket = io();
    socket.emit('new user', $('#namebuyer').val(), (data) => {
      if (data) {
      } else {
        $('#nickError').html('That username is already taken');
      }
    });

    const conversationId = document.getElementById('conversationId').value;
    const url = `/conversation/${conversationId}`;

    $.ajax({
      url,
      method: 'GET',
      success (chathistory) {
        // console.log(chathistory);
        // for (var i = chathistory.conversation.length - 1; i >= 0; i--) {
          for (var i = 0; i < chathistory.conversation.length; i++) {
          console.log(chathistory);
          $('#messages').append(`<span class="msg"><b>${chathistory.conversation[i].author.name}: </b>${chathistory.conversation[i].body}</span><br />`);
          // ${chathistory.conversation[i].createdAt}
        }
      },
      error(error) {
        console.log('error');
      },
    });

    socket.on('username', (data) => {
      let html = '';
      for (let i = 0; i < data.length; i++) {
        html += `<i style="color: lime;" class="fa fa-circle" aria-hidden="true"></i> ${data[i]}<br/>`;
      }
      $('#users').html(html);
    });

    $('#chatform').submit((e) => {
      e.preventDefault();
      const conversationId = document.getElementById('conversationId').value;
      const url = `/conversation/${conversationId}`;
      reply = {
        composedMessage: $('#m').val(),
        idsender: $('#idsender').val(),
      };
      $.ajax({
        url,
        method: 'POST',
        data: reply,
        success (res) {
          // console.log(res);
        },
        error(error) {
          console.log('error');
        },
      });

      socket.emit('send message', $('#m').val(), (data) => {
        $('#messages').append(`<span class="error">${data}</b></span><br />`);
      });
      $('#m').val('');
      return false;
    });

    socket.on('new message', (data) => {
      // console.log('new notification');
      displayMessage(data);
    });
    socket.on('whisper', (data) => {
      $('#messages').append(`<span class="whisper"><b>${data.nick}: </b>${data.msg}</span><br />`);
    });

    function displayMessage(data) {
      $('#messages').prepend(`<span class="msg"><b>${data.nick}: </b>${data.msg}</span><br />`);
    }
  });
