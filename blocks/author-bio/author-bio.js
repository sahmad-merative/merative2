import { createTag, getMetadata } from '../../scripts/scripts.js';
import authorsParser from '../../scripts/authors-parser.js';

export default function decorate(block) {
  const defaultAuthorImageSrc = '../../styles/favicon-thumbnail-merative.svg';
  const defaultAuthor = 'Merative';

  const readtime = getMetadata('readtime');
  let authors = getMetadata('authors');
  const nameField = 'name';
  const titleField = 'title';
  const imageField = 'image';
  const prefix = 'By ';
  const content = [];

  if (!authors) {
    authors = [{
      [nameField]: defaultAuthor,
      [imageField]: defaultAuthorImageSrc,
    }];
  }

  const authorsQuantity = authors.length;
  authors = authorsParser(authors);
  block.innerHTML = authorsQuantity > 1 ? `${prefix}` : '';

  authors.forEach((author) => {
    const authorImageTag = createTag('img', { class: 'author-img' });
    authorImageTag.setAttribute('src', author[imageField] || defaultAuthorImageSrc);
    authorImageTag.setAttribute('alt', 'author-image');
    const authorNameTag = createTag('span', { class: 'author-name' });
    authorNameTag.innerHTML = authorsQuantity === 1 ? `${prefix}` : '';
    const authorNameHighlight = createTag('span', { class: 'author-name-hightlight' });
    authorNameHighlight.innerHTML = author[titleField] ? `${author[nameField]}, ${author[titleField]}` : author[nameField];
    authorNameTag.append(authorNameHighlight);
    content.push(authorImageTag, authorNameTag);
  });
  block.append(...content);

  if (readtime) {
    const pipeTag = createTag('span', { class: 'pipe' });
    pipeTag.innerHTML = '|';
    const readtimeTag = createTag('span', { class: 'readtime' });
    readtimeTag.innerHTML = readtime;
    block.append(pipeTag, readtimeTag);
  }
}
