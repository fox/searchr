(function() {  

  settings = window.settings = {};
  
  function onMessage(event) {
    var fun = event.name.split('settings.')[1];
    if (settings[fun]) {
      settings[fun].apply(this, JSON.parse(event.message));
    }
  } 
       
  settings.get = function(key, def) {
    var value;
    if (window.safari && safari.extension.settings) {
      value = safari.extension.settings[key];
      if (localStorage[key] === undefined) {
        localStorage[key] = value;
      }
    } else {
      value = localStorage[key];
    }
    if (value) { 
      try {
        var out = JSON.parse(value);
        return out;
      } catch (e) {}
    } 
    
    return def ? def() : null;
  }
  
  settings.set = function(key, value) { 
    if (window.safari) {
      if (safari.extension.settings) {
        localStorage[key] = safari.extension.settings[key] = JSON.stringify(value);
        return;
      } else { 
        safari.self.tab.dispatchMessage('settings.set', JSON.stringify([key, value]));
      }
    }
    localStorage[key] = JSON.stringify(value);
  }
  
  settings.remove = function(key) {
    if (window.safari) {
      if (safari.extension.settings) {
        delete localStorage[key]; 
        delete safari.extension.settings[key];
      } else { 
        delete localStorage[key];
        safari.self.tab.dispatchMessage('settings.remove', key);
      }
    } else {
      delete localStorage[key];
    }
  }
  
  if (window.safari && safari.application) {
    safari.application.addEventListener('message', onMessage, true);
  }

})();