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

function anchorTagLinkCreation(contentLinkId, contentLink) {
  const aLink = document.createElement('a');
  // const linkText = document.createTextNode(contentLink);
  aLink.append(contentLink);
  aLink.classList.add('content-link');
  aLink.href = `#${contentLinkId}`;
  return aLink;
}

function anchorTagSocialMediaCreation(socialMedia) {
  const clsName = `social-share-${socialMedia}`;
  // const sid = `social_share_link${socialMedia}`;
  const aLink = document.createElement('a');
  aLink.setAttribute('class', clsName);
  // aLink.setAttribute('id', sid);
  aLink.title = socialMedia;
  aLink.href = '#';
  aLink.addEventListener('click', openLink);
  return aLink;
}

export default function decorate(block) {
  // find the article content div
  const articleContent = document.querySelector('.article-content');
  const contentDivs = articleContent.querySelectorAll(':scope > div');
  const articleContentWrapper = document.createElement('div');
  articleContentWrapper.classList.add('article-content-wrapper');
  contentDivs.forEach((div) => {
    articleContentWrapper.append(div);
  });

  const blogContentLink = document.createElement('div');
  blogContentLink.classList.add('blog-content-links');
  const headerTags = articleContentWrapper.querySelectorAll('h1, h2, h3');

  headerTags.forEach((headerTag, i) => {
    const contentLinkId = headerTag.getAttribute('id');
    headerTag.classList.add('scroll-margin');
    const aLink = anchorTagLinkCreation(contentLinkId, headerTag.textContent);
    if (i === 0) aLink.classList.add('active');
    blogContentLink.append(aLink);
    // sections.push(document.getElementById(contentLinkId));
    window.addEventListener('scroll', () => {
      const scrollAmount = window.scrollY;
      // headerTags.forEach((element) => {
      if (scrollAmount >= headerTag.offsetTop) {
        // if (idName === contentLinkId) {
        aLink.classList.add('active');
      } else {
        aLink.classList.remove('active');
      }
      // });
    });
  });
  block.textContent = '';
  block.append(blogContentLink);

  const socialShareLinks = document.createElement('div');
  socialShareLinks.classList.add('social-share-links');
  socialShareLinks.append(anchorTagSocialMediaCreation('linkedin'));
  socialShareLinks.append(anchorTagSocialMediaCreation('twitter'));
  socialShareLinks.append(anchorTagSocialMediaCreation('facebook'));
  socialShareLinks.append(anchorTagSocialMediaCreation('share'));

  block.append(socialShareLinks);

  // add page scroll listener to know when leftnav turns sticky
  window.addEventListener('scroll', () => {
    const scrollAmount = window.scrollY;
    if (scrollAmount > block.offsetHeight) {
      blogContentLink.classList.add('blog-content-links-is-sticky');
    } else {
      blogContentLink.classList.remove('blog-content-links-is-sticky');
    }
  });
  articleContent.textContent = '';
  articleContent.append(block);
  articleContent.append(articleContentWrapper);

  // clean up the old div
  const main = document.querySelector('main');
  const blogLeftNavContainer = main.querySelector('.section.blog-left-nav-container');
  main.removeChild(blogLeftNavContainer);
}
