import { getAllBlogs, createCard } from '../../scripts/scripts.js';

function createCheckboxList(label, elementName) {
    const cleanedLabel = label.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const div = document.createElement('div');
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.setAttribute('name', elementName);    
    inputEl.setAttribute('id', cleanedLabel);
    inputEl.setAttribute('value', cleanedLabel);
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', cleanedLabel);
    labelEl.innerHTML(label);
    div.append(inputEl);
    div.append(labelEl);
}

export default async function decorate(block) {
    block.textContent = '';
    // Make a call to get all blog details from the blog index
    const blogList = await getAllBlogs();
    const topics = new Set();
    const audiences = new Set();
    if (blogList.length) {
        const blogCards = document.createElement('div');
        blogCards.classList.add('blog-cards');
        blogList.forEach(async (row) => {
            const blogCard = await createCard(row, 'blog-card');

            if (row.topic && row.topic != '0') {
                blogCard.setAttribute('topics',row.topic);
                const topicValues = row.topic.split(',');
                topicValues.forEach((topicValue) => {
                    topics.add(topicValue);
                });
            }
            if (row.audience && row.audience != '0') {
                blogCard.setAttribute('audiences', row.audience);
                const audienceValues = row.audience.split(',');
                audienceValues.forEach((audienceValue) => {
                    audiences.add(audienceValue);
                });
            }
            // if (row.category !== '0') {
                blogCards.append(blogCard);
            // }
        });
        block.append(blogCards);

        // Create DOM elements for topics and audiences to display in the left nav
        const filters = document.createElement('div');
        filters.classList.add('filters');

        const topicsElement = document.createElement('div');
        topicsElement.classList.add('topics');        
        if (topics.length) {
            topics.forEach((topic) => {
                topicsElement.append(createCheckboxList(topic, 'topic'));
            });
            filters.append(topicsElement);
        }

        const audiencesElement = document.createElement('div');
        audiencesElement.classList.add('audiences');
        if (audiences.length) {
            audiences.forEach((audience) => {
                audiencesElement.append(createCheckboxList(audience, 'audience'));
            });
            filters.append(audiencesElement);
        }
        block.prepend(filters);
    } else {
        block.remove();
    }
}