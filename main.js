import { formatDisplayTime } from "./helpers.js";

const VIDEO_SRC =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const PLAY_ICON = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-478"></use><path class="svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-478"></path></svg>`;

const PAUSE_ICON = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-522"></use><path class="svg-fill" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-522"></path></svg>`;

const createVideoPlayer = () => {
  let videoElement;
  let playPauseBtn;
  let currentTime;
  let duration;
  let progressPlayed;
  let progressContainer;
  let buffer;

  const setup = () => {
    const playerContainer = document.createElement("div");
    playerContainer.classList.add("player");

    const playerTemplate = `
    <video id="video-source"></video>
    <div class="controls">
        <div class="controls-bg-gradient"></div>
        <div class="progress">
           <div class="progress-padding"></div>
           <div class="progress-bar">
            <div class="progress-buffer"></div>
            <div class="progress-played"></div>
           </div>
        </div>
        

        <div class="controls-bottom">
            <div class="bottom-left">
                <button class="controls-btn btn__play-pause">
                ${PLAY_ICON}</button>
                <div class="display-time">
                    <div class="current-time">0:00</div>
                    <span>/</span>
                    <div class="duration">0:00</div>
                </div>
            </div>
            <div class="bottom-right">
            </div>
        </div>
    </div>
    `;

    /**
     * Contruct UI dom
     */
    playerContainer.innerHTML = playerTemplate;
    videoElement = playerContainer.querySelector("video");
    playPauseBtn = playerContainer.querySelector(".btn__play-pause");
    currentTime = playerContainer.querySelector(".current-time");
    duration = playerContainer.querySelector(".duration");
    progressPlayed = playerContainer.querySelector(".progress-played");
    progressContainer = playerContainer.querySelector(".progress");
    buffer = playerContainer.querySelector(".progress-buffer");

    videoElement.src = VIDEO_SRC;
    videoElement.controls = false;
    videoElement.autoplay = true;
    videoElement.muted = true;

    document.body.appendChild(playerContainer);
  };

  setup();

  const onPlayPause = () => {
    // Agar video pauza bo'lgan bo'lsa, play qil
    // Aks holda pauza qil
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const onPause = () => {
    playPauseBtn.innerHTML = PLAY_ICON;
  };

  const onPlay = () => {
    playPauseBtn.innerHTML = PAUSE_ICON;
  };

  const updateProgressUI = (targetCurrentTime, immediate) => {
    const presentationCurrentTime = formatDisplayTime(targetCurrentTime);

    const progressPercent = (targetCurrentTime / videoElement.duration) * 100;

    progressPlayed.style.width = progressPercent + "%";

    if (immediate || currentTime.textContent !== presentationCurrentTime) {
      currentTime.textContent = presentationCurrentTime;
    }
  };

  const updateBufferUI = () => {
    const timeRanges = videoElement.buffered;
    let bufferMax = 0;

    for (let i = 0; i < timeRanges.length; i++) {
      if (bufferMax < timeRanges.end(i)) {
        bufferMax = timeRanges.end(i);
      }
    }

    const totalPercent = (bufferMax / videoElement.duration) * 100;

    buffer.style.width = totalPercent + "%";
  };

  const onTimeUpdate = () => {
    updateBufferUI();
    updateProgressUI(videoElement.currentTime);
  };

  const onDurationChange = () => {
    const presentationDuration = formatDisplayTime(videoElement.duration);

    duration.textContent = presentationDuration;
  };

  const onSeek = ({ clientX }) => {
    const { x, width } = progressContainer.getBoundingClientRect();
    const seekedCoordinate = (clientX - x) / width; // Value from 0-1

    const seekValue = seekedCoordinate * videoElement.duration;

    videoElement.currentTime = seekValue;
    updateProgressUI(seekValue, true);
  };

  videoElement.addEventListener("pause", onPause);
  videoElement.addEventListener("play", onPlay);
  videoElement.addEventListener("timeupdate", onTimeUpdate);
  videoElement.addEventListener("durationchange", onDurationChange);

  playPauseBtn.addEventListener("click", onPlayPause);
  progressContainer.addEventListener("click", onSeek);
};

createVideoPlayer();
