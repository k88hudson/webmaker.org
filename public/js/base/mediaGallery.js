define(['jquery', 'moment'],
  function ($, moment) {
  'use strict';

  var countLarge = 2,
      countMedium = 8,
      LIMIT_DESKTOP = 20,
      LIMIT_MOBILE = 6;

  var $body = $( 'body' ),
      $mainGallery = $('.main-gallery'),
      mainGallery = $mainGallery[0],
      $makeTemplate = $body.find( 'div.make' ),
      $makeTeachTemplate = $body.find( 'div.make-teach' ),
      $makeBackTemplate = $body.find( 'div.make-back' ),
      $eventBackTemplate = $body.find( 'div.event-back' ),
      isMobile = false;

  function createMakeBack( data, $el ) {
    var $backTemplate = $makeBackTemplate.clone( true ),
        $placeSpan = $('.place', $backTemplate),
        $titleLink = $('.title', $backTemplate),
        $dateSpan = $('.date', $backTemplate),
        $authorLink = $('.author', $backTemplate),
        $descSpan = $('.description', $backTemplate),
        $typeSpan = $('.type', $backTemplate),
        $viewBtn = $('.view-btn', $backTemplate),
        $forkBtn = $('.fork-btn', $backTemplate),
        createdAtDate = moment( new Date( data.createdAt ) ).fromNow();
        // Note that this is not working... no createdAt?

    $typeSpan.text( data.type );
    $titleLink.text( data.title );
    $titleLink.attr( "href", data.url );
    $dateSpan.text( createdAtDate );
    $authorLink.text( "@" + data.username );
    $authorLink.attr( "href", "/u/" + data.username );
    // $descSpan.text( data.description ); No desc for now
    $viewBtn.attr( "href", data.url );
    $forkBtn.attr( "href", data.url );
    // Note that the remix url doesn't exist right now?
    $el.append( $backTemplate );
  }

  function createMakeTeach( data, $el ) {
    var $teachTemplate = $makeTeachTemplate.clone( true ),
        $titleSpan = $('.title', $teachTemplate),
        $levelSpan = $('.level', $teachTemplate),
        $skillsSpan = $('.skills', $teachTemplate),
        $authorSpan = $('.author', $teachTemplate);

    $titleSpan.text( data.description );
    $levelSpan.text( data.level );
    $skillsSpan.text( data.skills );
    $authorSpan.text( data.author );
    $el.append( $teachTemplate );
  }

  function createEventBack( data, $el ) {
    var $backTemplate = $eventBackTemplate.clone( true ),
        $eventSpan = $('.event-title', $backTemplate),
        $dateSpan = $('.date', $backTemplate),
        $placeSpan = $('.place', $backTemplate),
        $descSpan = $('.description', $backTemplate),
        $organizerSpan = $('.organizer', $backTemplate);

    $eventSpan.text( data.title );
    $dateSpan.text( date.createdAt );
    $placeSpan.text( 'PLACE' );
    $descSpan.text( data.description );
    $organizerSpan.text( 'MOZILLA' );
    $el.append( $backTemplate );
  }

  // set up mouse over handlers
  if ($body[0].id === 'index' || $body[0].id === 'search-results') {
    $makeTemplate.on('mouseenter focusin, mouseleave focusout', function ( e ) {
      $('.flipContainer', this).toggleClass( 'flip' );
    });
  }

  function searchCallback( data, self ) {
    var $makeContainer = $makeTemplate.clone( true ).addClass('rf'),
        makeContainer = $makeContainer[0],
        randSize = 'large';

    console.log( data );
    // Make these easier to use
    if ( data.tags.guide ) {
      data.type = "guide";
    } else {
      data.type = data.contentType.replace( /application\/x\-/g, "" );
    }

    // If we're not in mobile view, we want to display multiple sizes for
    // the home page and the medium size for the teach page.
    if (!isMobile) {
      switch( $body[0].id ) {
        case 'index':
          if (countLarge > 0) {
            randSize = 'large';
            countLarge --;
          } else {
            randSize = 'medium';
            countMedium --;
          }
          break;

        case 'teach':
          randSize = 'medium';
          break;

        case 'search-results':
          randSize = 'medium';
          break;
      }
    }

    // create front Element & populate
    var $frontEl = $('<div class="front" style="background-image:url(' + data.thumbnail +
      ');"><div class="type-icon"></div><div class="front-title">' + data.title + '</div></div></div>');

    // create back element & populate
    var $backEl = $('<div class="back"></div>');
    var tags = data.tags;

     if ( tags.template ) {
      $makeContainer.addClass( 'make-template' );
    }
    $makeContainer.addClass( 'make-type-' + data.type );
    $makeContainer.addClass(randSize);

    switch( $body[0].id ) {
      case 'index':
        createMakeBack( data, $backEl );
        break;

      case 'teach':
        createMakeTeach( data, $frontEl );
        break;

      case 'search-results':
        createMakeBack( data, $backEl );
        break;
    }

    // add front & back elements to flip container
    var $flip = $('<div class="flipContainer"></div>');

    $flip.append($frontEl).append( $backEl );

    // add flip container & link to make container
    //var $a = $('<a href="' + data.url + '"></a>');
    $makeContainer.append( $flip );

    // add to gallery & packery
    $mainGallery.append( $makeContainer );
    self.packery.appended( makeContainer );
  }

  var MediaGallery = function(webmaker) {

    this.limit = LIMIT_DESKTOP;
    this.wm = webmaker;
    this.packery = new Packery(mainGallery, {
      itemSelector: 'div.make',
      gutter: '.gutter-sizer',
      transitionDuration: '0.2s'
    });

    this.packery.on( 'layoutComplete', function() {
      $mainGallery.removeClass('packery-hide');
    });

    this.packery.layout();

    // Detect whether we are in mobile dimensions or not.
    if (isMobile) {
      this.limit = LIMIT_MOBILE;
    }
  };

  MediaGallery.prototype.init = function() {
    var self = this;

    // Handles all packery-related content loading.
    switch ($body[0].id) {
      case 'template':
        break;
      case 'search':
        $('.make').click( function() {
          $( this ).toggleClass('expand');
          self.packery.layout();
        });
        break;
      case 'index':
        var $stickyBanner = $('<div class="make internal rf" id="banner-join">');
        var $h1 = $('<h1>Make history. Or, um, cat videos.</h1>');
        var $h2 = $('<h2>Claim your Webmaker domain:</h2>');
        var $signup_div = $('<div class="sign-up-div">');
        var $url_span = $('<span class="sign-up-span">Webmaker.org/</span>');
        var $form_div = $('<div class="form-div class="ui-input">');
        var $signup_form = $('<form action="get" class="ui-input">');
        var $name_input = $('<input name="yourname" id="yourname" required>').prop('placeholder', 'yournamehere');
        var $button = $('<button>').html('Sign up <i class="icon-chevron-right"></i>');

        $signup_form.append($name_input);
        $signup_form.append($button);
        $form_div.append($signup_form);

        $signup_div.append($url_span);
        $signup_div.append($form_div);

        $stickyBanner.append($h1);
        $stickyBanner.append($h2);
        $stickyBanner.append($signup_div);

        $mainGallery.append( $stickyBanner );

        this.wm.doSearch( { tags: ['featured'] }, this.limit, function( data ) {
          searchCallback( data, self )
        });
        this.packery.stamp( $stickyBanner[0] );
        this.packery.layout();
        break;

      case 'teach':
        var $stickyBanner = $('<div id="banner-teach" class="rf">' +
          '<img src="../img/webmaker-community.jpg" alt="Webmaker Community">' +
          "<p>Join us! We're a global community of technies, educators and friendly humans on " +
          'a mission.</p></div>');
        $mainGallery.append( $stickyBanner );
        this.limit = 12;

        this.wm.doSearch( { tags: ['featured', 'guide'] }, this.limit, function( data ) {
          searchCallback( data, self )
        });
        this.packery.stamp( $stickyBanner[0] );
        this.packery.layout();
        break;
    }
  };

  MediaGallery.prototype.search = function( options ) {
    var self = this;
    $('.rf').remove();

    // Every time we redraw all the elements, we need to recreate Packery or else
    // it draws the layout based on the previous setup.
    this.packery = new Packery(mainGallery, {
      itemSelector: 'div.make',
      gutter: '.gutter-sizer',
      transitionDuration: 0.1
    });
    $body.attr('id', 'search-results');
    this.limit = 16;
    this.wm.doSearch( options, this.limit, function( data ) {
      searchCallback( data, self )
    });
    this.packery.layout();
  };

  return MediaGallery;
});
