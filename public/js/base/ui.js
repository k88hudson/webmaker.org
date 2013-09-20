define( ["jquery", "text!html/ui-fragments.html" ], function( $, _fragments ) {
  "use strict";

  var UI = {},
      $fragments = $( document.createElement( "div" ) ).html( _fragments );

  var fragments = document.createElement( "div" );
  fragments.innerHTML = _fragments;

   UI.select = function( select, fn ) {

      $('.filter').removeClass("hide");

      select = document.querySelector(select);

      var el = fragments.querySelector(".ui-select").cloneNode(true),
          toggleBtn = el.querySelector(".icon"),
          selectedEl = el.querySelector(".ui-selected"),
          menuContainer = el.querySelector(".ui-select-menu"),
          menu = menuContainer.querySelector("ul"),
          li = menu.querySelector("li");

      var options = select.querySelectorAll('option'),
          id = select.id;

      fn = fn || function() {};

      var option,
          val,
          html,
          newLi,
          currentSelected;

      for (var i = 0; i < options.length; i++) {
        option = options[i];
        val = option.value;
        html = option.innerHTML;

        newLi = li.cloneNode(true);
        newLi.setAttribute("data-value", val);
        newLi.setAttribute("data-value", val);
        newLi.innerHTML = html;

        if (option.selected) {
          newLi.getAttribute("data-selected", true);
          selectedEl.innerHTML = html;
        }
        newLi.addEventListener("click", function() {
          currentSelected = menu.querySelector("[data-selected]");
          if (currentSelected) {
           currentSelected.removeAttribute("data-selected");
          }
          this.setAttribute("data-selected", true);
          selectedEl.innerHTML = html;
          menuContainer.style.display = "none";
          fn(val);
          select.value = val;
        }, false);
        menu.appendChild(newLi);
      }

      selectedEl.addEventListener("click", function(e) {
        console.log(menuContainer.style.display);
        menuContainer.style.display = menuContainer.style.display ? "": "block";
      }, false);

      toggleBtn.addEventListener("click", function(e) {
        menuContainer.style.display = menuContainer.style.display ? "": "block";
      }, false);

      el.id = id;
      select.id = "";

      li.parentNode.removeChild(li);
      select.parentNode.insertBefore(el, select.nextSibling);
      select.style.display = "none";
  };

  UI.pagination = function( page, total, limit, callback ) {
    var $pagination = $(".pagination"),
        $ul = $pagination.find("ul"),
        $_li = $("<li></li>"),
        $li,
        MAX_NUMS = 4,
        totalPages = total ? Math.ceil(total/limit) : 0,
        set = Math.floor((page-1)/MAX_NUMS),
        startPage = set * MAX_NUMS + 1,
        endPage = Math.min((set * MAX_NUMS) + MAX_NUMS, totalPages);

    if (totalPages > 1) {
      $pagination.show();
    } else {
      $pagination.hide();
    }

    var $prevBtn = $_li.clone().html("<span class=\"icon-chevron-left\"></span>"),
        $nextBtn = $_li.clone().html("<span class=\"icon-chevron-right\"></span>");

    function pageSearch(page) {
      return function() {
        callback(page);
      };
    }

    $ul.empty();

    // Show previous?
    if ( page > 1 ) {
      $ul.append($prevBtn);
      $prevBtn.click(pageSearch(page - 1));
    }
    // Iterate over all pages;
    for (var i = startPage; i <= endPage; i++) {
      $li = $_li.clone();
      $li.text(i);
      if (i === page ) {
        $li.addClass("active");
      }
      $li.click(pageSearch(i));
      $ul.append($li);
    }
    if (totalPages > endPage) {
      $li = $_li.clone();
      $li.text(totalPages);
      $li.click(pageSearch(totalPages));
      $ul.append("<li class=\"ellipsis\"></li>");
      $ul.append($li);
    }
    if (page < totalPages) {
      $ul.append($nextBtn);
      $nextBtn.click(pageSearch(page + 1));
    }
  };

  return UI;

});
