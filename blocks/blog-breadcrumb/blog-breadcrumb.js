import { getMetadata, getBlogCategoryPages } from '../../scripts/scripts.js';

const MOBILE_WIDTH = 768;

function createLink(href, linkText, linkTitle) {
  const aLink = document.createElement('a');
  aLink.append(linkText);
  aLink.title = linkTitle;
  aLink.href = href;
  return aLink;
}

function changeHomeText() {
  const homeLink = document.querySelector('.blog-breadcrumb li.home a');
  if (homeLink) {
    homeLink.innerHTML = '';
    if (window.innerWidth >= MOBILE_WIDTH) {
      homeLink.append('Merative Blog');
    } else {
      homeLink.append('...');
    }
  }
}

export default async function decorate(block) {
  block.textContent = '';
  // block.setAttribute('id', 'breadCrumb-id');
  const ul = document.createElement('ul');
  ul.classList.add('breadcrumb-navigation');

  // Create Home link
  const liHome = document.createElement('li');
  liHome.classList.add('home');
  if (window.innerWidth >= MOBILE_WIDTH) {
    liHome.append(createLink('/blog', 'Merative Blog', 'Merative Blog'));
  } else {
    liHome.append(createLink('/blog', '...', 'Merative Blog'));
  }

  // Create Category link
  const liCategory = document.createElement('li');
  liCategory.classList.add('category');
  const categoryName = getMetadata('category');
  const categoryBlogPages = await getBlogCategoryPages();
  categoryBlogPages.forEach((row) => {
    if ((row.path !== '0') && (row.title === categoryName)) {
      liCategory.append(createLink(row.path, categoryName, categoryName));
    }
  });
  ul.append(liHome);
  ul.append(liCategory);
  block.append(ul);
  window.addEventListener('resize', changeHomeText);
}
