import './pugImport';
import '../css/common.scss';

import Swiper from 'swiper/bundle';

import LocomotiveScroll from 'locomotive-scroll';

import noUiSlider from'noUiSlider'

import tippy from 'tippy.js';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('static/img/', false, /\.(png|jpe?g|svg)$/));



/**
 * Настройки / DOM элементы
 */
  const header = document.getElementById('header');

  let prevScroll,
    lastShowPos,
    activatedModals = 0,
    modalsArr = [],
    MWZindex = 113,
    mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


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
   * Добавляет кроссбраузерный обработчик событий динамически подгружающимся элементам
   * @return null
   */
  function on(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];

            while(el && el !== element) {
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
  function findIndex(elem, items) {
    var i,
      len = items.length;
    for (i = 0; i < len; i++) {
      if (items[i] === elem) {
        return i;
      }
    }
    return -1;
  }
  function toggleActive(els, amount = 1) {
    if(amount === 1){
      els.classList.toggle("is-active");
    }else if(amount === 2){
      each(els, function (x) {
        x.classList.toggle("is-active");
      });
    }
  }
  function toggleConnected(parent, els, indexConnected) {
    if (parent === null) {
      each(document.querySelectorAll(els), function (x) {
        x.classList.remove("is-active");
      });
      each(
        document.querySelectorAll(els + ":nth-child(" + indexConnected + ")"),
        function (x) {
          x.classList.add("is-active");
        }
      );
    } else {
      each(document.querySelectorAll(parent + " " + els), function (x) {
        x.classList.remove("is-active");
      });
      each(
        document.querySelectorAll(
          parent + " " + els + ":nth-child(" + indexConnected + ")"
        ),
        function (x) {
          x.classList.add("is-active");
        }
      );
    }
  }
  function addActive(els, amount) {
    if (amount === 1) {
      els.classList.add("is-active");
    } else if (amount === 2) {
      each(els, function (x) {
        x.classList.add("is-active");
      });
    }
  }
  function removeActive(els, amount) {
    if (amount === 1) {
      els.classList.remove("is-active");
    } else if (amount === 2) {
      each(els, function (x) {
        x.classList.remove("is-active");
      });
    }
  }
  function is(target, els){
    let counter = 0, isEl;

    each(els, function(x){
      if(isEl = target == x || x.contains(target)) counter++;
    })

    return counter ? true : false;
  }
  function length(els){
    return els.length;
  }
  function toggleConnectedClick(
    _this,
    parentClass,
    elsClass,
    connectedParentClass = null
  ) {
    let parent = _this.closest(parentClass),
      items = parent.querySelectorAll(elsClass),
      indexConnected = findIndex(_this, items) + 1,
      connectedClass = "." + _this.getAttribute("data-tgl-connect");

    removeActive(items, 2);
    toggleActive(_this);
    toggleConnected(connectedParentClass, connectedClass, indexConnected);
  }
  function toggleClick(_this, parentClass, elsClass) {
    let parent = _this.closest(parentClass),
      items = parent.querySelectorAll(elsClass);

    removeActive(items, 2);
    toggleActive(_this);
  }
  function toggleParent(_this, parentClass) {
    _this.closest(parentClass).classList.toggle("is-active");
  }
  function GTC(_this, parentSelector, buttonsSelector, connectedSelector) {
    let parent = _this.closest(parentSelector),
      buttons = parent.querySelectorAll(buttonsSelector),
      indexConnected = findIndex(_this, buttons) + 1,
      connectedElementss = parent.querySelectorAll(connectedSelector),
      connectedElement = parent.querySelector(
        connectedSelector + ":nth-child(" + indexConnected + ")"
      );

    removeActive(buttons, 2);
    removeActive(connectedElementss, 2);
    addActive(_this, 1);
    addActive(connectedElement, 1);
  }
  /**
   * ACD - Drop Down Toggle
   * Функция, открывающая/закрывающая accordeon/drop down
   * @return null
   */
  function ACD(_this, parentSelector, connectedSelector) {
    let parent = _this.closest(parentSelector),
      connectedElement = parent.querySelector(connectedSelector);

    toggleActive(_this, 1);
    toggleActive(connectedElement, 1);
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

    if(modal.classList.contains('M-cart')){
      modal.querySelector(".M-cart__wrapper").classList.add("is-active");
    }

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

    if(modal.classList.contains('M-cart')){
      modal.querySelector(".M-cart__wrapper").classList.remove("is-active");
    }

    if(activatedModals === 0){
      scroller.start();
    }

    scroller.start();
  }
  /**
   * Проверка инпутов в форме на заполнение и корректность введенных данных
   * @return null
   */
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
        }else if (x.classList.contains('promocode-mask-on')){
          if(x.value.length < 15){
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
  /**
   * Проверка корректности email
   * @return null
   */
  function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    return pattern.test(emailAddress);
  }
  function phoneMask(event) {
    var matrix = "+7 (___) - ___ - __ - __",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    if (def.length >= val.length) val = def;
    this.value = matrix.replace(/./g, function (a) {
      return /[_\d]/.test(a) && i < val.length
        ? val.charAt(i++)
        : i >= val.length
          ? ""
          : a;
    });
  }
  on("html", "input", ".tel-mask-on", phoneMask)
  on("html", "focus", ".tel-mask-on", phoneMask)
  on("html", "blur", ".tel-mask-on", phoneMask)

  function promocodeMask(event) {
    var matrix = "___ ___ ___ ___",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    if (def.length >= val.length) val = def;
    this.value = matrix.replace(/./g, function (a) {
      return /[_\d]/.test(a) && i < val.length
        ? val.charAt(i++)
        : i >= val.length
          ? ""
          : a;
    });
  }
  on("html", "input", ".promocode-mask-on", promocodeMask)
  on("html", "focus", ".promocode-mask-on", promocodeMask)
  on("html", "blur", ".promocode-mask-on", promocodeMask)


  if(document.querySelectorAll('figure.zoom')){
    addEventToEls('figure.zoom', 'mousemove', function(e){
      if(window.innerWidth> 960) {
        var zoomer = e.currentTarget;
        let offsetX, offsetY, x, y;

        e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
        e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
        x = offsetX / zoomer.offsetWidth * 100
        y = offsetY / zoomer.offsetHeight * 100
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
      }
    })
    addEventToEls('.s-fast-card__gallery', 'mousemove', function(e){
      if(window.innerWidth> 960) {
        var _this = e.currentTarget;
        let x, side;

        x = (e.clientX - _this.offsetLeft) / _this.offsetWidth * 100

        side = x > 50 ? 'r' : 'l';

        if(side == 'l') {
          _this.classList.add('zoom--left-hover')
          _this.classList.remove('zoom--right-hover')
        } else{
          _this.classList.add('zoom--right-hover')
          _this.classList.remove('zoom--left-hover')
        }
      }
    })
  }
  if(document.querySelectorAll('.s-fast-card__gallery-top')){
    addEventToEls('.s-fast-card__gallery-top', 'click', function(e){
      let parent = this, side, offsetX, offsetY, x, y;

      e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
      e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
      x = offsetX / parent.offsetWidth * 100
      y = offsetY / parent.offsetHeight * 100

      side = x > 50 ? 'r' : 'l';
      side == 'l' ? parent.querySelector('.s-fast-card__gallery-prev').click() : parent.querySelector('.s-fast-card__gallery-next').click()
    })
  }


/**
 * Locomotive плагин / Locomotive plugin
 */
  var scroller, scrolled = 0;

  window.addEventListener("load", function(){
    setHeaderMode(0);

    setTimeout(function(){
      scroller = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true
      });

      scroller.on('scroll', (args) => {
        scrolled = args.scroll.y;

        if(window.innerWidth> 960) {
          if (scrolled > 50 && scrolled > prevScroll) {
            header.classList.add("header-out");

            if(document.querySelector('.filters-line'))
              document.querySelector('.filters-line').classList.remove("header-showed");

            lastShowPos = scrolled;
          }
          else if (scrolled <= Math.max(lastShowPos - 50, 0)) {
            header.classList.remove("header-out");

            if(document.querySelector('.filters-line'))
              document.querySelector('.filters-line').classList.add("header-showed");

          }
        }

        prevScroll = scrolled;

        setHeaderMode(scrolled);
      })
    },200)

    //menu part
    var $menu = document.querySelector('.header-menu');

    addEventToEls('.header__m-menu-btn label', 'click', function() {
      if (!$menu.classList.contains('is-active')) {
        $menu.classList.add('is-active');

        header.classList.add("dark-mode");
      } else {
        $menu.classList.remove('is-active');

        header.classList.remove("dark-mode");
        each(document.querySelectorAll('section[data-header-mode], main[data-header-mode], footer[data-header-mode]'), function(x){
            if(x.offsetTop - header.offsetHeight / 2 < scrolled && x.offsetTop - header.offsetHeight / 2 + x.offsetHeight > scrolled){
              header.classList.add(x.getAttribute('data-header-mode'));
            }
        })
      }
    });
  });

// document.addEventListener("DOMContentLoaded", ready);

// function ready() {
// }
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
  each(document.querySelectorAll('.goods-slider-b'), function (x) {
    new Swiper(x, {
      spaceBetween: 31,
      slidesPerView: 4,
      breakpoints: {
        2000: {
          slidesPerView: 6,
          spaceBetween: 31,
        },
        1500: {
          slidesPerView: 4,
          spaceBetween: 31,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 31,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 31,
        },
        850: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        699: {
          slidesPerView: 2,
          spaceBetween: 24,
          slidesOffsetAfter: 0,
        },
        0: {
          slidesPerView: 2,
          spaceBetween: 0,
          slidesOffsetAfter: 0,
        },
      }
    });
  });
  each(document.querySelectorAll('.goods-card-a__img-slider'), function (x) {
    new Swiper(x, {
      spaceBetween: 0,
      slidesPerView: 1,
      allowTouchMove: false,
      pagination: {
        el: x.querySelector('.goods-card-a__pagination'),
        clickable: true,
      },
      breakpoints: {
        // when window width is >= 960px
        960: {
          allowTouchMove: false,
        },
        0: {
          // allowTouchMove: true,
          allowTouchMove: false,
        },
      }
    });
  });
  var sliderCart = new Swiper('.M-cart__goods-slider', {
    spaceBetween: 26,
    slidesPerView: 4,
    breakpoints: {
      2000: {
        slidesPerView: 6,
      },
      1500: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 26,
      },
      850: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      699: {
        slidesPerView: 2,
        spaceBetween: 24,
        slidesOffsetAfter: 0,
      },
      0: {
        slidesPerView: 1.85,
        spaceBetween: 27,
        slidesOffsetAfter: 16,
      },
    }
  });
  on('html', 'mouseover', '.swiper-pagination-bullet, .s-fast-card__gallery-thumbs .swiper-slide', function() {
    this.click();
  });

  var galleryThumbsCard = new Swiper('.s-fast-card__gallery-thumbs', {
    spaceBetween: 24,
    slidesPerView: 4,
    freeMode: false,
    // watchSlidesVisibility: true,
    // watchSlidesProgress: true,
    // slidesOffsetAfter: 62,
    // slidesOffsetBefore: 62,

    breakpoints: {
    },
  });
  new Swiper('.s-fast-card__gallery-top', {
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.s-fast-card__pagination',
      clickable: true,
    },
    thumbs: {
      swiper: galleryThumbsCard
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

function setHeaderMode(scrolled){
  if(document.querySelector('.header-menu.is-active'))
  return;

  header.classList.remove("dark-mode");
  each(document.querySelectorAll('section[data-header-mode], main[data-header-mode], footer[data-header-mode]'), function(x){
      if(x.offsetTop - header.offsetHeight / 2 < scrolled && x.offsetTop - header.offsetHeight / 2 + x.offsetHeight > scrolled){
        header.classList.add(x.getAttribute('data-header-mode'));
      }
  })
}


addEventToEls("[data-ACCORDEON-trigger]", "click", function (e) {
  let _this = this,
    target = e.target,
    parent = _this.parentNode,
    isActive = parent.classList.contains('is-active');

  if(isActive && parent.querySelector('[data-ACCORDEON-toggled]').contains(target) && parent.classList.contains('is-active'))
    return 0;

  closeAccordeons('[data-ACCORDEON]');

  if(isActive) return 0;

  toggleAccordeon(parent);
});

function toggleAccordeon(el){
  toggleActive(el);
  toggleActive(el.querySelectorAll('[data-ACCORDEON-button]'), 2);
  toggleActive(el.querySelector('[data-ACCORDEON-toggled]'), 1);
}
function closeAccordeons(el){
  each(el, function(x){
    removeActive(x, 1);
    removeActive(x.querySelectorAll('[data-ACCORDEON-button]'), 2);
    removeActive(x.querySelector('[data-ACCORDEON-toggled]'), 1);
  })
}

window.addEventListener('mouseup', e => {
  // var div = document.querySelector('.dd-select__toggled');
  // if (!div === e.target // если клик был не по нашему блоку
  //     && div.querySelector(e.target).length === 0) { // и не по его дочерним элементам
  //       each('.dd-select__select-panel[data-ACCORDEON].is-active [data-ACCORDEON-trigger]', function(x){
  //       x.click();
  //     });
  // }

  // div = document.querySelectorAll('.dd-filter-menu');
  // if (!div === e.target // если клик был не по нашему блоку
  //     && div.querySelector(e.target).length === 0) { // и не по его дочерним элементам
  //       each('.s-goods-list__filter[data-ACCORDEON].is-active .select-panel__wrapper.is-active[data-ACCORDEON-trigger]', function(x){
  //       x.click();
  //     });
  // }
});


var stepsSlider = document.querySelectorAll('.range-slider__item');


each(stepsSlider, function(x){
  let input0 = x.closest('.range-slider').querySelector('.js-input-from'),
      input1 = x.closest('.range-slider').querySelector('.js-input-to'),
      inputs = [input0, input1];

  noUiSlider.create(x, {
      start: [0, 150000],
      connect: true,
      range: {
        'min': [0],
        'max': 150000
      }
  });

  x.noUiSlider.on('update', function (values, handle) {
      inputs[handle].value = parseInt(values[handle]);
  });


  // Listen to keydown events on the input field.
  inputs.forEach(function (input, handle) {

    input.addEventListener('change', function () {
      x.noUiSlider.setHandle(handle, this.value);
    });

    input.addEventListener('keydown', function (e) {

        var values = x.noUiSlider.get();
        var value = Number(values[handle]);

        // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
        var steps = x.noUiSlider.steps();

        // [down, up]
        var step = steps[handle];

        var position;

        // 13 is enter,
        // 38 is key up,
        // 40 is key down.
        switch (e.which) {

            case 13:
                x.noUiSlider.setHandle(handle, this.value);
                break;

            case 38:

                // Get step to go increase slider value (up)
                position = step[1];

                // false = no step is set
                if (position === false) {
                    position = 1;
                }

                // null = edge of slider
                if (position !== null) {
                    x.noUiSlider.setHandle(handle, value + position);
                }

                break;

            case 40:

                position = step[0];

                if (position === false) {
                    position = 1;
                }

                if (position !== null) {
                    x.noUiSlider.setHandle(handle, value - position);
                }

                break;
        }
    });
  });

})



/* MAPBOX GL JS */
document.addEventListener('click', e => {
  let target = e.target;

  let isCustomSelect = is(target, '.custom-select'),
      customSelectActive = length(document.querySelectorAll('.custom-select.is-active'));

  if(!isCustomSelect && customSelectActive)
    closeAccordeons(document.querySelectorAll('.custom-select.is-active'));
})

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuYXpveiIsImEiOiJja3A3NjAwdnAyd3NnMnhtYzFvNmJmdHM4In0.E4W_2RKTiJgXcTFoOmzPtQ';

if(document.querySelectorAll('.s-location-map__map').length > 0){
  let geojson, locationMap;

  geojson = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [30.3141, 59.9386]
        },
        'properties': {
          'src': '44.jpg',
          'location': 'Невский пр. 33',
          'floor': '1 этаж',
          'worktime': 'Пн-сб: 12-18'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [30.4141, 59.9696]
        },
        'properties': {
          'src': '44.jpg',
          'location': 'Богатырский пр. 11',
          'floor': '2 этаж',
          'worktime': 'Пн-пт: 11-19'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [37.6156, 55.7522]
        },
        'properties': {
          'src': '44.jpg',
          'location': 'Пионерская 44',
          'floor': '3 этаж',
          'worktime': 'Пн-вс: 11-21'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [37.9156, 55.7522]
        },
        'properties': {
          'src': '44.jpg',
          'location': 'Невский пр. 74-76',
          'floor': '4 этаж',
          'worktime': 'Пн-вс: 12-21'
        }
      }
    ]
  };

  locationMap = new mapboxgl.Map({
    container: 's-location-map__map',
    style: 'mapbox://styles/genazoz/ckp763snf076g17oacew3dwr7',
    center: [30.3141, 59.9386],
    zoom: 10.8,
    scrollZoom: false,
  });
  locationMap.boxZoom.disable();

  geojson.features.forEach(function (marker) {
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<div class="map-popup">
          <div class="map-popup__img-wrapper">
            <img src="` + images[marker.properties.src]  +  `">
          </div>
          <div class="map-popup__info">
            <h3 class="map-popup__info-title">
          ` + marker.properties.location + `<hr>` + marker.properties.floor +
            `</h3>
            <p class="map-popup__info-subtitle">
          ` + marker.properties.worktime +
            `</p>
          </div>
        </div>`
      )
    )
    .addTo(locationMap);
  });

  on('html', 'click', '.s-location-map__locations-city', function(e){
    let x = this.getAttribute('coord-x'), y = this.getAttribute('coord-y');

    locationMap.flyTo({
      center: [x, y],
      zoom: 10.8,
      speed: 2,
    });
  })
}
/*  MAPBOX GL JS */


 on('html',  'click', '.quantity-toggle__button', function(){
  let parent = this.closest('.quantity-toggle'),
      input = parent.querySelector('.quantity-toggle__input'),
      num = parseInt(input.getAttribute('value')),
      buttonPlus = this.classList.contains('quantity-toggle__button--plus');

  if(num < 99 && buttonPlus)
    input.setAttribute('value', ++num);

  if(num > 1 && !buttonPlus)
    input.setAttribute('value', --num);

  if(num === 99 || num === 1){
    this.classList.add('is-disabled');
  } else{
    each(parent.querySelectorAll('.quantity-toggle__button'), function(x){
      x.classList.remove('is-disabled');
    });
  }
})

/* TIPPY JS */
tippy('[data-tippy-a]', {
  arrow: false,
  placement: "bottom",
  theme: "tippy-theme-a"
});
/* TIPPY JS */



addEventToEls('.s-fast-card__accordeon-header', 'click', function(event){
  var container = this.parentNode.querySelector('.s-fast-card__accordeon-content');

  if (!container.classList.contains('is-active')) {
    container.style.height = '0px';

    container.addEventListener('transitionend', function () {
      container.classList.remove('is-active');
    }, { once: true });
  } else {
    container.style.height = 'auto';

    var height = container.clientHeight + 24 + 'px';

    each(container.closest('.s-fast-card__accordeons-wrapper').querySelectorAll('.s-fast-card__accordeon-content'), function(x){
      x.style.height = '0';
    });

    setTimeout(function () {
      container.style.height = height;
    }, 0);
  }
});
