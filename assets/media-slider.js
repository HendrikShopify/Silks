window.initMediaSwiper = function () {
  const mediaSwiper = document.querySelector("[swiper='media']");
  if (!mediaSwiper) return;

  const swiperElement = mediaSwiper.querySelector('.swiper');
  if (!swiperElement) return;

  if (swiperElement.swiper) {
    swiperElement.swiper.destroy(true, true);
  }

  const prevButton = mediaSwiper.querySelector("[swiper='prev']");
  const nextButton = mediaSwiper.querySelector("[swiper='next']");

  new Swiper(swiperElement, {
    speed: 300,
    slidesPerView: 'auto',
    spaceBetween: 0,
    loop: false,
    centeredSlides: false,
    mousewheel: { forceToAxis: true },
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
      disabledClass: 'hide',
    },
    breakpoints: {
      480: { slidesPerView: 'auto', spaceBetween: 0, slidesPerGroup: 1 },
      768: { slidesPerView: 'auto', spaceBetween: 0, slidesPerGroup: 1 },
      992: {
        slidesPerView: 1,
        spaceBetween: 0,
        slidesPerGroup: 1,
      },
    },
  });
};

// Optional: run on product page load
document.addEventListener('DOMContentLoaded', () => {
  window.initMediaSwiper();
});
