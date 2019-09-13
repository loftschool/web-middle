const sections = $(".section");
const display = $(".maincontent");
let inscroll = false;

const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();

const countPosition = sectionEq => {
  return `${sectionEq * -100}%`;
};

const switchActiveClass = (elems, elemEq) => {
  elems
    .eq(elemEq)
    .addClass("active")
    .siblings()
    .removeClass("active");
};

const unBlockScroll = () => {
  const transitionDuration = 1000;
  const touchScrollInertionTime = 300;

  setTimeout(() => {
    inscroll = false;
  }, transitionDuration + touchScrollInertionTime);
};

const performTransition = sectionEq => {
  if (inscroll) return;

  inscroll = true;
  const position = countPosition(sectionEq);
  const switchFixedMenuActiveClass = () =>
    switchActiveClass($(".fixed-menu__item"), sectionEq);

  switchFixedMenuActiveClass();

  switchActiveClass(sections, sectionEq);

  display.css({
    transform: `translateY(${position})`
  });

  unBlockScroll();
};

const scrollViewport = direction => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (direction === "next" && nextSection.length) {
    performTransition(nextSection.index());
  }

  if (direction === "prev" && prevSection.length) {
    performTransition(prevSection.index());
  }
};

$(document).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const direction = deltaY < 0 ? "prev" : "next";

  scrollViewport(direction);
});

$(document).on("keydown", e => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38: //prev
      scrollViewport("prev");
      break;
    case 40: //next
      scrollViewport("next");
      break;
  }
});

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();

  const target = parseInt($(e.currentTarget).attr("data-scroll-to"));

  performTransition(target);
});

if (isMobile) {
  window.addEventListener(
    "touchmove",
    e => {
      e.preventDefault();
    },
    { passive: false }
  );

  $("body").swipe({
    swipe: function(event, direction) {
      let scrollDirection;

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      scrollViewport(scrollDirection);
    }
  });
}
