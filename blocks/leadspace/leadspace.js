/**
 * Leadspace block
 *
 */

export default function decorate(block) {
  const firstCol = block.firstElementChild?.children.item(0);

  // group buttons
  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');

  const buttons = [...block.querySelectorAll('.button-container')] || [];

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

  if (firstCol && buttonGroup.children.length) {
    firstCol.append(buttonGroup);
  }

  // group events
  const eventItems = [...block.querySelectorAll('.leadspace.event p:not(.button-container) > em')] || [];

  const eventGroup = document.createElement('div');
  eventGroup.classList.add('event-group');

  eventItems.forEach((item, index) => {
    item.parentElement?.classList.add('event-item', index === 0 ? 'location' : 'date');
    eventGroup.appendChild(item.parentElement);
  });

  if (firstCol && eventGroup.children.length) {
    firstCol.append(eventGroup);
  }
}
