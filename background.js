chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getStrings") {
    // Get the strings from storage
    chrome.storage.local.get(["myStrings"], function (result) {
      sendResponse({ strings: result.myStrings });
    });
    // Return true to indicate that the response will be asynchronous
    return true;
  }
});
