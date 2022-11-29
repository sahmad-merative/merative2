import { lookupBlogs } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function createCard(row, style) {
  // Create card div
  const card = document.createElement('div');
  if (style) card.classList.add(style);
  // Add the image to the card first
  if (row.image && row.title) card.prepend(createOptimizedPicture(row.image, row.title));
  // Create a separate child div for the card content
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');
  // Create and add the link, title, author, readtime and category to card content and card
  const link = document.createElement('a');
  link.classList.add('blog-link');
  link.href = row.path;
  if (row.title) link.innerHTML += `<h5>${row.title}</h5>`;
  cardContent.append(link);
  if (row.description) cardContent.innerHTML += `<p>${row.description}</p>`;
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

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  block.textContent = '';
  // Make a call to the blog index and get the json for just the pathnames the author has put in
  const pageList = await lookupBlogs(pathnames);
  if (pageList.length) {
    pageList.forEach((row) => {
      block.append(createCard(row, 'blog-card'));
    });
  } else {
    block.remove();
  }
}
