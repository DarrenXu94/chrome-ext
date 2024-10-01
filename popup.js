// popup.js

// Get the elements from the DOM
const textarea = document.getElementById("stringsInput");
const saveBtn = document.getElementById("saveBtn");

// Load any saved strings when the popup is opened
chrome.storage.local.get(["myStrings"], function (result) {
  if (result.myStrings) {
    textarea.value = result.myStrings.join("\n"); // Convert array to new line separated string
  }
});

// Save the strings when the button is clicked
saveBtn.addEventListener("click", function () {
  const strings = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean); // Split input by new lines and remove empty lines
  chrome.storage.local.set({ myStrings: strings }, function () {
    console.log("Strings have been saved.");
  });
});
