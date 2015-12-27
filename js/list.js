var parkingLot = {
  initialize: function() {
    this.fillEntries();
    this.selectOnClick();
    this.setControls();
    this.watchChanges();
    this.dragSelect();
    this.clickToDeselect();
  },

  watchChanges: function() {
    var parent = this;
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      $('.lot__row').attr("class", 'lot__row hideLot');
      parent.fillEntries();
    });
  },

  setControls: function() {
    var parent = this;
    $('.controls__button-select').on("click", function() {
      $(this).toggleClass('active');
      if($(this).hasClass('active')) {
        $('.list__item.fresh').addClass('selected');
        if($('.list__item.fresh').length > 0)
          $(this).html('Deselect');
      } else {
        $(this).html('Select All');
        $('.list__item').removeClass('selected');
      }
    });
    $('.controls__button-delete').on("click", function() {
      var idArray = parent.retrieveSelected();
      parent.deleteEntries(idArray);
      parent.resetButtons();
    });
    $('.controls__button-unfresh').on('click', function() {
      var idArray = parent.retrieveSelected();
      parent.markComplete(idArray);
      parent.resetButtons();
    });
    $('.controls__button-settings').on('click', function() {
      $('.settings__panel').toggleClass('reveal');
    });
    $('.settings__panel').on('click', function() {
      $(this).toggleClass('reveal');
    });
  },

  resetButtons: function() {
    $('.controls__button').removeClass('active');
  },

  clickToDeselect: function() {
    // $('body').on("click", '.list__item', function() {
    //   if($('.list__item.selected').length > 0)
    //     $(this).removeClass("selected");
    // });
  },

  dragSelect: function() {
    $(function () {
      var isMouseDown = false;
      function pauseEvent(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
      }
      $("main.lot").on('mousedown', '.list__item', function () {
        e=e || window.event;
        pauseEvent(e);
        isMouseDown = true;
        $(this).toggleClass("selected");
        return false;
      });
      $("main.lot").on('mouseover', '.list__item', function () {
        e=e || window.event;
        pauseEvent(e);
        if (isMouseDown) {
          $(this).removeClass("selected");
        }
        return false;
      });
      $(document).mouseup(function () {
        isMouseDown = false;
      });
    });
  },

  retrieveSelected: function() {
    var idArray = [];
    $('.list__item').each(function() {
      if($(this).hasClass("selected")){
        idArray.push($(this).data("id"));
      }
    });
    return idArray;
  },

  selectOnClick: function() {
    $('.list__main').on("click", '.list__item', function(){
        $(this).toggleClass("selected");
    });
  },

  markComplete: function(idArray) {
    chrome.storage.local.get("entries", function(items) {
      var entryList =  items.entries ? items.entries : [];
      for(var i = entryList.length - 1; i >= 0; i--) {
        if(idArray.indexOf(entryList[i][0]) != -1)
          entryList[i][2] = false;
      }
      chrome.storage.local.set({ "entries": entryList }, function(items) {
        if (!chrome.runtime.error) {
        }
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
        if (!chrome.runtime.error) {
          console.log("now spliced");
        }
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
          if(arr[i][2] === true)
            content += '<li data-id="' + arr[i][0] + '" class="list__item fresh" draggable="false">';
          else
            content += '<li data-id="' + arr[i][0] + '" class="list__item" draggable="false">';
          content += '<div class="list__item-inner">';
          content += arr[i][1];
          content += '<a class="list__search-icon" href="http://www.google.com/search?q=' + encodeURIComponent(arr[i][1]) + '" target="_blank">';
          content += '<img src="../img/Google_Logo.svg" alt="google search icon" title="google this term"></a>';
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

};


$(window).on("load", function() {
  parkingLot.initialize();
});
