//This is an injected content script. It deals with selected text context menu clicks
//myContentScriptKey will be filled in by the a message from the addin and is used to
//allow point to point communication between the addin and all the various injected page
//scripts.
var myContentScriptKey = null;
var myVar = null;
var iInterval = 2500;

//TODO: Show panel after each page load if logged in
$(document).ready(function () {
    //showPanel();

});

//Load all CSS urls
self.port.on('load-css-urls-target-content-script', function (data) {
  data.cssUrls.forEach(function (cssUrl) {
    var cssId = encodeURI(cssUrl);
    if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssUrl;
      link.media = 'all';
      head.appendChild(link);
    }
  });
});

function showPanel(){
    if ($('#datawake-right-panel').length === 0){
        var datawakePanel = '<div class="DWD_widget" id="datawake-right-panel"><div id="widgetOne">&nbsp;&nbsp;initializing...</div></divDWD_widget>';
        $('body').append(datawakePanel);
    }
}

function rewritePanel(html){
  $('#datawake-right-panel').html(html);
}

function rewritePanelDiv(div,html){
    $(div).remove();
    $("#datawake-right-panel").append(html);
}

function panelTimer(){
    self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
}

function buildPanelContents(data){
    var panelHtml = data.panelHtml;
    $('#timer').remove();
    rewritePanelDiv("#widgetOne", panelHtml);
}

//Populate panel
self.port.on('send-panel', function (data) {
    buildPanelContents(data);
    clearInterval(myVar);
});

////Test panel populate
//self.port.on('test-datawake-panel-content', function (data) {
//  rewritePanel('This is the test text.');
//});

//Toggle side panel
self.port.on('send-toggle-datawake-panel', function () {self.port.emit('requestPanelHtml-target-addin', {contentScriptKey: myContentScriptKey});
    if ($('#datawake-right-panel').length === 0) {
        var datawakePanel = '<div class="DWD_widget" id="datawake-right-panel"><div id="widgetOne">&nbsp;&nbsp;initializing...</div></divDWD_widget>';
        $('body').append(datawakePanel);
        myVar = setInterval(panelTimer, iInterval);
    }else{
        $("#datawake-right-panel").remove();
        clearInterval(myVar);
    }
});

//TODO: why is this duplicate of line 59?
//Populate side panel
self.port.on('send-panel', function (data) {
    if ($('#datawake-right-panel').length === 0) {
        rewritePanel(data.panelHtml);
    }
});

//Highlight DomainItems in page
self.port.on('toggle-showing-domain-items', function (data) {
  if (!data.domainItems.length) {
    $('body').unhighlight();
  } else {
    data.domainItems.forEach(function (domainItem) {
      $('body').highlight(domainItem);
    });
  }
});

self.port.on('page-attached-target-content-script', function (data) {
  myContentScriptKey = data.contentScriptKey;
  self.port.emit('send-css-urls-target-addin', {contentScriptKey: myContentScriptKey});
});

window.addEventListener("message",receiveMessage,false);

function receiveMessage(e){
    if(!e.data.dwDomainItem.value){
        return;
    }

    var newDomainItem = {
        id: e.data.dwDomainItem.id,
        itemValue: e.data.dwDomainItem.value,
        type: 'extracted',
        source: e.data.dwDomainItem.extractorId,
        dwDomainId: e.data.dwDomainItem.domainId
    };
    self.port.emit('addDomainItem-target-addin', newDomainItem);
    //var newDomainEntity = {
    //    name: e.data.dwDomainEntity.value,
    //    description: e.data.dwDomainEntity.value,
    //    dwDomainId: e.data.dwDomainEntity.domainId,
    //    dwExtractorId: 'abc', //e.data.dwDomainEntity.value,
    //    source: 'Converted'
    //};
    //alert('newDomainEntity:' + newDomainEntity.name);
    //Pass to Addin
    //self.port.emit('addEntityType-target-addin', newDomainEntity);
}
