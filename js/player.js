let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    width: "660",
    height: "405",
    videoId: "zmg_jOwa9Fc",
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  const duration = player.getDuration();
  let interval;
  updateTimerDisplay();

  $(".player").removeClass("hidden");

  clearInterval(interval);

  interval = setInterval(() => {
    const completed = player.getCurrentTime();
    const percents = (completed / duration) * 100;

    changeButtonPosition(percents);

    updateTimerDisplay();
  }, 1000);
}

function onPlayerStateChange(event) {
  const playerButton = $(".player__start");
  switch (event.data) {
    case 1:
      $(".player__wrapper").addClass("active");
      playerButton.addClass("paused");
      break;
    case 2: 
      playerButton.removeClass("paused");
      break;
  }
}

$(".player__start").on("click", e => {
  const playerStatus = player.getPlayerState(); // 0 - ended, 1 - played, 2 - paused ...

  if (playerStatus !== 1) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
});


$(".player__playback").on("click", e => {
  e.preventDefault();
  const bar = $(e.currentTarget);
  const newButtonPosition = e.pageX - bar.offset().left;
  const clickedPercents = (newButtonPosition / bar.width()) * 100;
  const newPlayerTime = (player.getDuration() / 100) * clickedPercents;

  changeButtonPosition(clickedPercents);
  player.seekTo(newPlayerTime);
});

$(".player__splash").on("click", e => {
  player.playVideo();
});

function changeButtonPosition(percents) {
  $(".player__playback-button").css({
    left: `${percents}%`
  });
}

function updateTimerDisplay() {
  $(".player__duration-completed").text(formatTime(player.getCurrentTime()));
  $(".player__duration-estimate").text(formatTime(player.getDuration()));
}

function formatTime(time) {
  const roundTime = Math.round(time);

  const minutes = Math.floor(roundTime / 60);
  const seconds = roundTime - minutes * 60;
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return minutes + ":" + formatedSeconds;
}
