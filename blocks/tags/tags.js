import { createTag, getMetadata } from '../../scripts/scripts.js';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export default function decorate(block) {
  const category = getMetadata('category');
  let audience = getMetadata('audience');
  let topic = getMetadata('topic');

  if (category) {
    let tags = [];
    tags.push(category);
    if (audience && topic) {
      audience = audience.split(',').map((element) => element.trim());
      topic = topic.split(',').map((element) => element.trim());
      tags = tags.concat(audience, topic);
    }

    const uniqueTags = tags.filter(onlyUnique);
    block.innerHTML = '';

    uniqueTags.forEach((item) => {
      const tag = createTag('span', { class: 'tag' }); // can be changed to buttons to be clickable
      tag.innerHTML = item;
      block.append(tag);
    });
  }
}
