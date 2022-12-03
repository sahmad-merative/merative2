import { getAllBlogs, createCard, getBlogCategoryPages } from '../../scripts/scripts.js';

async function addEventListeners(checkboxes, filterGroup) {
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const checkedList = Array.from(checkboxes) // Convert checkboxes to an array to use filter and map.
                .filter((i) => i.checked) // Use Array.filter to remove unchecked checkboxes.
                .map((i) => i.value); // Use Array.map to extract only the checkbox values from the array of objects.
            if(checkedList.length) {
                const blogCards = document.querySelectorAll(".blog-card");
                blogCards.forEach((card) => {
                    card.setAttribute('aria-hidden','true');
                    if(card.hasAttribute(filterGroup)) {
                        const filterGroupValues = card.getAttribute(filterGroup).split(',');
                        const found = filterGroupValues.some((checkedItem) => checkedList.includes(checkedItem.trim()));
                        if(found) {
                            card.removeAttribute('aria-hidden');
                        }
                    }
                });
            } else {
                // nothing selected. every card shows
                const hiddenBlogCards = document.querySelectorAll(".blog-card[aria-hidden]");
                hiddenBlogCards.forEach((card) => {
                    card.removeAttribute('aria-hidden');
                });
            }
        })
    });
}

async function createCheckboxList(label, elementName) {
    // const cleanedLabel = label.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const div = document.createElement('div');
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.setAttribute('name', elementName);
    inputEl.setAttribute('id', label);
    inputEl.setAttribute('value', label);
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', label);
    labelEl.append(label);
    div.append(inputEl);
    div.append(labelEl);
    return (div);
}

async function createFilters(categories, topics, audiences) {
    // Create DOM elements for topics and audiences to display in the left nav
    const filters = document.createElement('div');
    filters.classList.add('filters');

    const topicsElement = document.createElement('div');
    topicsElement.classList.add('topics');
    const topicLabel = document.createElement('p');
    topicLabel.append('Topic');
    topicsElement.append(topicLabel);
    if (topics.size) {
        await topics.forEach(async (topic) => {
            topicsElement.append(await createCheckboxList(topic, 'topic'));
        });
        filters.append(topicsElement);
    }
    const topicCheckboxes = topicsElement.querySelectorAll("input[type=checkbox][name=topic]");
    await addEventListeners(topicCheckboxes, "topics");

    const audiencesElement = document.createElement('div');
    audiencesElement.classList.add('audiences');
    const audienceLabel = document.createElement('p');
    audienceLabel.append('Audience');
    audiencesElement.append(audienceLabel);
    if (audiences.size) {
        await audiences.forEach(async (audience) => {
            audiencesElement.append(await createCheckboxList(audience, 'audience'));
        });
        filters.append(audiencesElement);
    }
    const audienceCheckboxes = audiencesElement.querySelectorAll("input[type=checkbox][name=audience]");
    await addEventListeners(audienceCheckboxes, "audiences");

    filters.prepend(await createCategories(categories))
    return (filters);
}

async function createCategories(categoriesList) {
    const categoriesElement = document.createElement('div');
    categoriesElement.classList.add('categories');
    categoriesList.forEach ((row) => {
        if((row.path !== '0') && (row.title !== '0')) {
            const link = document.createElement('a');
            link.classList.add('category-link');
            link.href = row.path;
            if (row.title) link.innerHTML += `${row.title}`;
            categoriesElement.append(link);
        }
    });
    return (categoriesElement);
}

export default async function decorate(block) {
    const category = block.textContent.trim();
    block.textContent = '';
    // Make a call to get all blog details from the blog index
    const blogList = await getAllBlogs(category);
    const categoriesList = await getBlogCategoryPages();
    const topics = new Set();
    const audiences = new Set();
    if (blogList.length) {
        const blogCards = document.createElement('div');
        blogCards.classList.add('blog-cards');
        await blogList.forEach(async (row) => {
            const blogCard = await createCard(row, 'blog-card');

            if (row.topic && row.topic !== '0') {
                blogCard.setAttribute('topics', row.topic);
                const topicValues = row.topic.split(',');
                topicValues.forEach((topicValue) => {
                    topics.add(topicValue.trim());
                });
            }
            if (row.audience && row.audience !== '0') {
                blogCard.setAttribute('audiences', row.audience);
                const audienceValues = row.audience.split(',');
                audienceValues.forEach((audienceValue) => {
                    audiences.add(audienceValue.trim());
                });
            }
            // if (row.category !== '0') {
            blogCards.append(blogCard);
            // }
        });
        block.append(blogCards);
        block.prepend(await createFilters(categoriesList, topics, audiences));
    } else {
        block.remove();
    }
}