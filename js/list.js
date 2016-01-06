var parkingLot = {

  selected: false,

  initialize: function() {
    this.fillEntries();
    this.setControls();
    this.watchChanges();
    this.clipboard();
    this.itemSelection();
  },



  clipboard: function() {
    $('.list__main').on("click", ".list__copy-button", function(event) {
      var list = $(this).next().children().first().text(),
          top  = window.pageYOffset || document.documentElement.scrollTop,
          listItem = $(this).parent(),
          listInner = $(this).next(),
          listSpan = $(this).next().children().first(); // first span element
      copyToClipboard(list, top);
      listSpan.animate( { opacity: 0, top: '-=50', }, 300 ).delay(200);
      listSpan.animate( { top: '0', }, 100 ).delay(100);
      listSpan.animate( { opacity: 1, }, 100 );
    });
    function copyToClipboard( text, scrollpostion, callback){
      var copyDiv = document.createElement('div');
      copyDiv.contentEditable = true;
      document.body.appendChild(copyDiv);
      copyDiv.innerHTML = text;
      copyDiv.unselectable = "off";
      copyDiv.focus();
      document.execCommand('SelectAll');
      document.execCommand("Copy", false, null);
      document.body.removeChild(copyDiv);
      $('html, body').scrollTop(scrollpostion);
    }
  },



  setControls: function() {
    var parent = this;
    $('.controls__button-select').on("click", function() {
      if($(this).hasClass('active')) {
        $('.list__item.fresh').addClass('selected');
      } else {
        $('.list__item').removeClass('selected');
      }
    });
    $('.controls__button-search').on("click", function() {
      $('.list__item.selected').each(function() {
        var href = $(this).data("href");
        window.open(href, '_blank');
      });
    });
    $('.controls__button-delete').on("click", function() {
      var idArray = parent.__retrieveSelected();
      if(idArray.length)
        parent.deleteEntries(idArray);
      parent.__deselectAll();
    });
    $('.controls__button-unfresh').on('click', function() {
      var idArray = parent.__retrieveSelected();
      if(idArray.length)
        parent.markComplete(idArray);
      parent.__deselectAll();
    });
    $('.controls__button-settings').on('click', function() { $('.settings__panel').toggleClass('reveal'); });
    $('.settings__panel').on('click', function() { $(this).toggleClass('reveal'); });
  },



  itemSelection: function() {
    var mousedown = false,
        mousemove = false,
        didSelect = false;
    // listen for mouse events
    $('body').on("mousedown", function() { mousedown = true; });
    $('body').on('mousemove', function() { mousemove = true; });
    function resetMouse() {
      mousedown = false;
      mousemove = false;
      didSelect = false;
    }
    // when dragging over elements, make them selected (regardless of current state)
    $('.list__main').on("mouseover", '.list__item', function() {
      if(mousedown) {
        if(!$(this).hasClass("selected")){
          $(this).addClass("selected");
          didSelect = true;
        }
      }
    });
    // toggle items that are directly clicked
    $('.list__main').on("mousedown", '.list__item', function() {
      $(this).toggleClass("selected");
      didSelect = true;
    });
    // deselect when clicking on body AND no selection has been made
    $('html').on("mouseup", function() {
      if(mousemove && !didSelect) {
        $('.list__item').removeClass("selected");
      }
      resetMouse();
    });
    // don't deselect when clicking on control buttons
    $('.controls__button').on("mouseup", function(event) {
      event.stopPropagation();
      resetMouse();
    });
  },



  __updateControls: function() {
    if(this.selected) {
      $('.controls__button').addClass("active");
    } else {
      $('.controls__button').removeClass("active");
    }
  },


  __retrieveSelected: function() {
    var idArray = [];
    $('.list__item').each(function() {
      if($(this).hasClass("selected")){
        idArray.push($(this).data("id"));
      }
    });
    return idArray;
  },



  __deselectAll: function() {
    this.selected = false;
    $('.list__item').removeClass("selected");
  },



  markComplete: function(idArray) {
    chrome.storage.local.get("entries", function(items) {
      var entryList =  items.entries ? items.entries : [];
      for(var i = entryList.length - 1; i >= 0; i--) {
        if(idArray.indexOf(entryList[i][0]) != -1)
          entryList[i][2] = false;
      }
      chrome.storage.local.set({ "entries": entryList }, function(items) {
      });
    });
  },



  deleteEntries: function(idArray) {
    var parent = this;
    chrome.storage.local.get("entries", function(items) {
      var entryList =  items.entries ? items.entries : [];
      for(var i = entryList.length - 1; i >= 0; i--) {
        if(idArray.indexOf(entryList[i][0]) != -1)
          entryList.splice(i,1);
      }
      chrome.storage.local.set({ "entries": entryList }, function(items) {
      });
    });
  },



  fillEntries: function() {
    var parent = this;
    chrome.storage.local.get("entries", function(items) {
      if (!chrome.runtime.error) {
        var arr = items.entries,
            content = '';

        for(var i in arr) {
          var milliseconds = new Date(arr[i][0]);
          var date = milliseconds.toLocaleTimeString();

          if(arr[i][2] === true)
            content += '<li tabindex="' + (i + 10) + '" data-id="' + arr[i][0] + '" data-href="http://www.google.com/search?q=' + encodeURIComponent(arr[i][1]) + '" class="list__item fresh" draggable="false">';
          else
            content += '<li tabindex="' + (i + 10) + '" data-id="' + arr[i][0] + '" data-href="http://www.google.com/search?q=' + encodeURIComponent(arr[i][1]) + '" class="list__item" draggable="false">';
          content += '<div class="list__copy-button"><img src="../img/icon-clipboard.svg" alt="copy to clipboard" title="copy to clipboard"></div>';
          content += '<div class="list__item-inner">';
          content += '<span>' + arr[i][1] + '</span>';
          //content += '<span>' + date + ' ' + milliseconds + '</span>';
          content += '<span></span>'
          content += '<span>' + arr[i][1] + '</span>';
          content += '</div>';
          content += '</li>';
        }
        if(arr.length != 0)
          $('.list__main').html(content);
        else
          $('.list__main').html('<li class="list__placeholder">time to add some ideas!</li>');
      }
    });
  },



  watchChanges: function() {
    var parent = this;
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      setTimeout(function() { parent.fillEntries(); }, 500);
    });
  },

};


$(window).on("load", function() {
  parkingLot.initialize();
});
