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
    $('#list-link').on("click", function() {
      chrome.tabs.create({url:'views/parkinglot.html'});
    });
  },

  smartTyping: function() {
    $(".form__text").keyup(function(e){
      if(e.keyCode !== 13) {
        var len = $('.form__text').val().length;
        if( len === 0 && this.typed) {
          $('.footer code').attr("class", "");
          $('#file-folder').attr("class", "");
        } else if( len >= 1 && len <= 4) {
          $('.footer code').addClass("active");
          $('.footer small').addClass("active");
          $('#file-folder').attr("class", "active");
          this.typed = true;
        } else if(len >= 28 ) {
          $('#file-folder').attr("class", "active hidden");
        }
      } else {
        return false;
      }
    });
  },

  getTime: function() {
    return new Date().getTime();
  },

  getForm: function() {
    return $('.form__text').val();
  },

  setValue: function( keyValuePair ) {
    var parent = this;
    chrome.storage.local.set( keyValuePair, function(items) {
      if (!chrome.runtime.error) {
        parent.animateFileSave();
      }
    });
  },

  smartSubmit: function() {
    var parent = this;
    $(".form").submit(function( event ) {
      event.preventDefault();
      var currTime = new Date().getTime();
      var txtField = parent.getForm();

      chrome.storage.local.get("entries", function(items) {
        var entryList =  items.entries ? items.entries : [];
        entryList.unshift( [currTime, txtField] );
        parent.setValue({ "entries" : entryList });
      });
      setTimeout(function(){
        window.close();
      }, 1300);
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
