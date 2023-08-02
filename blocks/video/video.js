import { createTag } from '../../scripts/scripts.js';

const selectors = Object.freeze({
  videoModal: '.video-modal',
  videoContent: '.video-modal-content',
});

const videoTypeMap = Object.freeze({
  youtube: [/youtube\.com/, /youtu\.be/],
  external: [/vimeo\.com/],
});

const getVideoType = (href) => {
  const videoEntry = Object.entries(videoTypeMap).find(
    ([, allowedUrls]) => allowedUrls.some((urlToCompare) => urlToCompare.test(href)),
  );
  if (videoEntry) {
    return videoEntry[0];
  }
  return undefined;
};

const getYouTubeId = (href) => {
  const ytExp = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
  const match = href.match(ytExp);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
};

let player;
const loadYouTubePlayer = (element, videoId) => {
  // The API will call this function when the video player is ready.
  const onPlayerReady = (event) => {
    event.target.playVideo();
  };
  // onYouTubeIframeAPIReady will load the video after the script is loaded
  window.onYouTubeIframeAPIReady(
    // eslint-disable-next-line no-new
    player = new window.YT.Player(element, {
      videoId,
      playerVars: {
        start: 0, // Always start from the beginning
      },
      events: {
        onReady: onPlayerReady,
      },
    }),
  );
};

const toggleVideoOverlay = (block) => {
  const modal = block.querySelector(selectors.videoModal);
  const videoContent = modal.querySelector(selectors.videoContent);
  const videoType = videoContent.getAttribute('data-videoType');
  const videoId = videoContent.getAttribute('data-videoId');

  if (modal?.classList?.contains('open')) {
    modal.classList.remove('open');
    if (videoType === 'youtube') {
      player.stopVideo();
      // Destroy the iframe when the video is closed.
      const iFrame = document.getElementById(`ytFrame-${videoId}`);
      if (iFrame) {
        const container = iFrame.parentElement;
        container.removeChild(iFrame);
      }
    } else {
      modal.querySelector('video')?.pause();
      modal.querySelector('video').currentTime = 0;
    }
  } else {
    modal.classList.add('open');
    if (videoType === 'youtube') {
      // Create a YouTube compatible iFrame
      videoContent.innerHTML = `<div id="ytFrame-${videoId}"></div>`;
      loadYouTubePlayer(`ytFrame-${videoId}`, videoId);
    } else {
      modal.querySelector('video')?.play();
    }
  }
};

const decorateVideoLink = (link, videoType, label = 'Play') => {
  let playBtn = link;
  if (videoType !== 'external') {
    playBtn = createTag(
      'button',
      { class: 'open-video', type: 'button', 'aria-label': 'Play video' },
    );
    link.parentElement.appendChild(playBtn);
    link.parentElement.removeChild(link);
  } else {
    link.setAttribute('target', '_blank');
    link.classList.add('open-video');
  }

  playBtn.innerHTML = `<span>${label}</span>`;
  return playBtn;
};

const buildVideoModal = (href, videoType) => {
  const videoModal = createTag('div', { class: 'video-modal', 'aria-modal': 'true', role: 'dialog' });
  const videoOverlay = createTag('div', { class: 'video-modal-overlay' });
  const videoContainer = createTag('div', { class: 'video-modal-container' });

  const videoHeader = createTag('div', { class: 'video-modal-header' });
  const videoClose = createTag('button', { class: 'video-modal-close', 'aria-label': 'close' });
  videoHeader.appendChild(videoClose);
  videoContainer.appendChild(videoHeader);

  const videoContent = createTag('div', { class: 'video-modal-content' });
  if (videoType === 'youtube') {
    const videoId = getYouTubeId(href);
    videoContent.dataset.ytid = videoId;
    videoContent.setAttribute('data-videoType', 'youtube');
    videoContent.setAttribute('data-videoId', videoId);
  } else {
    videoContent.innerHTML = `<video controls playsinline loop preload="auto">
        <source src="${href}" type="video/mp4" />
        "Your browser does not support videos"
        </video>`;
  }
  videoContainer.appendChild(videoContent);

  videoModal.appendChild(videoOverlay);
  videoModal.appendChild(videoContainer);

  return videoModal;
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];

  if (cols.length === 1) {
    //  clean up paragraphs from single column variant
    const [firstCol] = cols;
    const paragraphs = firstCol.querySelectorAll(':scope > p');
    [...paragraphs].forEach((elem) => {
      while (elem.firstChild) {
        firstCol.insertBefore(elem.firstChild, elem);
      }
      firstCol.removeChild(elem);
    });
  }

  // decorate text container
  const heading = block.querySelector('h2');
  if (heading) {
    heading.closest('div').classList.add('video-text');
  }

  // decorate picture container
  const picture = block.querySelector('picture');
  if (picture) {
    const pictureContainer = picture.closest('div');
    pictureContainer.classList.add('video-image');
    pictureContainer.appendChild(picture);
  }

  // decorate video link
  const videoLink = block.querySelector('a');
  let videoHref;
  if (videoLink) {
    videoHref = videoLink.href;
    const videoType = getVideoType(videoHref);
    const playButton = decorateVideoLink(videoLink, videoType, 'Play');
    if (videoType !== 'external') {
      const videoModal = buildVideoModal(videoHref, videoType);
      const videoClose = videoModal.querySelector('button.video-modal-close');
      videoClose.addEventListener('click', () => toggleVideoOverlay(block));
      block.append(videoModal);

      // Display video overlay when play button is pressed
      playButton.addEventListener('click', () => toggleVideoOverlay(block));
    }
  }

  // Check if the div is the first element of its parent
  const divElement = block.querySelector('.video-text');
  if (!divElement.previousElementSibling) {
    divElement.classList.add('text-left');
  }
}
