define(['webmaker-auth-client/webmaker-auth-client'], function ( WebmakerAuthClient ) {
  'use strict';

  return function() {
    var loginEl = document.querySelector('#webmaker-login');

    var auth = new WebmakerAuthClient({
      csrfToken: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    });

    auth.on('login', function(data) {
      logoutEl.removeEventListener('click', auth.login, false);
      loginEl.addEventListener('click', auth.logout, false);
      // usernameEl.innerHTML = data.email;
    });

    auth.on('logout', function() {
      logoutEl.removeEventListener('click', auth.logout, false);
      loginEl.addEventListener('click', auth.login, false);
      // usernameEl.innerHTML = '';
    });

    auth.on('error', function(err) {
      console.log(err);
    });

    auth.verify();

    loginEl.addEventListener('click', auth.login, false);
  };
});
