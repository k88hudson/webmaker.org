define(["jquery", "localized", "nunjucks", "base/ui", "moment", "uri", "makeapi", "masonry"],
  function ($, localized, nunjucks, UI, moment, URI, Make, Masonry) {
    "use strict";

    var $loading = $(".loading-cat"),
      stampBanner = document.querySelector(".stamp"),
      mainGallery = document.querySelector(".main-gallery"),
      $mainGallery = $(mainGallery),
      lastQuery,
      queryKeys = URI.parse(window.location.href).queryKey,
      lang = $('html').attr('lang');

    moment.lang(localized.langToMomentJSLang(lang));

    nunjucks.env = new nunjucks.Environment(new nunjucks.HttpLoader("/views", true));

    // Making a custom filter to use it for the client-side l10n
    // Using this filter will help reduce the number of adding
    // variables to the global nunjucks variable.
    // The usage will be "{{ "some string" | gettext }}"
    nunjucks.env.addFilter('gettext', function (data) {
      return localized.get(data);
    });

    // Set up masonry
    var masonry = new Masonry(mainGallery, {
      itemSelector: "div.make",
      gutter: ".gutter-sizer"
    });

    $loading.hide();

    if (stampBanner) {
      masonry.stamp(stampBanner);
      masonry.layout();
    }

    $("#prefix-select").on("change", function (e) {
      queryKeys.prefix = this.value;
      window.location.search = $.param(queryKeys);
    });

    UI.select("#layout-select", function (val) {
      queryKeys.layout = val;
      window.location.search = $.param(queryKeys);
    });

  });
