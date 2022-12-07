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
}

function setFocus(e) {
  let idName = e.target.getAttribute('id');
  const link = e.target.parentNode.querySelectorAll('a');
  link.forEach((a) => {
    const linkId = a.getAttribute('id');
    if (linkId === idName) {
      e.target.classList.add('active');
    } else {
      document.getElementById(linkId).classList.remove('active');
    }
  });
  idName = idName.replace('-leftnav', '');
  document.getElementById(idName).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'end'
  });
}

function AnchorTagLinkCreation(contentLinkId, contentLink, block) {
  let aLink = document.createElement('a');
  const linkText = document.createTextNode(contentLink);
  aLink.append(linkText);
  aLink.setAttribute('id', `${contentLinkId}-leftnav`);
  aLink.classList.add('content_link');
  aLink.href = 'javascript:void(0)';
  document.getElementById('blog-content-link').append(aLink);
  document.getElementsByClassName('content_link')[0].classList.add('active');
  document.getElementById(`${contentLinkId}-leftnav`).addEventListener('click', setFocus);
}

function AnchorTagSocialMediaCreation(scoialMedia, block) {
  const clsName = `social-share-${scoialMedia}`;
  const sid = `social_share_link${scoialMedia}`;
  const aLink = document.createElement('a');
  aLink.setAttribute('class', clsName);
  aLink.setAttribute('id', sid);
  aLink.title = scoialMedia;
  aLink.href = 'javascript:void(0)';
  block.append(aLink);
  document.getElementById(sid).addEventListener('click', openLink);
}
export default function decorate(block) {
  const w = (document.documentElement.clientWidth || window.innerWidth);
  const socialshareicon = block.parentNode.parentNode;
  let contentLinkId = '';
  let contentLink = '';
  block.textContent = '';
  const blogContent = document.createElement('div');
  blogContent.classList.add('blog-content');
  blogContent.setAttribute('id', 'blog-content-id');
  socialshareicon.append(blogContent);
  const blogContentLink = document.createElement('div');
  blogContentLink.classList.add('blog-content-link-cs');
  blogContentLink.setAttribute('id', 'blog-content-link');
  block.parentNode.prepend(blogContentLink);
  /* 
  if (w <= 768) {
  block.parentNode.append(blogContentLink);
  }
  */
  const childrenDiv = document.getElementById('blog-right-nav').querySelectorAll('div');
  const childrenH2 = document.getElementById('blog-right-nav').querySelectorAll('h2');
  const childrenH3 = document.getElementById('blog-right-nav').querySelectorAll('h3');
  childrenDiv.forEach((div) => {
    blogContent.append(div);
    /*
    if (w <= 768) {
    block.parentNode.setAttribute('id', 'wrapper');
    blogContent.append(div);
    if (div.getAttribute('data-block-name') == 'author-bio') {
    const socialSharenDiv = document.getElementById('wrapper').querySelectorAll('div');
    socialSharenDiv.forEach(div => {
    blogContent.append(div);
    });
    }
    } else {
    blogContent.append(div);
    }
    */
  });
  childrenH2.forEach((h2) => {
    contentLinkId = h2.getAttribute('id');
    contentLink = h2.textContent;
    AnchorTagLinkCreation(contentLinkId, contentLink, block);
  });
  childrenH3.forEach((h3) => {
    contentLinkId = h3.getAttribute('id');
    contentLink = h3.textContent;
    AnchorTagLinkCreation(contentLinkId, contentLink, block);
  });
  //  document.getElementById('wrapper').remove();
  document.getElementById('blog-right-nav').remove();
  AnchorTagSocialMediaCreation('linkedIn', block);
  AnchorTagSocialMediaCreation('twitter', block);
  AnchorTagSocialMediaCreation('facebook', block);
  AnchorTagSocialMediaCreation('shareLink', block);
}
