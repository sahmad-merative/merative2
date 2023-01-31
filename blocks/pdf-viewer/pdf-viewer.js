import { getMetadata, createTag } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const docUrl = getMetadata('document-link');
  if (docUrl) {
    const docDiv = createTag('div', { id: 'adobe-dc-view' });
    block.textContent = '';
    block.append(docDiv);
  }
}
