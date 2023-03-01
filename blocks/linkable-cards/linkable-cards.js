export default function decorate(block) {
  let html = '';

  [...block.children].forEach((element) => {
    const content = element.children[0].innerHTML;
    const lastColumn = element.children[element.children.length - 1];
    const link = lastColumn.querySelectorAll('a')[0].getAttribute('href');
    html += `<div><a href="${link}">${content}</a></div>`;
    block.innerHTML = html;
  });
}
