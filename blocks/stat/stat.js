/**
 * decorates the stat
 * @param {Element} block The stat block element
 */
export default async function decorate(block) {
  if (window.screen.width >= 768 && window.screen.width < 1200) {
    const statParent = block.firstElementChild;
    const childLenth = statParent.children.length;
    if (childLenth === 3) {
      [...statParent.children].forEach((ele) => {
        ele.style.maxWidth = 'calc((100%/3) - 16px)';
      });
    } else if (childLenth === 2) {
      [...statParent.children].forEach((ele) => {
        ele.style.maxWidth = 'calc(50% - 12px)';
      });
    } else {
      statParent.classList.add('no-effect');
    }
  }
}
