import { lookupDocuments, createDocumentCard } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const pathnames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  block.textContent = '';
  // Make a call to the document index and get the json for just the pathnames the author has put in
  const pageList = await lookupDocuments(pathnames);
  if (pageList.length) {
    pageList.forEach(async (row) => {
      block.append(await createDocumentCard(row, 'document-card'));
    });
  } else {
    block.remove();
  }
}
