

var selectedId = -1;

var loadOptions = function(callback) {
  chrome.storage.sync.get(
    null,
    function(items) {
      callback(items);
    });
};

function ensureRibbon() {

  
  loadOptions(function(settings) {

   // console.log('loaded options', settings);


    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function(tabs) {

      if(!tabs[0])
        return;
      var url = tabs[0].url;
      if(!url)
        return;

      settings.rules.forEach(function(setting) {

        if (new RegExp(setting.pattern).test(url)) {
        //  console.log("Matched url: ", url);
        
          chrome.tabs.insertCSS({
            code: setting.css
          });

          chrome.tabs.executeScript({
            code: `
            var elementExists = document.getElementById("environment_tagger");
            if(!elementExists){
              var div = document.createElement("div");
              div.id="environment_tagger"; 
              div.innerHTML = '` + setting.html + `'  
              document.body.appendChild(div); 
            }
          `,
            runAt: 'document_start'
          });
        }
      });
    });
  });

}

chrome.tabs.onUpdated.addListener(function(tabId, props) {
  if (props.status == "complete" && tabId == selectedId)
    ensureRibbon();
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, props) {
  selectedId = tabId;
  ensureRibbon();
});

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function(tabs) {
  selectedId = tabs[0].id;
  ensureRibbon();
});


//var pollInterval = 1000 * 60; // 1 minute
var pollInterval = 2000; //2 sec

function startRequest() {
  ensureRibbon();
  window.setTimeout(startRequest, pollInterval);
}
startRequest();