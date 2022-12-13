import { createTag, getMetadata } from '../../scripts/scripts.js';

export default function decorate(block) {
  const category = getMetadata('category');
  const audience = getMetadata('audience');
  const topic = getMetadata('topic');

  if (category) {
    let uniqueTags = new Set();
    uniqueTags = [category];
    if (audience && topic) {
      const audienceSet = new Set(audience.split(',').map((element) => element.trim()));
      const topicSet = new Set(topic.split(',').map((element) => element.trim()));
      uniqueTags = ([category, ...audienceSet, ...topicSet]);
    }
    block.innerHTML = '';
    uniqueTags.forEach((item) => {
      const tag = createTag('span', { class: 'tag' }); // can be changed to buttons to be clickable
      tag.innerHTML = item;
      block.append(tag);
    });
  }
}
