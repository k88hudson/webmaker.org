define(['webmaker-auth-client/webmaker-auth-client'], function ( WebmakerAuthClient ) {
  'use strict';

  var auth = new WebmakerAuthClient({
    paths: {
      verify: "/verify"
    },
    csrfToken: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  });

  var loginEl = document.querySelector('#webmaker-login'),
      logoutEl = document.querySelector('#webmaker-logout');

  function showLogin() {
    loginEl.style.display = "inline-block";
    logoutEl.style.display = "none";
  }

  function showLogout() {
    loginEl.style.display = "none";
    logoutEl.style.display = "inline-block";
  }

  auth.on('login', showLogout);

  auth.on('logout', showLogin);

  auth.verify();

  loginEl.addEventListener('click', auth.login, false);
  logoutEl.addEventListener('click', auth.logout, false);

  return auth;
});
