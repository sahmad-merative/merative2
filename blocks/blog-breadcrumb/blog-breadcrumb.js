import { getMetadata } from '../../scripts/scripts.js';

function openLink(e) {
  let idName = e.target.getAttribute('id');
  let url = null;
  idName = idName.replace('-breadcrumb', '');
  if (idName === 'Merative Blog') { // blog page
    window.open('https://www.merative.com/blog', '_self');
  } else if (idName === document.title) { // current page
    // do nothing
  } else { // category page
    let pathName = idName.replace(/ /g, '-');
    pathName = pathName.toLowerCase();
    url = `https://www.merative.com/blog/${pathName}`;
    window.open(url, '_self');
  }
  e.preventDefault();
}

function isMobile() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
}

function breadCrumbCreation(id, name, ulFlag) {
  let ul = null;
  let linkText = null;
  if (ulFlag) {
    ul = document.createElement('ul');
    ul.classList.add('breadcrumb-navigation');
    ul.setAttribute('id', 'crumbs-list-id');
  } else {
    ul = document.getElementById('crumbs-list-id');
  }
  const li = document.createElement('li');
  const aLink = document.createElement('a');
  if (isMobile() && ulFlag) {
    linkText = document.createTextNode('...');
  } else {
    linkText = document.createTextNode(name);
  }
  const sid = `${name}-breadcrumb`;
  aLink.href = '#';
  aLink.append(linkText);
  aLink.title = name;
  aLink.setAttribute('id', sid);
  aLink.href = '#';
  li.appendChild(aLink);
  ul.appendChild(li);
  document.getElementById(id).append(ul);
  document.getElementById(sid).addEventListener('click', openLink);
}
export default function decorate(block) {
  block.textContent = '';
  block.setAttribute('id', 'breadCrumb-id');
  breadCrumbCreation(block.getAttribute('id'), 'Merative Blog', true);
  breadCrumbCreation(block.getAttribute('id'), getMetadata('category'), false);
  breadCrumbCreation(block.getAttribute('id'), document.title, false);
}
