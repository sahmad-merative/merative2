import { loadSlick } from '../../scripts/slick.js';

export default function decorate(block) {
  const loadCarousel = async () => {
    await loadSlick();
    window.jQuery(block).slick({});
  };
  loadCarousel();
}
