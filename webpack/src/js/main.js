import * as $ from 'jquery'
import slick from '@/js/libs/slick.min.js';
import Swiper from '@/js/libs/swiper.min.js';
import ionRangeSlider from '@/js/libs/ion.rangeSlider.min.js';
import '@/css/common'


/**
 * Настройки
 */
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
function ACD(_this, parentSelector, connectedSelector) {
  let parent = _this.closest(parentSelector),
    connectedElement = parent.querySelector(connectedSelector);

  toggleActive(_this, 1);
  toggleActive(connectedElement, 1);
}
// ACD - Drop Down Toggle - Функция, открывающая/закрывающая accordeon/drop down

/*--------------------------------------------------
        Общие настройки - Vars
    ---------------------------------------------------*/
const T = this,
  // breakpoint where swiper will be destroyed
  breakpoint = window.matchMedia("(max-width: 1300px)");

let sTeamSlider, sSimilarCases;

const breakpointChecker = function () {
  // if small viewport
  if (breakpoint.matches === false) {
    // clean up old instances and inline styles when available
    if (sTeamSlider !== undefined) sTeamSlider.destroy(true, true);

    if (sSimilarCases !== undefined) sSimilarCases.destroy(true, true);

    // or/and do nothing
    return;

    // else if a larger viewport
  } else if (breakpoint.matches === true) {
    // fire small viewport version of swiper
    return enableSwiper();
  }
};

const enableSwiper = function () {
  if (document.querySelector(".s-team__slider")) {
    sTeamSlider = new Swiper(".s-team__slider", {
      slidesPerView: 1.17,
      spaceBetween: 16,
      breakpoints: {
        0: {
          slidesPerView: 1.4,
          spaceBetween: 8,
          centeredSlides: true,
        },
        370: {
          slidesPerView: 1.3,
          centeredSlides: true,
        },
        420: {
          slidesPerView: 1.5,
          centeredSlides: true,
        },
        500: {
          slidesPerView: 1.7,
          centeredSlides: true,
        },
        600: {
          slidesPerView: 2,
          centeredSlides: true,
        },
        700: {
          slidesPerView: 3,
          centeredSlides: false,
        },
        960: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      },
    });
  }
  if (document.querySelector(".s-similar-cases__slider")) {
    sSimilarCases = new Swiper(".s-similar-cases__slider", {
      slidesPerView: 1,
      spaceBetween: 16,
      breakpoints: {
        0: {
          slidesPerView: 1.3,
          centeredSlides: true,
        },
        600: {
          slidesPerView: 1,
          centeredSlides: true,
        },
      },
    });
  }
};

// keep an eye on viewport size changes
breakpoint.addListener(breakpointChecker);

// kickstart
breakpointChecker();

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
}

on("html", "click", "[data-toggle-modal-btn]", function (event) {
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

function mask(event) {
  var matrix = "_ (___) - ___ - __ - __",
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
var input = document.querySelectorAll(".tel-mask-on");
addEventToEls(input, "input", mask);
addEventToEls(input, "focus", mask);
addEventToEls(input, "blur", mask);

if (document.querySelector(".check-inputs-btn")) {
  addEventToEls(".check-inputs-btn", "click", function () {
    var issue = checkForInputs(
      this.closest(".check-inputs-container").querySelectorAll(
        "input, select, textarea"
      )
    );

    if (issue === 999) return 0;
    if (issue > 0) {
      this.classList.add("issue");
    } else {
      this.classList.remove("issue");
    }
  });
}

// Проверка инпутов
function checkForInputs(inputs) {
  /**
   * Если время, отведенное на ошибку, еще не прошло, то прекращаем выполнение скрипта
   */
  if (
    document.querySelectorAll("input.issue, textarea.issue, select.issue")
      .length > 0
  )
    return 999;
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
        x.setAttribute("issue", "");
        inputCheck++;
      }
    } else if (!x.value && !x.classList.contains("non-binding")) {
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
// Проверка инпутов
function checkForInputsStepMenu(inputs) {
  /**
   * Обьявление переменных
   */
  var inputCheck = 0;

  /**
   * Проверка на заполнение
   */

  inputs.forEach(function (x) {
    if (x.tagName == "SELECT") {
      if (x.selectedIndex === 0) inputCheck++;
    }
    if (x.tagName == "INPUT") {
      if (x.getAttribute("type") === "checkbox") {
        if (!x.checked) inputCheck++;
      } else if (!x.value && !x.classList.contains("non-binding")) {
        inputCheck++;
      }
    }
  });

  return inputCheck;
}

addEventToEls(".toggle-menu__item", "click", function () {
  let _this = this,
    parentClass = ".toggle-menu",
    elsClass = ".toggle-menu__item";

  toggleConnectedClick(_this, parentClass, elsClass);
});
addEventToEls("[data-GTC-button]", "click", function () {
  let _this = this,
    globalParent = "[data-GTC-container]",
    buttonsSelector = "[data-GTC-button]",
    connectedElements = "[data-GTC-content]";

  GTC(_this, globalParent, buttonsSelector, connectedElements);
  // GTC - generalToggleConnected - Функция, меняющая вкладки при переключении элементов меню (в случае, если у кнопок-переключателей общий родитель с пререключаемыми секциями)
});
addEventToEls(
  ".s-contact__alphabet-button[data-GTC-button]",
  "click",
  function () {
    let _this = this,
      globalParent = "[data-GTC-container]";
    (parent = _this.closest(globalParent)),
      (items = parent.querySelectorAll("[data-GTC-button]")),
      (index = findIndex(_this, items) + 1),
      (connectedElementss = parent.querySelectorAll("[data-GTC-content]"));

    if (index === 1) addActive(connectedElementss, 2);
    // GTC - generalToggleConnected - Функция, меняющая вкладки при переключении элементов меню (в случае, если у кнопок-переключателей общий родитель с пререключаемыми секциями)
  }
);
addEventToEls("[data-ACD-button]", "click", function () {
  let _this = this,
    globalParent = "[data-ACD-container]",
    connectedElement = "[data-ACD-content]";

  ACD(_this, globalParent, connectedElement);
});
addEventToEls(".M-filters__filter-toggle-button", "change", function () {
  let _this = this,
    parentClass = ".M-filters__filter";

  toggleParent(_this, parentClass);
});
addEventToEls(".s-card-info__like-wrapper", "click", function () {
  toggleActive(this);
});
addEventToEls("[data-ACCORDEON-trigger]", "click", function () {
  let _this = this,
    parentClass = "[data-ACCORDEON]",
    button = this.closest(parentClass).querySelectorAll('[data-ACCORDEON-button]'),
    toggled =  this.closest(parentClass).querySelector('[data-ACCORDEON-toggled]');

  toggleParent(_this, parentClass);
  toggleActive(button, 2);
  toggleActive(toggled);
});

// Search panel (show/hide buttons on hover/input)
addEventToEls(".search-panel__input", "focus", function () {
  let _this = this,
    parentClass = ".search-panel";

  _this.closest(parentClass).querySelector('.search-panel__voice-button').classList.add('is-hidden');
});
addEventToEls(".search-panel__input", "blur", function () {
  let _this = this,
    parentClass = ".search-panel",
    clearButton = _this.closest(parentClass).querySelector('.search-panel__clear-button');

    if(this.value == '' ||   this.value == this.defaultValue) {
      _this.closest(parentClass).querySelector('.search-panel__voice-button').classList.remove('is-hidden');
      clearButton.classList.remove('is-active');
    }
});
addEventToEls(".search-panel__input", "input", function () {
  let _this = this,
    parentClass = ".search-panel",
    clearButton = _this.closest(parentClass).querySelector('.search-panel__clear-button');

    if(!this.value == '' && !clearButton.classList.contains('is-active')){
      clearButton.classList.add('is-active');
    }else if(this.value == ''){
      clearButton.classList.remove('is-active');
    }
});
addEventToEls(".search-panel__clear-button", "click", function () {
  let _this = this,
    parent = _this.closest(".search-panel"),
    input = parent.querySelector('input[type="text"]');
    clearButton = parent.querySelector('.search-panel__clear-button'),
    voiceButton = parent.querySelector('.search-panel__voice-button');

  input.value = '';
  clearButton.classList.remove('is-active');
  voiceButton.classList.remove('is-hidden')
})
// Search panel (show/hide buttons on hover/input)

addEventToEls(".pagination__num", "click", function () {
  let _this = this,
    parentClass = ".pagination",
    elsClass = ".pagination__num";

  toggleClick(_this, parentClass, elsClass);
});

addEventToEls(
  ".main-menu__item:not(.main-menu__item-profile)",
  "click",
  function () {
    let _this = this,
      parentClass = ".main-menu",
      elsClass = ".main-menu__item:not(.main-menu__item-profile)";

    toggleClick(_this, parentClass, elsClass);
  }
);
addEventToEls(".main-menu__item-profile", "click", function () {
  let popup = document.querySelector(".popup-registration");

  if (this.classList.contains("is-active")) {
    removeActive(this, 1);
    removeActive(popup, 1);
  } else {
    addActive(this, 1);
    addActive(popup, 1);
  }
});
addEventToEls(".popup-registration__button-later", "click", function () {
  let mainMenuBTN = document.querySelector(".main-menu__item-profile");

  removeActive(mainMenuBTN, 1);
});
if (document.querySelector(".s-friends__slider")) {
  const ourFriendsSlider = new Swiper(".s-friends__slider", {
    breakpoints: {
      0: {
        slidesPerView: 1.17,
        spaceBetween: 24,
      },
      450: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      800: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1150: {
        slidesPerView: 5,
        spaceBetween: 32,
      },
      1250: {
        slidesPerView: 6,
        spaceBetween: 32,
      },
    },
  });
}
if (document.querySelector(".s-context-advertising__slider")) {
  const ourFriendsSlider = new Swiper(".s-context-advertising__slider", {
    breakpoints: {
      0: {
        slidesPerView: 1.3,
        spaceBetween: 16,
        centeredSlides: true,
      },
      450: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      800: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  });
}
if (document.querySelector(".s-cases__slider")) {
  const ourCasesSlider = new Swiper(".s-cases__slider", {
    breakpoints: {
      0: {
        slidesPerView: 1.3,
        spaceBetween: 16,
        centeredSlides: true,
      },
      400: {
        slidesPerView: 1.5,
        spaceBetween: 16,
        centeredSlides: true,
      },
      700: {
        slidesPerView: 2,
        spaceBetween: 32,
        centeredSlides: false,
      },
      960: {
        slidesPerView: 1,
        spaceBetween: 32,
        centeredSlides: false,
      },
    },
    navigation: {
      nextEl: ".s-cases__swiper-button-next",
      prevEl: ".s-cases__swiper-button-prev",
    },
    pagination: {
      el: ".s-cases__swiper-pagination",
    },
  });
}
var sQuizSliderIndex = 1;
if (document.querySelector(".s-quiz__slider")) {
  const quizSlider = new Swiper(".s-quiz__slider", {
    slidesPerView: 1,
    allowTouchMove: false,
    navigation: {
      nextEl: ".s-quiz__swiper-button-next",
      prevEl: ".s-quiz__swiper-button-prev",
    },
    pagination: {
      el: ".s-quiz__swiper-pagination",
    },
    on: {
      slideChange: function () {
        sQuizSliderIndex = this.realIndex + 1;

        document.querySelector(
          ".s-quiz__slide-counter-current"
        ).innerHTML = sQuizSliderIndex;

        if (
          parseInt(sQuizSliderIndex) ===
          parseInt(
            document.querySelectorAll(".s-quiz__slider-slide").length - 1
          )
        ) {
          let input = document.querySelector(
              ".s-quiz__slider-slide.check-inputs-container .custom-input__input"
            ),
            email = input.value;

          document.querySelector(".s-quiz__swiper-button-next").innerHTML =
            "Отправить";
          if (
            !document
              .querySelector(
                ".s-quiz__slider-slide.check-inputs-container .custom-input--type--a"
              )
              .classList.contains("is-active")
          ) {
            document
              .querySelector(".s-quiz__swiper-button-next")
              .classList.remove("is-disactive");
          } else if (email == 0 || !isValidEmailAddress(email)) {
            document
              .querySelector(".s-quiz__swiper-button-next")
              .classList.add("is-disactive");
          } else {
            document
              .querySelector(".s-quiz__swiper-button-next")
              .classList.remove("is-disactive");
          }
        } else if (
          parseInt(sQuizSliderIndex) ===
          parseInt(document.querySelectorAll(".s-quiz__slider-slide").length)
        ) {
          document
            .querySelector(".s-quiz__controls-panel")
            .classList.add("quiz-is-ended");
        } else {
          document.querySelector(".s-quiz__swiper-button-next").innerHTML =
            "Далее";
          document
            .querySelector(".s-quiz__swiper-button-next")
            .classList.remove("is-disactive");
        }
      },
    },
  });
}
addEventToEls(
  ".s-quiz__slider-slide.check-inputs-container .custom-input__input",
  "keyup",
  function () {
    let _this = this;
    if (
      _this
        .closest(".s-quiz__slider-slide.check-inputs-container")
        .classList.contains("swiper-slide-active")
    ) {
      let input = _this,
        email = input.value;
      if (email == 0 || !isValidEmailAddress(email)) {
        document
          .querySelector(".s-quiz__swiper-button-next")
          .classList.add("is-disactive");
      } else {
        document
          .querySelector(".s-quiz__swiper-button-next")
          .classList.remove("is-disactive");
      }
    }
  }
);
addEventToEls(".s-quiz__option.s-quiz__option--ico", "click", function () {
  setTimeout(function () {
    let input = document.querySelector(
        ".s-quiz__slider-slide.check-inputs-container .custom-input__input"
      ),
      email = input.value;

    if (
      !document
        .querySelector(
          ".s-quiz__slider-slide.check-inputs-container .custom-input--type--a"
        )
        .classList.contains("is-active")
    ) {
      document
        .querySelector(".s-quiz__swiper-button-next")
        .classList.remove("is-disactive");
    } else if (email == 0 || !isValidEmailAddress(email)) {
      document
        .querySelector(".s-quiz__swiper-button-next")
        .classList.add("is-disactive");
    } else {
      document
        .querySelector(".s-quiz__swiper-button-next")
        .classList.remove("is-disactive");
    }
  }, 30);
});

var sAdvantagesSlider,
  sAdvantagesSliderAutoplay = 3000,
  sAdvantagesSliderIndex = 1,
  sAdvantagesSliderIndexSecond = 1,
  sAdvantagesSliderIntervalId = null,
  sAdvantagesSliderTransitionTime = sAdvantagesSliderAutoplay / 1000;

$(".s-advantages__menu-progressline").css(
  "transition",
  sAdvantagesSliderTransitionTime + "s width, .2s opacity"
);

if (document.querySelector(".s-advantages__slider")) {
  sAdvantagesSlider = new Swiper(".s-advantages__slider", {
    slidesPerView: 1,
    autoplay: {
      delay: sAdvantagesSliderAutoplay,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".s-advantages__swiper-button-next",
      prevEl: ".s-advantages__swiper-button-prev",
    },
    loop: true,
    on: {
      slideChange: function () {
        $(".s-advantages__menu-progressline").css(
          "transition",
          "0s width, .2s opacity"
        );
        $(".s-advantages__menu-progressline").css("width", "0");
        setTimeout(function () {
          $(".s-advantages__menu-progressline").css(
            "transition",
            sAdvantagesSliderTransitionTime + "s width, .2s opacity"
          );
          $(".s-advantages__menu-progressline").css("width", "100%");
        }, 30);
        sAdvantagesSliderIndex = this.realIndex + 1;

        each(
          document.querySelectorAll(".s-advantages__menu-item"),
          function (x) {
            x.classList.remove("is-active");
          }
        );
        document
          .querySelector(
            ".s-advantages__menu-item:nth-child(" + sAdvantagesSliderIndex + ")"
          )
          .classList.add("is-active");
      },
      slideChangeTransitionStart: function () {
        sAdvantagesSliderIndexSecond = this.realIndex + 1;
      },
    },
  });
}

addEventToEls(".s-advantages__menu-item", "click", function () {
  let _this = this,
    parentClass = ".s-advantages__menu",
    elsClass = ".s-advantages__menu-item",
    thisIndex = findIndex(_this, document.querySelectorAll(elsClass));

  if (sAdvantagesSlider === null) return 0;

  sAdvantagesSlider.slideToLoop(thisIndex, 300);
  toggleClick(_this, parentClass, elsClass);
});
addEventToEls(".s-quiz__option", "click", function () {
  let _this = this,
    parentClass = ".s-quiz__options-wrapper",
    elsClass = ".s-quiz__option",
    items = document.querySelectorAll(".s-quiz__slider-slide"),
    parentIndex = findIndex(_this.closest(".s-quiz__slider-slide"), items) + 1,
    connectedParentClass =
      ".s-quiz__slider-slide:nth-child(" + parentIndex + ")";

  toggleConnectedClick(_this, parentClass, elsClass, connectedParentClass);

  _this.querySelector("input[type=radio]").checked = true;
});

function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  return pattern.test(emailAddress);
}
addEventToEls(
  ".footer__content-flexCol--toggled .footer__caption-p2",
  "click",
  function () {
    let _this = this,
      parentClass = ".footer__content-flexCol--toggled";

    toggleParent(_this, parentClass);
  }
);
addEventToEls(".popup__close-btn", "click", function () {
  let _this = this,
    parentClass = ".popup";
  toggleParent(_this, parentClass);
});

addEventToEls(".goods-card__like", "click", function () {
  toggleActive(this);
});
addEventToEls(
  ".s-delivery__toggle-menu .form-a__button[data-toggle-element]",
  "click",
  function () {
    toggleActive(this);
    toggleActive(
      this.parentNode.querySelector(
        ".s-delivery__form-a-toggle-container[data-toggle-element]"
      )
    );
  }
);

// Слайдеры на плагине Swiper / Swiper plugin sliders
if (document.querySelector(".dd-catalog-slider")) {
  each(document.querySelectorAll(".dd-catalog-slider"), function(x){
    let _this = x;
    let sliderHeaderCatalog = new Swiper(_this, {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: _this.querySelector('.dd-catalog-slider__button-next'),
        prevEl: _this.querySelector('.dd-catalog-slider__button-prev'),
      },
    });
  })
}
if (document.querySelector(".s-goods-a__slider")) {
  each(document.querySelectorAll(".s-goods-a__slider"), function(x){
    let _this = x;
    let sGoodsA = new Swiper(_this, {
      slidesPerView: 4,
      spaceBetween: 20,
      pagination: {
        el: _this.querySelector('.s-goods-a__slider-pagination'),
      },
      navigation: {
        nextEl: _this.closest('.s-goods-a__slider-wrapper').querySelector('.s-goods-a__slider-button-next'),
        prevEl: _this.closest('.s-goods-a__slider-wrapper').querySelector('.s-goods-a__slider-button-prev'),
      },
    });
  })
}

if (document.querySelector(".s-home-preview__slider")) {
  let sliderTypeA = new Swiper(".s-home-preview__slider", {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    pagination: {
      el: ".s-home-preview__slider-pagination",
    },
    navigation: {
      nextEl: '.s-home-preview__swiper-button-next',
      prevEl: '.s-home-preview__swiper-button-prev',
    },
  });
}
if (document.querySelector(".s-entity__slider")) {
  let sliderTypeA = new Swiper(".s-entity__slider", {
    slidesPerView: 1,
    spaceBetween: 16,
    pagination: {
      el: ".s-entity__slider-pagination",
    },
  });
}
if (document.querySelector(".s-style-blog__slider")) {
  let sliderTypeB = new Swiper(".s-style-blog__slider", {
    slidesPerView: 1.16,
    spaceBetween: 16,
    slidesOffsetAfter: 16,
  });
}
if (document.querySelector(".s-read-also__slider")) {
  let sliderTypeB = new Swiper(".s-read-also__slider", {
    slidesPerView: 1.16,
    spaceBetween: 16,
    slidesOffsetAfter: 16,
  });
}
if (document.querySelector(".s-other-news__slider")) {
  let sliderTypeB = new Swiper(".s-other-news__slider", {
    slidesPerView: 1.16,
    spaceBetween: 16,
    slidesOffsetAfter: 16,
  });
}
if (document.querySelector(".s-tricks__slider")) {
  let sliderTypeB = new Swiper(".s-tricks__slider", {
    slidesPerView: 1.48,
    spaceBetween: 16,
    slidesOffsetAfter: 16,
  });
}
if (document.querySelector(".s-our-friends__slider")) {
  let sliderOurFriends = new Swiper(".s-our-friends__slider", {
    slidesPerView: 1.95,
    spaceBetween: 40,
    slidesOffsetAfter: 16,
  });
}

// Слайдеры на плагине Slick / Slick plugin sliders
$('.s-card-preview__preview-slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: false,
  swipeToSlide: true,
  touchMove: false,
  asNavFor: '.s-card-preview__vertical-slider'
});
$(".s-card-preview__vertical-slider").slick({
  vertical: true,
  slidesToShow: 4,
  slidesToScroll: 2,
  swipeToSlide: true,
  touchMove: false,
  swipe: false,
  focusOnSelect: true,
  asNavFor: '.s-card-preview__preview-slider',
  prevArrow: $('.s-card-preview__vertical-slider-arrow-prev'),
  nextArrow: $('.s-card-preview__vertical-slider-arrow-next')
});

$('a[data-slide]').click(function(e) {
  e.preventDefault();
  var slideno = $(this).data('slide');
  $('.slider-nav').slick('slickGoTo', slideno - 1);
});

$(".range-panel").each(function () {
  var $range = $(this).find(".js-range-slider"),
    $inputFrom = $(this).find(".js-input-from"),
    $inputTo = $(this).find(".js-input-to"),
    instance,
    min = $inputFrom.val(),
    max = $inputTo.val(),
    from = $inputFrom.val(),
    to = $inputTo.val();

  $range.ionRangeSlider({
    skin: "round",
    type: "double",
    min: min,
    max: max,
    hide_min_max: true,
    hide_from_to: true,
    from: from,
    to: to,
    onStart: function (data) {
      from = this.from;
      to = this.to;

      $inputFrom.prop("value", from);
      $inputTo.prop("value", to);
    },
    onChange: function (data) {
      from = data.from;
      to = data.to;

      $inputFrom.prop("value", from);
      $inputTo.prop("value", to);
    },
  });
  instance = $range.data("ionRangeSlider");
  $inputFrom.on("input", function () {
    var val = $(this).prop("value");
    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val,
    });
  });
  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val,
    });
  });
});
addEventToEls(".header__search .search-panel", "click", function () {
  $(window).scrollTop(0);
  modalActivate(document.querySelector('.M-search'));
});

/**
 * Обеспечивает работу кастомного <input type="file">
 */
var inputs = document.querySelectorAll('.js-attach-file');

each(inputs, function(x){ customInput(x) })


function customInput (el) {
  let fileInput = el.querySelector('[type="file"]'),
      label = el.querySelector('[data-js-file-label]'),
      maxImgs = 4;

  fileInput.onchange = function () {
    let parent = this.closest('.attach-photo-gallery'),
        button = parent.querySelector('.attach-photo-gallery__button'),
        label = parent.querySelector('.attach-photo-gallery__label');

    if(parent.querySelector('.attach-photo-gallery__gallery-img-wrapper')){
      let imgLength = parent.querySelectorAll('.attach-photo-gallery__gallery-img-wrapper').length;

      if(imgLength && imgLength == parseInt(maxImgs-1)){
        button.classList.add('attach-photo-gallery__button--full')
        label.classList.add('attach-photo-gallery__label--full')
      }
      if(imgLength && imgLength >= maxImgs){
        return;
      }
    }

    if (!fileInput.value) return

    
    var value = fileInput.value.replace(/^.*[\\\/]/, '')
    el.className += ' -chosen'
    // label.innerText = value
    
    imagesPreview(this, 'div.attach-photo-gallery__gallery');
  }
}
function imagesPreview(input, placeToInsertImagePreview) {
  if (input.files) {
    var filesAmount = input.files.length;

    for (i = 0; i < filesAmount; i++) {
      var reader = new FileReader();

      reader.onload = function(event) {
        $($.parseHTML('<div>')).attr('class', 'attach-photo-gallery__gallery-img-wrapper').appendTo(input.closest('.attach-photo-gallery').querySelector(placeToInsertImagePreview));

        let imgWrapper = input.closest('.attach-photo-gallery').querySelector(placeToInsertImagePreview + ' .attach-photo-gallery__gallery-img-wrapper:nth-last-child(1)');

        $('<img src="' + event.target.result + '" />').appendTo(imgWrapper);
        $(`<div class="attach-photo-gallery__img-close-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="8" r="8" fill="white" />
            <path
              d="M11 5L5 11"
              stroke="#303E72"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 5L5 11"
              stroke="white"
              stroke-opacity="0.65"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 5L11 11"
              stroke="#303E72"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 5L11 11"
              stroke="white"
              stroke-opacity="0.65"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>`).appendTo(imgWrapper);
      }

      reader.readAsDataURL(input.files[i]);
    }
  }
};

on('html', 'click', '.attach-photo-gallery__img-close-btn', function(e) {
  let parent = this.closest('.attach-photo-gallery'),
      imgLength = parent.querySelectorAll('.attach-photo-gallery__gallery-img-wrapper').length,
      button = parent.querySelector('.attach-photo-gallery__button'),
      label = parent.querySelector('.attach-photo-gallery__label');

  if(imgLength >= 4){
    button.classList.remove('attach-photo-gallery__button--full')
    label.classList.remove('attach-photo-gallery__label--full')
  }

  this.closest('.attach-photo-gallery__gallery-img-wrapper').remove();
});
addEventToEls(".M-reset-password-email input[type='text']", "keyup", function () {
  let email = this.value;

  if (!email == 0 && isValidEmailAddress(email)) {
    this.closest('.M-reset-password-email').querySelector('.M-reset-password-email__success-button').classList.remove('is-disabled');
  }
  else{
    this.closest('.M-reset-password-email').querySelector('.M-reset-password-email__success-button').classList.add('is-disabled');
  }
});

addEventToEls(".M-reset-password-phone input[type='text']", "keyup", function () {
  let phone = this.value;

  if (!phone == 0) {
    this.closest('.M-reset-password-phone').querySelector('.M-reset-password-phone__success-button').classList.remove('is-disabled');
  }
  else{
    this.closest('.M-reset-password-phone').querySelector('.M-reset-password-phone__success-button').classList.add('is-disabled');
  }
});
addEventToEls('[data-switching-modal="M-reset-password-email"]', 'click', function () {
  document.querySelector('.M-reset-password-email input').focus();
})
addEventToEls('[data-switching-modal="M-reset-password-phone"]', 'click', function () {
  document.querySelector('.M-reset-password-phone input').focus();
})

addEventToEls('.quantity input', 'input', function () {
  this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');;  
})

window.addEventListener("resize", function() {
  let mainMenu = document.querySelector('.main-menu'),
      mainMenuTop = mainMenu.offsetTop;

      console.log(mainMenuTop)
  if(mainMenuTop < 200){
    mainMenu.classList.add('is-invisible');
  }
  else{
    mainMenu.classList.remove('is-invisible');
  }
})



/**
 * 
 *  Tippy 
 * 
 */

tippy('.input-panel__warning-ico-wrapper', {
  theme: 'pinskdrev',
  maxWidth: 177,  
  placement: 'right',
  offset: [0, 28],
});
tippy('.header__top-flexRow .link-ico, .header-mbl__link-ico', {
  interactive: true,
  content: `
    <p class="pp-region__text">Ваш регион: <b>Минск, Беларусь?</b></p>
    <div class="pp-region__buttons-wrapper">
      <button class="pp-region__success-button">Да</button>
      <button class="pp-region__change-button" data-toggle-modal-btn data-switching-modal="M-switch-region">Выбрать другой</button>
    </div>
  `,
  allowHTML: true,
  theme: 'pinskdrev-region',
  maxWidth: 255,  
  placement: 'top',
  offset: [0, 10],
});
tippy('.header__top-drop-down-phone, .header-mbl__content-drop-down-phone', {
  interactive: true,
  content: `
    <div class="flexCol">
      <a class="pp-telephone__item" href="tel: +375296055757">+375 (29) 605-57-57</a>
      <a class="pp-telephone__item" href="tel: +375298055757">+375 (29) 805-57-57</a>
    </div>
  `,
  allowHTML: true,
  theme: 'pinskdrev-telephone',
  maxWidth: 255,  
  placement: 'top',
  offset: [0, 10],
});

addEventToEls('.M-switch-region__country-list-item', 'click', function(){
  let parent = this.closest('.M-switch-region__country-list');

  removeActive(parent.querySelectorAll('.M-switch-region__country-list-item'), 2)
  addActive(this, 1);
})
$(document).mouseup(function (e){ // событие клика по веб-документу
  var div = $('.dd-select__toggled');
  if (!div.is(e.target) // если клик был не по нашему блоку
      && div.has(e.target).length === 0) { // и не по его дочерним элементам
        each('.dd-select__select-panel[data-ACCORDEON].is-active [data-ACCORDEON-trigger]', function(x){
        x.click();
      });
  }
  
  div = $('.dd-filter-menu');
  if (!div.is(e.target) // если клик был не по нашему блоку
      && div.has(e.target).length === 0) { // и не по его дочерним элементам
        each('.s-goods-list__filter[data-ACCORDEON].is-active .select-panel__wrapper.is-active[data-ACCORDEON-trigger]', function(x){
        x.click();
      });
  }
});