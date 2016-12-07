

var selectedId = -1;

var loadOptions = function(callback) {
  chrome.storage.sync.get(
    null,
    function(items) {
      callback(items);
    });
};


var buildHtml = function(setting){
  //console.log(setting)
  var defaultHtml = '<div class="ribbon-base ##class##" id="mark"><span>##text##</span></div>';
  var positionCss = parsePostion(setting);
  var colorCss = parseColor(setting);

  var html = defaultHtml
      .replace(new RegExp('##text##'),setting.text)
      .replace(new RegExp('##class##'),positionCss + ' ' + colorCss);
    return html;
}

function parsePostion(setting){
  if(setting.position == 'Top Left')
    return 'ribbon-top-left';

  return 'ribbon-top-right';
}

function parseColor(setting){
  if(setting.color == 'Green')
    return 'ribbon-color-green';

  return 'ribbon-color-blue';
}

function ensureRibbon() {

  
  loadOptions(function(settings) {

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
  
          chrome.tabs.executeScript({
            code: `
            var elementExists = document.getElementById("environment_tagger");
            if(!elementExists){
              var div = document.createElement("div");
              div.id="environment_tagger"; 
              div.innerHTML = '` + buildHtml(setting) + `';
              document.body.appendChild(div); 

              var style = document.createElement('style');
              style.id = "environment_tagger_style";
              style.type = 'text/css';
              style.appendChild(document.createTextNode(\`` + defaultCss + `\`));
              document.head.appendChild(style);
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



var defaultCss = `.ribbon-base {
  position: absolute;
  overflow: hidden;
  width: 200px; height: 200px;
  text-align: right;
  z-index:100000;
  pointer-events: none;
}
.ribbon-base span {
    font-family: arial;
    font-size: 20px;
    font-weight: bold;
    color: #FFF;
    text-transform: uppercase;
    text-align: center;
    line-height: 36px;
    
    width: 250px;
    display: block;
    background: #79A70A;
    background: linear-gradient(#9BC90D 0%, #79A70A 100%);
    box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
    position: absolute;
    top: 59px;
    opacity: 0.9;
    
}

.ribbon-top-left{
    left: 0; 
    top: 0;
}

.ribbon-top-left span{
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  left: -49px;
}

.ribbon-top-right{
    right: 0; 
    top: 0;
}

.ribbon-top-right span{
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  right: -49px;
}

.ribbon-color-green span {

}

.ribbon-color-blue span{
  background: #1e5799;
  background: linear-gradient(#2989d8 0%, #1e5799 100%);
}

`;