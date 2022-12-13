function openLink(e) {
  const idName = e.target.getAttribute('id');
  let url = null;
  const currentUrl = window.location.href;
  if (idName !== null) {
    if (idName.includes('linkedIn')) {
      url = `https://www.linkedin.com/sharing/share-offsite/?url= ${currentUrl}`;
      window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
    } else if (idName.includes('twitter')) {
      url = `https://twitter.com/share?url= ${currentUrl}`;
      window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
    } else if (idName.includes('facebook')) {
      url = `https://www.facebook.com/sharer/sharer.php?u= ${currentUrl}`;
      window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
    } else if (idName.includes('shareLink')) {
      navigator.clipboard.writeText(window.location.href);
    }
  }
  e.preventDefault();
}

const sections = new Array();

function anchorTagLinkCreation(contentLinkId, contentLink) {
  const aLink = document.createElement('a');
  const linkText = document.createTextNode(contentLink);
  aLink.append(linkText);
  aLink.classList.add('content_link');
  aLink.href = `#${contentLinkId}`;
  document.getElementById('blog-content-link').append(aLink);
  document.getElementsByClassName('content_link')[0].classList.add('active');
  document.getElementById(contentLinkId).classList.add('scrollMargin');
  sections.push(document.getElementById(contentLinkId));
  window.addEventListener('scroll', () => {
    const scrollAmount = window.scrollY;
    sections.forEach((element) => {
      if (scrollAmount >= ((element.offsetTop) - 130)) {
        let idName = element.getAttribute('id');
        idName = idName.replace('-leftnav', '');
        if (idName == contentLinkId) {
          aLink.classList.add('active');
        } else {
          aLink.classList.remove('active');
        }

      }
    });

  });

}

function anchorTagSocialMediaCreation(scoialMedia, block) {
  const clsName = `social-share-${scoialMedia}`;
  const sid = `social_share_link${scoialMedia}`;
  const aLink = document.createElement('a');
  aLink.setAttribute('class', clsName);
  aLink.setAttribute('id', sid);
  aLink.title = scoialMedia;
  aLink.href = '#';
  block.append(aLink);
  document.getElementById(sid).addEventListener('click', openLink);
}
export default function decorate(block) {
  const socialshareicon = block.parentNode.parentNode;
  block.textContent = '';
  const blogContent = document.createElement('div');
  blogContent.classList.add('blog-article');
  blogContent.setAttribute('id', 'blog-article-id');
  socialshareicon.append(blogContent);
  const blogContentLink = document.createElement('div');
  blogContentLink.classList.add('blog-content-link-cs');
  blogContentLink.setAttribute('id', 'blog-content-link');
  block.parentNode.prepend(blogContentLink);
  const childrenDiv = document.getElementById('blog-right-nav').querySelectorAll('div');
  const childrenH1 = document.getElementById('blog-right-nav').querySelectorAll('h1');
  const childrenH2 = document.getElementById('blog-right-nav').querySelectorAll('h2');
  const childrenH3 = document.getElementById('blog-right-nav').querySelectorAll('h3');
  childrenDiv.forEach((div) => {
    blogContent.append(div);
  });
  childrenH1.forEach((h1) => {
    anchorTagLinkCreation(h1.getAttribute('id'), h1.textContent, block);
  });
  childrenH2.forEach((h2) => {
    anchorTagLinkCreation(h2.getAttribute('id'), h2.textContent, block);
  });
  childrenH3.forEach((h3) => {
    anchorTagLinkCreation(h3.getAttribute('id'), h3.textContent, block);
  });
  document.getElementById('blog-right-nav').remove();
  anchorTagSocialMediaCreation('linkedIn', block);
  anchorTagSocialMediaCreation('twitter', block);
  anchorTagSocialMediaCreation('facebook', block);
  anchorTagSocialMediaCreation('shareLink', block);
  // add page scroll listener to know when header turns to sticky
  window.addEventListener('scroll', () => {
    const scrollAmount = window.scrollY;
    if (scrollAmount > block.offsetHeight) {
      document.getElementById('blog-content-link').classList.add('blog-content-link-cs-is-sticky');
    } else {
      document.getElementById('blog-content-link').classList.remove('blog-content-link-cs-is-sticky');
    }
  });
}
