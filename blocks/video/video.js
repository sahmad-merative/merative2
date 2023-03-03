import { createTag } from '../../scripts/scripts.js';

const toggleVideoOverlay = (block) => {
  const modal = block.querySelector('.video-modal');
  if (modal?.classList.contains('open')) {
    modal.classList.remove('open');
    modal.querySelector('video').pause();
  } else {
    modal.classList.add('open');
    modal.querySelector('video').play();
  }
};

const decorateVideoLink = (link, label = 'Play') => {
  let playBtn = link;
  if (link.href.indexOf('vimeo.com') === -1) {
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

const buildVideoModal = (href) => {
  const videoModal = createTag('div', { class: 'video-modal', 'aria-modal': 'true', role: 'dialog' });
  const videoOverlay = createTag('div', { class: 'video-modal-overlay' });
  const videoContainer = createTag('div', { class: 'video-modal-container' });

  const videoHeader = createTag('div', { class: 'video-modal-header' });
  const videoClose = createTag('button', { class: 'video-modal-close', 'aria-label': 'close' });

  const videoContent = createTag('div', { class: 'video-modal-content' });
  videoContent.innerHTML = `<video controls playsinline loop preload="auto">
        <source src="${href}" type="video/mp4" />
        "Your browser does not support videos"
        </video>`;

  videoHeader.appendChild(videoClose);
  videoContainer.appendChild(videoHeader);
  videoContainer.appendChild(videoContent);
  videoModal.appendChild(videoOverlay);
  videoModal.appendChild(videoContainer);

  return videoModal;
};

export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (picture) {
    picture.closest('div').classList.add('video-image');
  }
  const heading = block.querySelector('h2');
  if (heading) {
    heading.closest('div').classList.add('video-text');
  }
  const videoLink = block.querySelector('a');
  let videoHref;
  if (videoLink) {
    videoHref = videoLink.href;

    const button = decorateVideoLink(videoLink, 'Play');
    if (videoHref.indexOf('vimeo.com') === -1) {
      // Display video overlay
      button.addEventListener('click', () => toggleVideoOverlay(block));
    }
  }

  // add video overlay
  if (videoHref) {
    const videoModal = buildVideoModal(videoHref);
    const videoClose = videoModal.querySelector('button.video-modal-close');
    videoClose.addEventListener('click', () => toggleVideoOverlay(block));
    block.append(videoModal);
  }
}
