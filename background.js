function tabExecute(codeString) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: codeString});
  });
}

function log(data) {
  chrome.extension.getBackgroundPage().console.log(data);
}

function toggleAutoReplay(bool) {
  const defineTimerId = 'let timerId = null;'
  const defineAutoReplay = 'function autoReplay(){var t=document.querySelector(".ytp-play-button");if(t&&"Replay"===t.title){var e=new Event("click");t.dispatchEvent(e)}}'
  const startCodeString = 'timerId=setInterval(autoReplay,250);'
  const stopCodeString = 'clearInterval(timerId);';

  // Define interval and logic so the interval can be added/removed with a single statement
  tabExecute(defineTimerId)
  tabExecute(defineAutoReplay)

  const codeString = bool ? startCodeString : stopCodeString;
  tabExecute(codeString)
}

// favicon is blue when auto replay is active
function setFavicon(state) {
  const identifier = state === 'on' ? 'blue' : 'gray';
  const pathString = `images/${identifier}-favicon-32x32.png`;

  chrome.browserAction.setIcon({ path: pathString })
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.youtube.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

var toggle = false;

// Add script on page load if toggle is on
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    toggleAutoReplay(toggle)
  }
})

// Toggle icon and replay
chrome.browserAction.onClicked.addListener(function() {
  toggle = !toggle;
  if (toggle) {
    setFavicon('on')
    toggleAutoReplay(true)
  }
  else {
    setFavicon('off')
    toggleAutoReplay(false)
  }
})