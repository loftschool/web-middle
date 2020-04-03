const sections = $(".section");
const display = $(".maincontent");

let inScroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const countSectionPosition = (sectionEq) => {

  const position = sectionEq * -100;
  if (isNaN(position))
    console.error("передано не верное значение в countSectionPositon");

  return position;
};

const resetActiveClass = (item, eq) => {
  item.eq(eq).addClass("active").siblings().removeClass("active");
};

const performTransition = (sectionEq) => {
  if (inScroll) return;

  inScroll = true;

  const position = countSectionPosition(sectionEq);
  const trasitionOver = 1000;
  const mouseInertionOver = 300;

  resetActiveClass(sections, sectionEq);

  display.css({
    transform: `translateY(${position}%)`,
  });

  setTimeout(() => {
    resetActiveClass($(".fixed-menu__item"), sectionEq);
    inScroll = false;
  }, trasitionOver + mouseInertionOver);
};

const scroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const windowScroller = scroller();

  if (deltaY > 0) {
    windowScroller.next();
  }

  if (deltaY < 0) {
    windowScroller.prev();
  }
});

$(document).on("keydown", (e) => {
  const tagName = e.target.tagName.toLowerCase();
  const windowScroller = scroller();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      windowScroller.prev();
      break;
    case 40:
      windowScroller.next();
      break;
  }
});

$("[data-scroll-to]").on("click", (e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");

  performTransition(target);
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: (event, direction) => {
      let scrollDirection;
      const windowScroller = scroller();

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      windowScroller[scrollDirection]();
    },
  });
}
