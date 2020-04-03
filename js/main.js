const sections = $(".section");
const display = $(".maincontent");
let inScroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const changeFixedMenuActiveItem = sectionEq => {
  $(".fixed-menu__item")
    .eq(sectionEq)
    .addClass("active")
    .siblings()
    .removeClass("active");
};

const performTransition = sectionEq => {
  if (inScroll) return;

  inScroll = true;
  const transitionIsOver = 1000;
  const mouseInertionIsOver = 300;

  const position = sectionEq * -100;

  if (isNaN(position))
    console.error("передано не верное значение в performTransition");

  sections
    .eq(sectionEq)
    .addClass("active")
    .siblings()
    .removeClass("active");

  display.css({
    transform: `translateY(${position}%)`
  });

  setTimeout(() => {
    inScroll = false;
    changeFixedMenuActiveItem(sectionEq);
  }, transitionIsOver + mouseInertionIsOver);
};

const scroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) performTransition(nextSection.index());
    },
    prev() {
      if (prevSection.length) performTransition(prevSection.index());
    }
  };
};

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const windowScroller = scroller();

  if (deltaY > 0) {
    windowScroller.next();
  }

  if (deltaY < 0) {
    windowScroller.prev();
  }
});

$(document).on("keydown", e => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";
  const windowScroller = scroller();

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

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();
  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");

  performTransition(target);
});

if (isMobile) {
  $("body").swipe({
    swipe: function(
      event,
      direction,
      distance,
      duration,
      fingerCount,
      fingerData
    ) {
      const windowScroller = scroller();
      const scrollDirections = direction === "up" ? "next" : "prev";

      windowScroller[scrollDirections]();
      // scrollToSection(scrollDirections);
    }
  });
}
