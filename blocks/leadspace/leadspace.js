/**
 * Leadspace block
 *
 */

export default function decorate(block) {
  const col1 = block.firstElementChild?.children.item(0);
  const col2 = block.firstElementChild?.children.item(1);
  const hasVideo = block.classList.contains('video');

  // decorate video
  if (hasVideo) {
    // video lead space blocks are a special case that do not follow normal processing rules
    if (col1) {
      // watch video button
      const videoLink = col1.querySelector('p > strong > a');
      const videoDuration = col1.querySelector('p:last-of-type');

      const watchBtn = document.createElement('button');
      watchBtn.setAttribute('type', 'button');
      watchBtn.setAttribute('aria-label', 'Play video');
      watchBtn.innerHTML = `<span><span>${videoLink.textContent}</span><span>${videoDuration.textContent}</span></span><span></span>`;
      const btnContent = watchBtn.querySelector('span:nth-child(1)');
      btnContent.classList.add('video-button-content');
      btnContent.querySelector('span:nth-child(1)').classList.add('video-button-title');
      btnContent.querySelector('span:nth-child(2)').classList.add('video-button-duration');
      watchBtn.querySelector(':scope > span:nth-child(2)').classList.add('video-button-icon');

      watchBtn.addEventListener('click', () => {
        alert('I was clicked!');
      })

      col1.removeChild(videoLink.parentElement.parentElement);
      col1.removeChild(videoDuration);

      col1.appendChild(watchBtn);
    }

    if (col2) {
      // preview link
      const previewLink = col2.querySelector('a');
      const video = document.createElement('div');
      video.classList.add('video-wrapper');
      video.innerHTML = `<video autoplay controls muted playsinline loop preload="auto">
        <source src="${previewLink.href}" type="video/mp4">
        </video>`;
      col2.replaceChild(video, previewLink);
    }
    return;
  }

  // Default (aka non-video) processing

  if (col1) {
    // group buttons
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');

    const buttons = [...col1.querySelectorAll('.button-container')] || [];

    buttons.forEach((button) => {
      const isPrimary = button.querySelector('strong');
      const isSecondary = button.querySelector('em');
      // position button
      if (isPrimary) {
        button.style.order = '1';
      } else if (isSecondary) {
        button.style.order = '2';
      } else {
        button.style.order = '3';
      }
      buttonGroup.append(button);
    });

    if (buttonGroup.children.length) {
      col1.append(buttonGroup);
    }

    // group events
    const eventItems = [...col1.querySelectorAll('.leadspace.event p:not(.button-container) > em')] || [];

    const eventGroup = document.createElement('div');
    eventGroup.classList.add('event-group');

    eventItems.forEach((item, index) => {
      item.parentElement?.classList.add('event-item', index === 0 ? 'location' : 'date');
      eventGroup.appendChild(item.parentElement);
    });
    if (eventGroup.children.length) {
      col1.append(eventGroup);
    }
  }

}