import {
  getCookie,
  setCookie,
  createStringToHash,
} from '../../scripts/scripts.js';

/**
 * decorates the notification
 * @param {Element} block The notification block element
 */
export default async function decorate(block) {
  const outerDivElement = document.createElement('div');
  outerDivElement.className = 'notification-outer-block';

  const innerDivElement = document.createElement('div');
  innerDivElement.className = 'notification-inner-block';

  const titleDivElement = document.createElement('div');
  titleDivElement.className = 'notification-title-block';

  const firstDivElement = block.querySelector('div');
  const contentDivEle = firstDivElement.lastElementChild;

  titleDivElement.append(contentDivEle.querySelector('strong'));
  innerDivElement.append(titleDivElement);
  innerDivElement.append(contentDivEle);
  outerDivElement.append(innerDivElement);

  const hashCode = createStringToHash(contentDivEle.textContent);
  const notificationHashId = 'notification'.concat(hashCode);
  firstDivElement.className = notificationHashId;
  if (getCookie(notificationHashId) === 'seen') {
    block.style.display = 'none';
  }
  const closeDivElement = document.createElement('div');
  closeDivElement.className = 'notification-close-cross-block';
  closeDivElement.addEventListener('click', () => {
    setCookie(notificationHashId, 'seen');
    block.style.display = 'none';
  });

  const closeElement = document.createElement('img');
  closeElement.className = 'notification-close-cross';
  closeElement.src = '../../icons/x.svg';
  closeElement.alt = 'close cross icon';

  closeDivElement.append(closeElement);
  outerDivElement.append(closeDivElement);
  firstDivElement.append(outerDivElement);
}
