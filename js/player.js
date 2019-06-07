let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "405",
    width: "660",
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

function onPlayerStateChange(event) {
  const playerButton = $('.player__start');
  
  switch(event.data) {
    case 1:
      $('.player__wrapper').addClass('active');
      playerButton.addClass('paused');
      break;
    case 2 :
      playerButton.removeClass('paused');
      break;
  }
}

function onPlayerReady() {
  const durationInSeconds = player.getDuration();
  let interval;

  clearInterval(interval);

  interval = setInterval(() => {
    const compleatedSeconds = player.getCurrentTime();
    const percent = (compleatedSeconds / durationInSeconds) * 100;

    $('.player__playback-button').css({
      left: `${percent}%`
    });

    $(".player__duration-completed").text(formatTime(compleatedSeconds));
  }, 1000);

  $(".player__duration-estimate").text(formatTime(durationInSeconds));
}

function formatTime(time) {
  const roundTime = Math.round(time);

  const minutes = Math.floor(roundTime / 60);
  const seconds = roundTime - minutes * 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
}

$(".player__start").on("click", e => {
  const btn = $(e.currentTarget);

  if (btn.hasClass("paused")) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

$('.player__playback').on('click', e => {
  e.preventDefault();

  const bar = $(e.currentTarget);
  const newButtonPosition = e.pageX - bar.offset().left;
  const clickedPercent = (newButtonPosition / bar.width()) * 100;
  const newPlayerTime = (player.getDuration() / 100) * clickedPercent;

  $('.player__playback-button').css({
    left: `${clickedPercent}%`
  })

  player.seekTo(newPlayerTime);
})

$('.player__splash').on('click', e => {
  player.playVideo();
});