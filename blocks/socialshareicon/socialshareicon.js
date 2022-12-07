function openLink(e) {
    const idName = e.target.getAttribute('id');
    let url = null;
    if (idName !== null) {
        if (idName.includes('linkedIn')) {
            url = "https://www.linkedin.com/sharing/share-offsite/?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes('twitter')) {
            url = "https://twitter.com/share?url=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes('facebook')) {
            url = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
            window.open(url, '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=300,width=800,height=500');
        } else if (idName.includes('shareLink')) {
            navigator.clipboard.writeText(window.location.href);
        }
    }
}

function setFocus(e) {
    let idName = e.target.getAttribute('id');
    const link = e.target.parentNode.querySelectorAll('a');
    link.forEach(a => {
        const linkId = a.getAttribute('id');
        if (linkId == idName){
            e.target.classList.add('active');
        }
        else{
            document.getElementById(linkId).classList.remove('active');
        }
    });
    idName = idName.replace('-leftnav', '');
    document.getElementById(idName).scrollIntoView({ behavior: "smooth", block: "start", inline: "end" });
}

function AnchorTagLinkCreation(content_link_id, content_link, block) {
    let _a = document.createElement('a');
    let linkText = document.createTextNode(content_link);
    _a.append(linkText);
    _a.setAttribute('id', content_link_id + '-leftnav');
    _a.classList.add("content_link");
    _a.href = 'javascript:void(0)';
    document.getElementById('blog-content-link').append(_a);
    document.getElementsByClassName('content_link')[0].classList.add('active');
    document.getElementById(content_link_id + '-leftnav').addEventListener('click', setFocus);

}

function AnchorTagSocialMediaCreation(scoialMedia, block) {
    let clsName = "social-share-" + scoialMedia;
    let txtNode = scoialMedia;
    let _sid = "social_share_link" + scoialMedia;
    let _a = document.createElement('a');
    _a.setAttribute('class', clsName);
    _a.setAttribute("id", _sid);
    _a.title = scoialMedia;
    _a.href = "javascript:void(0)";
    block.append(_a);
    document.getElementById(_sid).addEventListener('click', openLink);
}
export default function decorate(block) {
    let w = document.documentElement.clientWidth || window.innerWidth;
    const socialshareicon = block.parentNode.parentNode;
    let content_link_id = '';
    let content_link = '';
    block.textContent = '';
    const blogContent = document.createElement('div');
    blogContent.classList.add('blog-content');
    blogContent.setAttribute('id', 'blog-content-id');
    socialshareicon.append(blogContent);
    const blogContentLink = document.createElement('div');
    blogContentLink.classList.add('blog-content-link-cs');
    blogContentLink.setAttribute('id', 'blog-content-link');
    block.parentNode.prepend(blogContentLink);
    /* if (w <= 768) {
    block.parentNode.append(blogContentLink);
    }*/
    const childrenDiv = document.getElementById('blog-right-nav').querySelectorAll('div');
    const childrenH2 = document.getElementById('blog-right-nav').querySelectorAll('h2');
    const childrenH3 = document.getElementById('blog-right-nav').querySelectorAll('h3');
    childrenDiv.forEach(div => {
        blogContent.append(div);
        /*if (w <= 768) {
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
        }*/
    });
    childrenH2.forEach(h2 => {
        content_link_id = h2.getAttribute('id');
        content_link = h2.textContent;
        AnchorTagLinkCreation(content_link_id, content_link, block);
    });
    childrenH3.forEach(h3 => {
        content_link_id = h3.getAttribute('id');
        content_link = h3.textContent;
        AnchorTagLinkCreation(content_link_id, content_link, block);
    });
    //  document.getElementById('wrapper').remove();
    document.getElementById('blog-right-nav').remove();
    AnchorTagSocialMediaCreation("linkedIn", block);
    AnchorTagSocialMediaCreation("twitter", block);
    AnchorTagSocialMediaCreation("facebook", block);
    AnchorTagSocialMediaCreation("shareLink", block);
}
