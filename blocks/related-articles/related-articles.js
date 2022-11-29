import { lookupBlogs } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function createCard(row, style) {
  const card = document.createElement('div');
  if (style) card.classList.add(style);

  const link = document.createElement('a');
  link.classList.add('blog-link');
  link.href = row.path;
  if (row.title) card.innerHTML += `<h6>${row.title}</h6>`;
  if (row.description) card.innerHTML += `<p>${row.description}</p>`;
  card.append(link);
  if (row.image && row.title) card.prepend(createOptimizedPicture(row.image, row.title));
  const author = document.createElement('div');
  author.classList.add('article-author');
  if(row.author && row.readTime) author.innerHTML += `By ${row.author} | ${row.readTime}`;
  card.append(author);
  if(row.category) card.append(row.category);
  return (card);
}

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  block.textContent = '';
  const pageList = await lookupBlogs(pathnames);
  if (pageList.length) {
    pageList.forEach((row) => {
      block.append(createCard(row, 'blog-card'));
    });
  } else {
    block.remove();
  }
}