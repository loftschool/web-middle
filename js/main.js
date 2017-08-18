var
  sections = $('.section'),
  display = $('.maincontent'),
  inscroll = false;

var mobileDetect = new MobileDetect(window.navigator.userAgent),
  isMobile = mobileDetect.mobile();

sections.filter(':first-child').addClass('active');

var performTransition = function (sectionEq) {
  if (inscroll) return;
  inscroll = true;

  var position = (sectionEq * -100) + '%';

  sections.eq(sectionEq).addClass('active')
    .siblings().removeClass('active');

  display.css({
    'transform': 'translate(0,' + position + ')',
    '-webkit-transform': 'translate(0,' + position + ')'
  });

  setTimeout(function () {
    inscroll = false;

    $('.fixed-menu__item').eq(sectionEq).addClass('active')
      .siblings().removeClass('active');
  }, 1300) // подождать пока завершится инерция на тачпадах
}

var defineSections = function (sections) {
  var activeSection = sections.filter('.active');
  return {
    activeSection: activeSection,
    nextSection: activeSection.next(),
    prevSection: activeSection.prev()
  }
}

var scrollToSection = function (direction) {
  var section = defineSections(sections);

  if (inscroll) return;

  if (direction == 'up' && section.nextSection.length) { //скроллим вниз
    performTransition(section.nextSection.index())
  }

  if (direction == 'down' && section.prevSection.length) { //спроллим вверх
    performTransition(section.prevSection.index())
  }
}

$('.wrapper').on({
  wheel: e => {
    var deltaY = e.originalEvent.deltaY,
      direction = (deltaY > 0) ? 'up' : 'down';

    scrollToSection(direction);
  },
  touchmove: e => (e.preventDefault())
})

// разрешаем свайп на мобильниках
if (isMobile) {
  $(window).swipe({
    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
      scrollToSection(direction);
    }
  });
}

$(document).on('keydown', function (e) {
  var section = defineSections(sections);

  switch (e.keyCode) {
    case 40: // up
      if (!section.nextSection.length) return;
      performTransition(section.nextSection.index())
      break;

    case 38: // down
      if (!section.prevSection.length) return;
      performTransition(section.prevSection.index())
      break;
  }
})

// клики по кнопкам навигации
$('[data-scroll-to]').on('click', function (e) {
  e.preventDefault();
  performTransition(parseInt($(this).attr('data-scroll-to')));
});