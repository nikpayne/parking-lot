var _interface =  {

  typed: false,

  initialize: function() {
    this.linkPage();
    this.smartTyping();
    this.smartSubmit();
  },

  animateFileSave: function() {
      $(".component").each(function(){
        this.classList.toggle("active");
      });
  },

  linkPage: function(){
    var parent = this;
    $('#list-link').on("click", function() {
      chrome.tabs.create({url:'views/parkinglot.html'});
    });
    $("#file-folder").keypress(function (e) {
      if (e.keyCode == 13) {
        if($('.form__text').val() != ''){
          parent.storeValue();
          setTimeout(function(){
            chrome.tabs.create({url:'views/parkinglot.html'});
          }, 1600);
        } else {
          chrome.tabs.create({url:'views/parkinglot.html'});
        }
      }
    });
  },

  smartTyping: function() {
    $(".form__text").keyup(function(e){
      if(e.keyCode !== 13) {
        var len = $('.form__text').val().length;
        if( len === 0 && this.typed) {
          $('.footer code').attr("class", "");
          $('.footer small').attr("class", "");
          $('#file-folder').attr("class", "");
        } else if( len >= 1 && len <= 4) {
          $('.footer code').addClass("active");
          $('.footer small').addClass("active");
          $('#file-folder').attr("class", "active");
          this.typed = true;
        } else if(len >= 28 ) {
          $('#file-folder').attr("class", "active offset");
        }
      } else {
        return false;
      }
    });
  },

  setValue: function( keyValuePair ) {
    var parent = this;
    chrome.storage.local.set( keyValuePair, function(items) {
      if (!chrome.runtime.error) {
        $('.form__text').val("");
        parent.animateFileSave();
      }
    });
  },

  storeValue: function() {
    var parent = this;
    var currTime = new Date().getTime(),
        txtField = $('.form__text').val(),
        isFresh = true;
    chrome.storage.local.get("entries", function(items) {
      var entryList =  items.entries ? items.entries : [];
      entryList.unshift( [currTime, txtField, isFresh] );
      parent.setValue({ "entries" : entryList });
    });
  },

  smartSubmit: function() {
    var parent = this;
    $(".form").submit(function( event ) {
      event.preventDefault();
      parent.storeValue();
      setTimeout(function(){
        window.close();
      }, 1600);
    });
  }

};

_interface.initialize();

$(window).on("load", function() {
  var platform = window.navigator.platform;
  var isMac = platform.toUpperCase().indexOf('MAC') >= 0;
  if(isMac) {
    $('.footer').html('<code>&#8984; + J</code><br><small style="font-size: .6rem">&copy; Nikolas Payne - 2015 - 2015</small>');
  } else {
    $('.footer').html('<code>Ctrl + J</code>');
  }
});
