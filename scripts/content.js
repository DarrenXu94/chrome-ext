// const spoilerChannels = ["Serie A", "NFL", "LALIGA"];
const spoilerChannels = [];

const scoreRegex = /\d{1,2}\s*-\s*\d{1,2}/; // Any string that is a score eg 0 - 1

// Handle in youtube search mode
const handleVideoRenderer = (videoRenderer) => {
  const channelName =
    videoRenderer.querySelector("ytd-channel-name").textContent;

  // if channel name includes any string from spoilerChannels array hide the thumbnail
  if (spoilerChannels.some((channel) => channelName.includes(channel))) {
    const coreImage = videoRenderer.querySelector("img.yt-core-image");
    coreImage.style.display = "none";
  }

  // check if the title contains a score
  const title = videoRenderer.querySelector("#video-title");

  if (!title) return;

  const titleTextContent = title.textContent;

  if (scoreRegex.test(titleTextContent)) {
    const titleElement = videoRenderer.querySelector("#video-title");
    const newTitle = titleElement.textContent.replace(scoreRegex, "X - X");
    titleElement.textContent = newTitle;
  }
};

// Handle in youtube home page mode
const handleRichGridMedia = (gridMedia) => {
  const channelName = gridMedia.querySelector(".ytd-channel-name").textContent;

  // if channel name includes any string from spoilerChannels array hide the thumbnail
  console.log("spiler channels", spoilerChannels);
  if (spoilerChannels.some((channel) => channelName.includes(channel))) {
    const coreImage = gridMedia.querySelector("img.yt-core-image");
    coreImage.style.display = "none";

    // check if the title contains a score
  }
  const title = gridMedia.querySelector("#video-title-link").textContent;
  if (scoreRegex.test(title)) {
    const titleElement = gridMedia.querySelector("#video-title-link");
    const newTitle = titleElement.textContent.replace(scoreRegex, "X - X");
    titleElement.textContent = newTitle;
  }
};

chrome.runtime.sendMessage({ action: "getStrings" }, function (response) {
  if (response && response.strings) {
    // Do something with the strings in the content script
    response.strings.forEach((string) => {
      spoilerChannels.push(string);
    });
  }
});

function run() {
  console.log("Script running");

  const thumbnails = document.querySelectorAll("ytd-thumbnail");

  for (let i = 0; i < thumbnails.length; i++) {
    const gridMedia = thumbnails[i].closest("ytd-rich-grid-media");

    if (gridMedia) {
      handleRichGridMedia(gridMedia);
    }

    const videoRenderer = thumbnails[i].closest("ytd-video-renderer");

    if (videoRenderer) {
      handleVideoRenderer(videoRenderer);
    }
  }
}

// window.onload = run;
// window.addEventListener("yt-navigate-start", run, true);

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const targetNode = document.querySelector("#contents"); // Element containing the suggested videos
const config = { childList: true, subtree: true };

const debouncedRun = debounce(() => run(), 500);

const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      // console.log("New video suggestions detected!");
      debouncedRun();
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
