let player;
const videoUrlInput = document.getElementById('videoUrl');
const loadBtn = document.getElementById('loadBtn');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('status');

// Функция вытягивает ID видео из разных типов ссылок YouTube
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Эта функция вызывается автоматически, когда API YouTube готово
function onYouTubeIframeAPIReady() {
  loadBtn.addEventListener('click', () => {
    const url = videoUrlInput.value;
    const videoId = extractVideoId(url);

    if (videoId) {
      statusText.textContent = "Загрузка трека...";
      initPlayer(videoId);
    } else {
      alert("Пожалуйста, введите корректную ссылку на YouTube");
    }
  });
}

function initPlayer(videoId) {
  // Если плеер уже был создан, просто меняем видео
  if (player && typeof player.loadVideoById === 'function') {
    player.loadVideoById(videoId);
    return;
  }

  // Инициализируем плеер
  player = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: videoId,
    playerVars: {
      'playsinline': 1, // Важно для мобилок, чтобы не открывалось во весь экран
      'controls': 0,
      'disablekb': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

function onPlayerReady(event) {
  statusText.textContent = "Готово к воспроизведению";
  playBtn.disabled = false;
  pauseBtn.disabled = false;
  event.target.playVideo(); // Пробуем запустить автоплей
}

function onPlayerStateChange(event) {
  // YT.PlayerState.PLAYING === 1, PAUSED === 2
  if (event.data === YT.PlayerState.PLAYING) {
    statusText.textContent = "Воспроизведение звука...";
  } else if (event.data === YT.PlayerState.PAUSED) {
    statusText.textContent = "Пауза";
  } else if (event.data === YT.PlayerState.BUFFERING) {
    statusText.textContent = "Буферизация...";
  }
}

function onPlayerError(event) {
  statusText.textContent = "Ошибка воспроизведения (возможно, запрещено автором)";
  console.error("Ошибка YT:", event.data);
}

// Навешиваем события на кастомные кнопки
playBtn.addEventListener('click', () => player && player.playVideo());
pauseBtn.addEventListener('click', () => player && player.pauseVideo());