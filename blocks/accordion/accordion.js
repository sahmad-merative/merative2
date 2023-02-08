import { createTag } from '../../scripts/scripts.js';

const selectors = {
  accordion: 'accordion',
  accordionItem: 'accordion-item',
  accordionItemHeader: 'accordion-item-header',
  accordionItemContent: 'accordion-item-content',
  accordionItemOpen: 'accordion-item-open',
  arrow: 'accordion-arrow-down',
};

const openItem = (item) => {
  const content = item.getElementsByClassName(selectors.accordionItemContent);
  content[0].style.maxHeight = `${content[0].scrollHeight}px`;
  item.classList.add(selectors.accordionItemOpen);
};

const closeItem = (item) => {
  const content = item.getElementsByClassName(selectors.accordionItemContent);
  content[0].style.maxHeight = '0';
  item.classList.remove(selectors.accordionItemOpen);
};

const accordionTypesMap = {
  single: (e) => {
    const item = e.currentTarget.closest(`.${selectors.accordionItem}`);
    const accordionItem = e.currentTarget.closest(`.${selectors.accordion}`);
    const currentOpenItems = accordionItem.getElementsByClassName(selectors.accordionItemOpen);
    const isCurrent = (currentOpenItems.length && item.isSameNode(currentOpenItems[0]));

    if (currentOpenItems.length) {
      closeItem(currentOpenItems[0]);
    }
    if (!isCurrent) openItem(item);
  },
  multiple: (e) => {
    const item = e.currentTarget.closest(`.${selectors.accordionItem}`);
    const isOpen = item.classList.contains(selectors.accordionItemOpen);
    if (!isOpen) openItem(item);
    else closeItem(item);
  },
};

export default function decorate(block) {
  let accordionType = 'single';
  const dataSection = block.closest('[data-accordion-type]');
  if (dataSection) {
    accordionType = dataSection.dataset.accordionType;
  }

  [...block.children].forEach((element) => {
    const arrow = createTag('div', { class: selectors.arrow });
    element.classList.add('accordion-item');
    element.append(arrow);
    element.firstElementChild.classList.add(selectors.accordionItemHeader);
    element.firstElementChild.addEventListener('click', accordionTypesMap[accordionType]);
    element.firstElementChild.append(arrow);
    element.lastElementChild.classList.add(selectors.accordionItemContent);
  });
}
