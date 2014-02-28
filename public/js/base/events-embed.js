define(['jquery'], function ($) {

  return {
    init: function () {
      var self = this;

      self.$iframe = $('iframe');

      var contentHeight = 0;
      var hash;

      // Poll Events app in iframe for height changes
      setInterval(function () {
        self.$iframe[0].contentWindow.postMessage('heightCheck', self.$iframe[0].src);
      }, 33); // 30 FPS

      // Respond to height change messages from Events app in iframe
      window.addEventListener('message', function (event) {
        if (event.data.match('wme-height:')) {
          contentHeight = parseInt(event.data.split(':')[1], 10);
          self.$iframe.height(contentHeight);
        } else if (event.data.match('wme-hash:')) {
          hash = event.data.split(':')[1];

          if (hash !== window.location.hash) {
            window.location.hash = hash;
          }
        }
      });

      // EVENT DELEGATION -----------------------------------------------------

      $('.go-home').click(function () {
        self.changeView();
      });

      $('.go-add-event').click(function () {
        self.changeView('add');
      });

      $('.go-event-list').click(function () {
        self.changeView('events');
      });
    },
    changeView: function (view) {
      var self = this;

      self.$iframe[0].src = 'http://localhost:1981/index.html?embedded=true#/' + (view || '');
    }
  };

});
