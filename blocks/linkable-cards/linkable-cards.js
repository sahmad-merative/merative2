export default async function decorate(block) {
  let html = '';
  if ([...block.children].length > 0) {
    [...block.children].forEach((element) => {
        const content = element.children[0].innerHTML;
        const lastColumn = element.children[element.children.length - 1];
        const link = lastColumn.querySelectorAll('a')[0].getAttribute('href');
        html += `<div><a href="${link}">${content}</a></div>`;
        block.innerHTML = html;
    });
  } else { // fetchign documents and populating top 3 cards.
    const resp = await fetch(`${window.hlx.codeBasePath}/documents/query-index.json`);
    const json = await resp.json();
    [...json.data].forEach((element, index) => {
      if(index < 3) {
        html += `<div><a href="e${element.path}"><p>${element.parent}</p>
        <h3 id="for-contract-research-organizations">${element.title}</h3>
        <p>${element.description}</p></a></div>`;
        block.innerHTML = html;
      }
    });
  }
}
