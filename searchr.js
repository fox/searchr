(function() {  

  searchr = window.searchr = {};
    
  function openSettings(event) {
    if (event.key == 'openSettings') {
      event.preventDefault();
      safari.application.openBrowserWindow().activeTab.url = safari.extension.baseURI + 'settings.html';
    }
  }
  
  function beforeSearch(event) {
    var urls = searchr.buildSearchUrls(event.query);
    
    if (urls.length) {
      event.preventDefault();
      for(var i in urls) {
        var tab = (i == 0 ?
          safari.application.activeBrowserWindow.activeTab : 
          safari.application.activeBrowserWindow.openTab('background'));
        tab.url = urls[i];
      }
    }
  }
  
  function getDefaultEngines() {
    return {
      am: "http://www.amazon.com/s/field-keywords=%s",
      ar: "https://archive.org/search.php?query=%s",
      b: "https://www.bing.com/search?q=%s",
      bt: "https://btdigg.org/search?info_hash=&q=%s",
      br: "http://www.britannica.com/search?query=%s",
      d: "https://duckduckgo.com/?q=%s",
      eb: "http://www.ebay.com/sch/i.html?_nkw=%s",
      fe: "http://feedly.com/#search%2F%s",
      fi: "http://www.filecrop.com/search.php?w=%s",
      g: "https://www.google.com/search?q=%s",
      gh: "https://github.com/search?q=%s",
      gi: "https://www.google.com/search?tbm=isch&q=%s",
      gv: "https://www.google.com/search?tbm=vid&q=%s",
      gb: "https://www.google.com/search?tbm=bks&q=%s",
      gp: "https://play.google.com/store/search?q=%s",
      gm: "https://www.google.com/maps/place/%s",
      fb: "https://www.facebook.com/search/results.php?q=%s",
      tw: "https://twitter.com/search?q=%s",
      l: "http://www.google.com/search?q=%s&btnI",
      la: "http://www.last.fm/search?q=%s",
      li: "https://www.linkedin.com/vsearch/f?type=all&keywords=%s",
      h: "http://hypem.com/search/%s/1/",
      im: "http://www.imdb.com/find?q=%s",
      it: "https://www.google.hr/search?q=%s+site%3Aitunes.apple.com",
      ki: "http://kickass.to/usearch/%s/?field=seeders&sorder=desc",
      me: "http://www.metacritic.com/search/all/%s/results",
      mi: "http://www.mixcloud.com/search/results/?mixcloud_query=%s",
      om: "http://www.openstreetmap.org/search?query=%s",
      pi: "http://thepiratebay.se/search/%s/7/7/0",
      ro: "http://www.rottentomatoes.com/search/?search=%s",
      s: "https://soundcloud.com/search/sounds?q=%s",
      sc: "http://www.scribd.com/search?query=%s",
      st: "http://stackoverflow.com/search?q=%s",
      tu: "http://tunein.com/search/?query=%s",
      w: "http://en.wikipedia.org/wiki/%s",
      wa: "https://www.wolframalpha.com/input/?i=%s",
      wq: "http://en.wikiquote.org/wiki/%s",
      y: "http://www.youtube.com/results?search_query=%s&filters=video"
    };
  }

  searchr.getEngines = function() {
    return settings.get('engines', getDefaultEngines);
  }

  searchr.saveEngines = function(engines) {
    settings.set('engines', engines);
  }
  
  searchr.clearEngines = function() {
    settings.remove('engines');
  };
  
  searchr.getDefault = function() {
    return settings.get('default');
  }

  searchr.saveDefault = function(key) {
    settings.set('default', key);
  }
  
  searchr.clearDefault = function() {
    settings.remove('default');
  };

  searchr.buildSearchUrls = function(query) {
    var urls = [];
    var words = query.split(' ');
    var keys = words.shift().split('+');
    var search = words.join('+');
    var engines = searchr.getEngines();
    
    keys.forEach(function(key) {
      if (engines[key]) {
        urls.push(engines[key].replace('%s', search)); 
      } 
    });

    if (urls.length == 0) {
      var key = searchr.getDefault();
      if (key && engines[key]) {
        urls.push(engines[key].replace('%s', query.replace(/ /, '+'))); 
      }      
    }
    
    return urls;
  };
    
  if (window.safari && safari.application) {
    safari.application.addEventListener('beforeSearch', beforeSearch, false);
    safari.extension.settings.addEventListener('change', openSettings, false);
  }
        
})();
