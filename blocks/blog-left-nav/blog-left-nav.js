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
    e.preventDefault();
    idName = idName.replace('-leftnav', '');
    console.log(idName);
    document.getElementById(idName).classList.add('scrollMargin');
    idName = `#${idName}`;
    document.querySelector(idName).scrollIntoView({
        behavior: 'smooth',
    });

    /*document.getElementById(idName).scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
    });*/

}

function AnchorTagLinkCreation(contentLinkId, contentLink) {
    const aLink = document.createElement('a');
    const linkText = document.createTextNode(contentLink);
    aLink.append(linkText);
    aLink.setAttribute('id', `${contentLinkId}-leftnav`);
    aLink.classList.add('content_link');
    aLink.href = '#';
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
    aLink.href = '#';
    block.append(aLink);
    document.getElementById(sid).addEventListener('click', openLink);
}
export default function decorate(block) {
    const socialshareicon = block.parentNode.parentNode;
    let contentLinkId = '';
    let contentLink = '';
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
        contentLinkId = h1.getAttribute('id');
        contentLink = h1.textContent;
        AnchorTagLinkCreation(contentLinkId, contentLink, block);
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
    document.getElementById('blog-right-nav').remove();
    AnchorTagSocialMediaCreation('linkedIn', block);
    AnchorTagSocialMediaCreation('twitter', block);
    AnchorTagSocialMediaCreation('facebook', block);
    AnchorTagSocialMediaCreation('shareLink', block);

    // add page scroll listener to know when header turns to sticky
    const header = block;
    window.addEventListener('scroll', () => {
        const scrollAmount = window.scrollY;
        if (scrollAmount > header.offsetHeight) {
            document.getElementById('blog-content-link').classList.add('blog-content-link-cs-is-sticky');
        } else {
            document.getElementById('blog-content-link').classList.remove('blog-content-link-cs-is-sticky');
        }
    });
}