var parkingLot = {
  initialize: function() {
      this.generateList();
      this.selectOnClick();
      this.setControls();
  },

  setControls: function() {
    var parent = this;
    $('.controls__select').on("click", function() {
      $(this).toggleClass('active');
      if($(this).hasClass('active')) {
        $(this).html('Uncheck All');
        $('.list__item').addClass('selected');
      } else {
        $(this).html('Select All');
        $('.list__item').removeClass('selected');
      }
    });
    $('.controls__delete').on("click", function() {
      var idArray = [];
      $('.list__item').each(function() {
        if($(this).hasClass("selected")){
          idArray.push($(this).data("id"));
        }
      });
      console.log(idArray);
      parent.deleteEntries(idArray);
    });
  },

  selectOnClick: function() {
    $('.list__main').on("click", '.list__item', function(){
        $(this).toggleClass("selected");
    });
  },

  deleteEntries: function(idArray) {
    var parent = this;
    chrome.storage.local.get("entries", function(items) {
      var entryList =  items.entries ? items.entries : [];

      for(var i = entryList.length - 1; i >= 0; i--) {
        if(idArray.indexOf(entryList[i][0]) != -1){
          entryList.splice(i,1);
        }
      }
      chrome.storage.local.set({ "entries": entryList }, function(items) {
        if (!chrome.runtime.error) {
          console.log("now spliced");
        }
      });
    });
  },

  generateList : function() {
    var parent = this;
    chrome.storage.local.get("entries", function(items) {
      if (!chrome.runtime.error) {
        var arr = items.entries,
            content = '';

        for(var i in arr) {
          content += '<li data-id="' + arr[i][0] + '" class="list__item" draggable="true">';
          content += '<div class="list__item-inner">';
          content += arr[i][1];
          content += '<a class="list__search-icon" href="http://www.google.com/search?q=' + encodeURIComponent(arr[i][1]) + '" target="_blank">';
          content += '<img src="../img/Google_Logo.svg" alt="google search icon" title="google this term"></a>';
          content += '</div>';
          content += '</li>';
        }
        $('.list__main').html(content);
      }
    });
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      $('.lot__row').attr("class", 'lot__row hideLot');
      setTimeout(function(){
        location.reload();
      }, 200);
    });
  }
};


$(window).on("load", function() {
  parkingLot.initialize();
});
