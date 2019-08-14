function autoReplay() {
  var playButton = document.querySelector(".ytp-play-button");
  if (playButton && playButton.title === 'Replay') {
    var event = new Event("click");
    playButton.dispatchEvent(event)
  }
}