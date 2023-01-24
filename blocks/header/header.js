import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        // deal with top level dropdowns first
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        // replacing bold nav titles with divs for styling
        if (navSection.querySelector('strong')) {
          const sectionHeading = navSection.querySelector('strong');
          const sectionHeadingNew = document.createElement('div');
          sectionHeadingNew.classList.add('section-heading');
          sectionHeadingNew.textContent = sectionHeading.textContent;
          navSection.replaceChild(sectionHeadingNew, sectionHeading);
        }
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
        // add classes for the lower level descriptions
        navSection.querySelectorAll(':scope > ul > li').forEach((levelTwo) => {
          levelTwo.classList.add('level-two');
        });
        navSection.querySelectorAll(':scope > ul > li > ul > li').forEach((levelThree) => {
          levelThree.classList.add('level-three');
        });
      });
    }

    // add page scroll listener to know when header turns to sticky
    const header = block.parentNode;
    window.addEventListener('scroll', () => {
      const scrollAmount = window.scrollY;
      if (scrollAmount > header.offsetHeight) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    });

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.append(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);
  }
}
