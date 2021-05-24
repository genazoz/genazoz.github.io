import './pugImport';
import '../css/common.scss';

import Swiper from 'swiper/bundle';

import LocomotiveScroll from 'locomotive-scroll';

/**
 * Настройки / DOM элементы
 */
  const header = document.getElementById('header');

  var prevScroll,
    lastShowPos;

  let activatedModals = 0,
    modalsArr = [],
    MWZindex = 113;


/**
 * Добавляет кроссбраузерный обработчик событий элементам
 * @return null
 */
  function addEventToEls(els, evnt, func) {
    let objOrNo = typeof els === "object";
    if (!objOrNo && els !== null) {
      els = document.querySelectorAll(els);
    }

    els.forEach(function (x) {
      if (x.addEventListener) {
        x.addEventListener(evnt, func, false);
      } else if (x.attachEvent) {
        x.attachEvent("on" + evnt, function () {
          func.apply(x);
        });
      } else {
        x["on" + evnt] = func;
      }
    });
  }

/**
 * Открывает / закрывает модальные окна
 * @return null
 */
  function modalAnimate(modal) {
    modal.classList.contains("active")
      ? modalDisactivate(modal)
      : modalActivate(modal);
  }
  function modalActivate(modal) {
    modalsArr.push(modal);
    activatedModals++;
    if (!modal.classList.contains(".no-bind-zindex"))
      modal.style.zIndex = MWZindex;
    MWZindex++;
    modal.classList.add("active");
    modal.setAttribute("data-active", "");
    modal.querySelector("[data-modal-wrapper]").setAttribute("data-active", "");
    scroller.stop();
  }
  function modalDisactivate(modal) {
    var sel = window.getSelection(),
      str = String(sel);
    if (str.length > 0) return 0;
    activatedModals--;
    MWZindex--;
    modalsArr.pop();
    modal.classList.remove("active");
    modal.removeAttribute("data-active");
    modal.querySelector("[data-modal-wrapper]").removeAttribute("data-active");

    if(activatedModals === 0){
      scroller.start();
    }
  }

// Проверка инпутов
  function checkForInputs(inputs) {
    /**
     * Обьявление переменных
     */
    var inputCheck = 0;

    /**
     * Проверка на заполнение
     */

    inputs.forEach(function (x) {
        if (x.tagName == "SELECT") {
          if (x.selectedIndex === 0) {
            if(!x.classList.contains('no-style'))
              x.setAttribute("issue", "");
            inputCheck++;
          }
        }else if(x.getAttribute('type') == 'email'){
          if(!isValidEmailAddress(x.value)){
            if(!x.classList.contains('no-style'))
              x.classList.add("issue");
            inputCheck++;
          }
        }else if (x.classList.contains('tel-mask-on')){
          if(x.value.length < 24){
            if(!x.classList.contains('no-style'))
              x.classList.add("issue");
            inputCheck++;
          }
        }
        else if (!x.value && !x.classList.contains("non-binding")) {
          if(!x.classList.contains('no-style'))
            x.classList.add("issue");
          inputCheck++;
        }
    });
    setTimeout(function () {
        document
        .querySelectorAll("input.issue, textarea.issue, select.issue")
        .forEach(function (x) {
            x.classList.remove("issue");
        });
    }, 1000);

    return inputCheck;
  }
  function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    return pattern.test(emailAddress);
  }

/**
 * Добавляет кроссбраузерный обработчик событий динамически подгружающимся элементам
 * @return null
 */
  function on(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function (event) {
      var possibleTargets = element.querySelectorAll(selector);
      var target = event.target;

      for (var i = 0, l = possibleTargets.length; i < l; i++) {
        var el = target;
        var p = possibleTargets[i];

        while (el && el !== element) {
          if (el === p) {
            return fn.call(p, event);
          }

          el = el.parentNode;
        }
      }
    });
  }

/**
 * ForEach по элементам
 * @return null
 */
  function each(els, func) {
    let objOrNo = typeof els === "object";
    if (!objOrNo && els !== null) {
      els = document.querySelectorAll(els);
    }
    els.forEach(function (x) {
      func(x);
    });
  }


/**
 * Locomotive плагин / Locomotive plugin
 */
  var scroller;

  document.addEventListener("DOMContentLoaded", ready);

  function ready() {
    setTimeout(function(){
      scroller = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true
      });

      scroller.on('scroll', (args) => {
        const scrolled = args.scroll.y;

        if(window.innerWidth> 960) {
          if (scrolled > 50 && scrolled > prevScroll) {
            header.classList.add("header-out");
            lastShowPos = scrolled;
          }
          else if (scrolled <= Math.max(lastShowPos - 50, 0)) {
            header.classList.remove("header-out");
          }
        }
        // else if(window.innerWidth <= 960) {
        //   if (scrolled > 100) {
        //     header.classList.add("header-styled-m");
        //     lastShowPos = scrolled;
        //   }
        //   else {
        //     header.classList.remove("header-styled-m");
        //   }
        // }

        prevScroll = scrolled;

        header.classList.remove("dark-mode");
        each(document.querySelectorAll('section[data-header-mode]'), function(x){
            if(x.offsetTop - header.offsetHeight / 2 < scrolled && x.offsetTop - header.offsetHeight / 2 + x.offsetHeight > scrolled){
              header.classList.add(x.getAttribute('data-header-mode'));
            }
        })
      })
    },10)



  // //menu part
  // var $menuIcon = $('.menu-icon');
  // var $menuHamburger = $('.menu-icon-top').add('.menu-icon-middle').add('.menu-icon-bottom');
  // var $menuCrossTop = $('.menu-icon-cross-top');
  // var $menuCrossBottom = $('.menu-icon-cross-bottom');
  // var $menu = $('.menu');
  // var $menuBg = $('.menu-bg');
  // var $menuList = $('.menu-list');

  // //delays
  // var delayForNextElement;
  // var sumDelays = 0;

  // $menuIcon.click(function() {

  //   if (!$menu.hasClass('menu-active')) {

  //     //reset delays sum
  //     sumDelays = 0;

  //     //menu part
  //     $menu.addClass('menu-active');
  //     $menuHamburger.each(function() {
  //       var $this = $(this);
  //       var currentClass = $this.attr('class');
  //       $this.addClass(currentClass + '-hide');
  //     });
  //     $menuCrossTop.addClass('menu-icon-cross-top-show');
  //     $menuCrossBottom.addClass('menu-icon-cross-bottom-show');
  //     $menuBg.addClass('menu-bg-show');
  //     $menuList.addClass('menu-list-show');



  //   } else {

  //     //reset delays sum
  //     sumDelays = 0;

  //     //menu part
  //     $menu.removeClass('menu-active');
  //     $menuHamburger.each(function() {
  //       var $this = $(this);
  //       var spacePos = $this.attr('class').indexOf(' ');
  //       var neededClass = $this.attr('class').slice(spacePos);
  //       $this.removeClass(neededClass);
  //     });
  //     $menuCrossTop.removeClass('menu-icon-cross-top-show');
  //     $menuCrossBottom.removeClass('menu-icon-cross-bottom-show');
  //     $menuBg.removeClass('menu-bg-show');
  //     $menuList.removeClass('menu-list-show');

  //   }

  // });
  }
/**
 * Locomotive плагин / Locomotive plugin
 */



/**
 * Swiper слайдеры
 */
  var swiper = new Swiper("#galleryThumbsSlider", {
    spaceBetween: 16,
    slidesPerView: 'auto',
    breakpoints: {
      // when window width is >= 960px
      960: {
        spaceBetween: 14,
        slidesOffsetAfter: 0,
        slidesOffsetBefore: 0
      },
      0: {
        spaceBetween: 14,
        slidesOffsetAfter: 20,
        slidesOffsetBefore: 20
      },
    }
  });
  var swiper2 = new Swiper("#gallerySlider", {
    loop: true,
    // spaceBetween: 10,
    slidesPerView: 1,
    navigation: {
      nextEl: ".gallery-slider__swiper-button-next",
      prevEl: ".gallery-slider__swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
  });
  each(document.querySelectorAll('.goods-slider-a'), function (x) {
    if(x.parentNode.classList.contains('s-preview-goods--full--slider')){
      new Swiper(x, {
        spaceBetween: 24,
        slidesPerView: 4,
        breakpoints: {
          1201: {
            slidesPerView: 4,
          },
          850: {
            slidesPerView: 3,
          },
          699: {
            slidesPerView: 2,
            slidesOffsetAfter: 0,
          },
          0: {
            spaceBetween: 16,
            slidesPerView: 1.41,
            slidesOffsetAfter: 16,
          },
        },
        navigation: {
          prevEl: x.querySelector(".swiper-button-prev"),
          nextEl: x.querySelector(".swiper-button-next"),
        },
      });
    }else{
      new Swiper(x, {
        spaceBetween: 24,
        slidesPerView: 3,
        breakpoints: {
          1500: {
            slidesPerView: 3,
          },
          959: {
            slidesPerView: 2,
          },
          850: {
            slidesPerView: 3,
          },
          699: {
            slidesPerView: 2,
            slidesOffsetAfter: 0,
          },
          0: {
            spaceBetween: 16,
            slidesPerView: 1.41,
            slidesOffsetAfter: 16,
          },
        }
      });
    }
  });
/**
 * Swiper слайдеры
 */



addEventToEls("[data-toggle-modal-btn]", "click", function (event) {
  let modal = this.getAttribute("data-switching-modal"),
    modalClass = "." + modal,
    _this = this;

  if (modal) {
    setTimeout(function () {
      if (_this.classList.contains("issue")) return 0;

      modalAnimate(document.querySelector(modalClass));
      if (_this.getAttribute("data-close-modal-btn") !== null) {
        modalDisactivate(_this.closest(".M"));
      }
    });
  } else if (
    _this.classList.contains("modal-window") ||
    _this.classList.contains("MW") ||
    _this.classList.contains("M")
  ) {
    if (event.target.className == _this.getAttribute("class")) {
      modalAnimate(_this);
    }
  } else {
    modalAnimate(_this.closest(".modal-window, .MW, .M"));
  }
});
on("html", "keyup", ".check-inputs-container input:not([type='file']), .check-inputs-container textarea, .check-inputs-container select", function (e) {
  e.preventDefault();

  var issue = checkForInputs(
    this.closest(".check-inputs-container").querySelectorAll(
      "input, select, textarea"
    )
  );

  if (issue > 0) {
    e.preventDefault();
    this.closest('.check-inputs-container').querySelector('.check-inputs-btn').classList.add('is-disabled');
  } else {
    this.closest('.check-inputs-container').querySelector('.check-inputs-btn').classList.remove('is-disabled');
  }
});
on("html", "click", ".check-inputs-btn", function (e) {
  var issue = checkForInputs(
    this.closest(".check-inputs-container").querySelectorAll(
      "input, select, textarea"
    )
  );

  if (issue > 0) {
    e.preventDefault();
  } else {
    this.classList.add("is-succeed");
  }
});


each('.animation-text', function(x){
  var str =  x.innerText, // берем текст, который нужно анимировать
      symbols = str.split(" "); // разбиваем на массив символов

  x.innerText = '';

  symbols.forEach(function(item) { // в цикле по всем
    var span = document.createElement('span'); // создаем span
    if(x.closest('.s-preview-goods--reverse')){
      span.innerHTML = '&nbsp;' + item; // задаем содержимое span
    }
    else{
      span.innerHTML = item + '&nbsp;'; // задаем содержимое span
    }
    span.classList.add('animation-text__word');
    x.appendChild(span);
  });
})
