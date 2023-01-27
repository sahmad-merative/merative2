
let curSlide = 0;
let maxSlide = 0;

function checkScrollPosition(el) {
  if (el.scrollLeft === 0) return 'start';
  if (el.scrollWidth - el.scrollLeft === el.offsetWidth) return 'end';
  return null;
}

function buildNav(dir) {
  const btn = document.createElement('div');
  btn.classList.add('carousel-nav', `carousel-nav-${dir}`);
  btn.addEventListener('click', (e) => {
    if (dir === 'prev') {
      if (curSlide === 0) {
        curSlide = maxSlide;
      } else {
        curSlide--;
      }
    } else {
      if (curSlide === maxSlide) {
        curSlide = 0;
      } else {
        curSlide++;
      }
    }

    const carousel = e.target.closest('.carousel');
    carousel.querySelectorAll('.carousel-slide').forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  });
  return btn;
}

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('carousel-slide-container');
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

    container.appendChild(slide);

  });
  block.append(container);


  // add nav buttons
  if (slides.length > 1) {
    const prevBtn = buildNav('prev');
    const nextBtn = buildNav('next');
    block.append(prevBtn, nextBtn);
  }
}
