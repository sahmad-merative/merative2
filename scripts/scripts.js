import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  createOptimizedPicture,
} from './lib-franklin.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function buildCtaBlock(main) {
  main.querySelectorAll(':scope > div').forEach((div) => {
    const h2 = div.querySelector('div > h2');
    const p = div.querySelector('div > p');
    const pa = div.querySelector('p > a');
    const numChildren = div.children.length;

    // simple CTA - no inner text and H2 positioned before a link
    if (h2 && p && pa && (h2.compareDocumentPosition(pa) === 4)
           && (numChildren === 2)) {
      div.classList.add('cta');
    }

    // CTA with inner text -  H2 then text then a link
    if (h2 && p && pa && (h2.compareDocumentPosition(p) === 4)
           && (p.compareDocumentPosition(pa) === 4)
           && (h2.compareDocumentPosition(pa) === 4)
           && (numChildren === 3)) {
      div.classList.add('cta');
    }
  });
}

function buildBackToTopBlock(main) {
  const element = document.createElement('div');
  element.classList.add('back-to-top');
  main.append(element);

  const backToTop = main.querySelector(':scope > div.back-to-top');
  // add scroll listener
  window.addEventListener('scroll', () => {
    const scrollAmount = window.scrollY;
    if (scrollAmount > 100) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  });

  // add click listener
  backToTop.addEventListener('click', () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });
}
// auto block build for social media share as left nav
function buildSocialIconBlock(main) {
  const isBlogPage = /(\/blog\/.*)/.test(window.location.pathname);
  if (isBlogPage) {
    const blogLeftNav = document.createElement('div');
    blogLeftNav.classList.add('blog-left-nav');
    blogLeftNav.append(buildBlock('blog-left-nav', {
      elems: [],
    }));
    main.children[0].setAttribute('id', 'blog-right-nav');
    main.prepend(blogLeftNav);
  }
}

/**
 * Helper function to create DOM elements
 * @param {string} tag DOM element to be created
 * @param {array} attributes attributes to be added
 */

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement || html instanceof SVGElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

/**
 * Retrieves the content of a metadata tag.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const $meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return $meta && $meta.content;
}

function buildTags(main) {
  const tagsElement = document.createElement('div');
  const category = getMetadata('category');
  tagsElement.classList.add('tags');
  if (category) {
    tagsElement.append(buildBlock('tags', { elems: [] }));
    const firstH2 = main.querySelector('h2:first-of-type');
    const p = main.querySelector('p:first-of-type');
    // eslint-disable-next-line no-bitwise
    if (firstH2 && p && (firstH2.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      firstH2.after(tagsElement);
    }
  }
}

function buildPageDivider(main) {
  const allPageDivider = main.querySelectorAll('code');

  allPageDivider.forEach((el) => {
    const alt = el.innerText.trim();
    const lower = alt.toLowerCase();
    if (lower === 'divider') {
      el.innerText = '';
      el.classList.add('divider');
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildCtaBlock(main);
    buildBackToTopBlock(main);
    buildSocialIconBlock(main);
    buildTags(main);
    buildPageDivider(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Gets details about pages that are indexed
 * @param {Array} pathnames list of pathnames
 */

export async function lookupPages(pathnames) {
  if (!window.pageIndex) {
    const resp = await fetch(`${window.hlx.codeBasePath}/query-index.json`);
    const json = await resp.json();
    const lookup = {};
    json.data.forEach((row) => {
      lookup[row.path] = row;
      if (row.image || row.image.startsWith('/default-meta-image.png')) row.image = `/${window.hlx.codeBasePath}${row.image}`;
    });
    window.pageIndex = { data: json.data, lookup };
  }
  const result = pathnames.map((path) => window.pageIndex.lookup[path]).filter((e) => e);
  return (result);
}

/**
 * Gets details about blogs that are indexed
 * @param {Array} pathnames list of pathnames
 */

export async function lookupBlogs(pathnames) {
  if (!window.blogIndex) {
    const resp = await fetch(`${window.hlx.codeBasePath}/blog-index.json`);
    const json = await resp.json();
    const lookup = {};
    json.data.forEach((row) => {
      lookup[row.path] = row;
      if (row.image || row.image.startsWith('/default-meta-image.png')) row.image = `/${window.hlx.codeBasePath}${row.image}`;
    });
    window.blogIndex = { data: json.data, lookup };
  }
  const result = pathnames.map((path) => window.blogIndex.lookup[path]).filter((e) => e);
  return (result);
}

/**
 * Creates a Card using a JSON object and style associated with the card
 * @param {Object} row JSON Object typically coming from an index array item
 * @param {String} style Class name that needs to be added to the card root div
 */

export async function createCard(row, style) {
  // Create card div
  const card = document.createElement('div');
  if (style) card.classList.add(style);

  // Add the image to the card first
  if (row.image !== '0' && row.title !== '0') {
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardImage.append(createOptimizedPicture(row.image, row.title));
    card.prepend(cardImage);
  }

  // Create a separate child div for the card content
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  // Create and add the link, title, author, readtime and category to card content and card
  const link = document.createElement('a');
  link.classList.add('blog-link');
  link.href = row.path;
  if (row.title) link.innerHTML += `${row.title}`;
  cardContent.append(link);
  if (row.description && row.description !== '0') cardContent.innerHTML += `<p>${row.description}</p>`;
  const author = document.createElement('div');
  author.classList.add('blog-author');
  if (row.author && row.author !== '0') author.innerHTML += `By ${row.author}`;
  if (row.readtime && row.readtime !== '0') author.innerHTML += ` | ${row.readtime}`;
  cardContent.append(author);
  const category = document.createElement('div');
  category.classList.add('blog-category');
  if (row.category && row.category !== '0') category.innerHTML += row.category;
  cardContent.append(category);

  card.append(cardContent);
  return (card);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
