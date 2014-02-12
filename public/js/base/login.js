define(['jquery', 'webmaker-auth-client/webmaker-auth-client'], function ($, WebmakerAuthClient ) {
  'use strict';
console.log( "wat" );
  var auth = new WebmakerAuthClient({
    csrfToken: $('meta[name="csrf-token"]').attr('content')
  });

  var loginEl = $('#webmaker-login'),
      logoutEl = $('#webmaker-logout');

  function toggleUserData( userData ) {
    var placeHolder = $( "#identity" ),
        userElement = $( "div.user-name" ),
        html = document.querySelector( "html" ),
        lang = html && html.lang ? html.lang : "en-US";

    if ( userData ) {
      placeHolder.html( '<a href="{{ hostname }}/' + lang + '/account">' + userData.name + "</a>" );
      placeHolder.before( "<img src='https://secure.gravatar.com/avatar/" +
                          userData.hash + "?s=26&d=https%3A%2F%2Fstuff.webmaker.org%2Favatars%2Fwebmaker-avatar-44x44.png' alt='" +
                          userData.hash + "'>" );
    } else {
      userElement.html( "<span id='identity'></span>" );
    }
  }

  function showLogin(user) {
    toggleUserData(user);
    loginEl.show();
    logoutEl.hide();
  }

  function showLogout() {
    toggleUserData();
    loginEl.hide();
    logoutEl.show();
  }

  auth.on('login', showLogout);

  auth.on('logout', showLogin);

  loginEl.click(auth.login);
  logoutEl.click(auth.logout);

  auth.verify();

  return auth;
});
