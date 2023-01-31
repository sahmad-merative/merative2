/**
 * Carousel Block
 *
 * This block adds carousel behaviour to a block. The default block markup will be
 * augmented and additional markup will be added to render the final presentation.
 *
 * Features:
 * - smooth scrolling
 * - mouse drag between slides
 * - next and previous button
 * - direct selection via dots
 * - active slide indicator
 * - accessibility
 *
 * @example Carousel markup
 * <div class="carousel">
 *   <div class="carousel-slide-container">
 *     <div class="carousel-slide">
 *       <div>content</div>
 *       <figure>
 *         <figcaption class="caption">content</figcaption>
 *       </figure>
 *     </div>
 *     ...
 *   </div>
 *   <div class="carousel-nav carousel-nav-prev"></div>
 *   <div class="carousel-nav carousel-nav-next"></div>
 *   <ul class="carousel-dots">
 *     <li><button/></li>
 *   </ul>
 * </div>
 */

let curSlide = 0;
let maxSlide = 0;

function syncActiveDot(carousel, activeSlide) {
  carousel.querySelectorAll('li').forEach((item, index) => {
    if (index === activeSlide) {
      item.classList.add('carousel-dots--active');
    } else {
      item.classList.remove('carousel-dots--active');
    }
  });
}

function scrollToSlide(carousel, slide = 0) {
  const carouselSlider = carousel.querySelector('.carousel-slide-container');
  carouselSlider.scrollTo({ left: carouselSlider.offsetWidth * slide, behavior: 'smooth' });
  syncActiveDot(carousel, slide);
  curSlide = slide;
}

/**
 * Based on the direction of a scroll snap the scroll position based on the
 * offset width of the scrollable element. The snap threshold is determined
 * by the direction of the scroll to ensure that snap direction is natural.
 *
 * @param el the scrollable element
 * @param dir the direction of the scroll
 */
function snapScroll(el, dir = 1) {
  if (!el) return;
  let threshold = el.offsetWidth * 0.5;
  if (dir >= 0) {
    threshold -= (threshold * 0.5);
  } else {
    threshold += (threshold * 0.5);
  }
  const block = Math.floor(el.scrollLeft / el.offsetWidth);
  const pos = el.scrollLeft - (el.offsetWidth * block);
  const snapToBlock = pos <= threshold ? block : block + 1;
  const carousel = el.closest('.carousel');
  scrollToSlide(carousel, snapToBlock);
}

/**
 * Build a navigation button for controlling the direction of carousel slides.
 *
 * @param dir A string of either 'prev or 'next'
 * @return {HTMLDivElement} The resulting nav element
 */
function buildNav(dir) {
  const btn = document.createElement('div');
  btn.classList.add('carousel-nav', `carousel-nav-${dir}`);
  btn.addEventListener('click', (e) => {
    let nextSlide = 0;
    if (dir === 'prev') {
      nextSlide = curSlide === 0 ? maxSlide : curSlide - 1;
    } else {
      nextSlide = curSlide === maxSlide ? 0 : curSlide + 1;
    }
    const carousel = e.target.closest('.carousel');
    scrollToSlide(carousel, nextSlide);
  });
  return btn;
}

/**
 *
 * @param slides An array of slide elements within the carousel
 * @return {HTMLUListElement} The carousel dots element
 */
function buildDots(slides = []) {
  const dots = document.createElement('ul');
  dots.classList.add('carousel-dots');
  dots.setAttribute('role', 'tablist');
  slides.forEach((slide, index) => {
    const dotItem = document.createElement('li');
    dotItem.setAttribute('role', 'presentation');
    if (index === 0) {
      dotItem.classList.add('carousel-dots--active');
    }
    const dotBtn = document.createElement('button');
    dotBtn.setAttribute('type', 'button');
    dotBtn.setAttribute('role', 'tab');
    dotBtn.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    dotBtn.innerText = `${index + 1}`;
    dotItem.append(dotBtn);
    dotItem.addEventListener('click', (e) => {
      curSlide = index;
      const carousel = e.target.closest('.carousel');
      scrollToSlide(carousel, curSlide);
    });
    dots.append(dotItem);
  });

  return dots;
}

/**
 * Decorate and transform a carousel block.
 *
 * @param block HTML block from Franklin
 */
export default function decorate(block) {
  const carousel = document.createElement('div');
  carousel.classList.add('carousel-slide-container');

  // make carousel draggable
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let prevScroll = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    startScroll = carousel.scrollLeft;
    prevScroll = startScroll;
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  carousel.addEventListener('mouseup', () => {
    if (isDown) {
      snapScroll(carousel, carousel.scrollLeft > startScroll ? 1 : -1);
    }
    isDown = false;
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX);
    carousel.scrollLeft = prevScroll - walk;
  });

  // process each slide
  const slides = [...block.children];
  maxSlide = slides.length - 1;
  slides.forEach((slide, index) => {
    slide.classList.add('carousel-slide');
    slide.style.transform = `translateX(${index * 100}%)`;

    // caption
    const figure = document.createElement('figure');

    const figureImg = document.createElement('img');
    figureImg.src = '/styles/images/MegaphoneSimple.jpeg';
    figureImg.width = 64;
    figureImg.height = 64;

    const figCaption = document.createElement('figcaption');
    figCaption.classList.add('caption');
    figCaption.append(slide.children[1]);

    figure.append(figureImg);
    figure.append(figCaption);
    slide.append(figure);
    carousel.appendChild(slide);
  });

  block.append(carousel);

  // add nav buttons and dots
  if (slides.length > 1) {
    const prevBtn = buildNav('prev');
    const nextBtn = buildNav('next');
    const dots = buildDots(slides);
    block.append(prevBtn, nextBtn, dots);
  }

  // auto scroll when visible
  let scrollInterval;

  const intersectionOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  const handleAutoScroll = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollInterval = setInterval(() => {
          scrollToSlide(block, curSlide < maxSlide ? curSlide + 1 : 0);
        }, 8000);
      } else if (scrollInterval) {
        // cancel auto scroll
        clearInterval(scrollInterval);
      }
    });
  };

  const carouselObserver = new IntersectionObserver(handleAutoScroll, intersectionOptions);
  carouselObserver.observe(block);
}
