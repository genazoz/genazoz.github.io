"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isDesktop() {
  return window.innerWidth > 1100 ? 1 : 0;
}function setCookie(name, value, time) {
  var date = new Date();date.setTime(date.getTime() + 1e6 * time), document.cookie = name + "=" + value + "; expires=" + date.toUTCString();
}function get_cookie(cookie_name) {
  var results = document.cookie.match("(^|;) ?" + cookie_name + "=([^;]*)(;|$)");return results ? unescape(results[2]) : null;
}
var interactiveGuide = function () {
  function interactiveGuide() {
    _classCallCheck(this, interactiveGuide);

    this.currentTip = 1, this.tipPos = 1, this.tipsAmount = $("[tip__position]").length - $('[tip__title="Описание проекта"]').length + 1, this.tip = $(".guide-tip"), this.tipTitle = this.tip.find(".guide-tip__title"), this.tipText = this.tip.find(".guide-tip__text"), this.tipCounter = this.tip.find(".guide-tip__selected-tip"), this.tipAmount = this.tip.find(".guide-tip__all-tip");
  }

  _createClass(interactiveGuide, [{
    key: "closeGuide",
    value: function closeGuide() {
      $(".slider-img").attr("brightness", null), this.tip.attr("active", null), $(".guide-cover").attr("active", null), this.currentTip = 1;
    }
  }, {
    key: "changeGuideCircle",
    value: function changeGuideCircle(currentTip) {
      var circleLeft = $('[tip__position="' + currentTip + '"]').offset().left - 10,
          circleTop = $('[tip__position="' + currentTip + '"]').offset().top - 10,
          circleWidth = $('[tip__position="' + currentTip + '"]').innerWidth() + 20 + "px",
          circleHeight = $('[tip__position="' + currentTip + '"]').innerHeight() + 20 + "px";this.currentTip === $('[tip__title="Проекты"]').attr("tip__position") && (circleWidth = $('[tip__position="' + currentTip + '"][active]').innerWidth() + 20 + "px", circleHeight = $('[tip__position="' + currentTip + '"][active]').innerHeight() + 20 + "px"), $(".guide-cover .before .border").css("width", "calc((100vw + 100vh)*2 + " + circleWidth + ")").css("height", "calc((100vw + 100vh)*2 + " + circleHeight + ")"), $(".guide-cover .before").css("width", circleWidth).css("height", circleHeight).css("top", circleTop).css("left", circleLeft);
    }
  }, {
    key: "switchParameters",
    value: function switchParameters(currentTip, tipEl) {
      var tipLeft, tipTop;switch (this.currentTip) {case 1:
          tipLeft = tipEl.offset().left - this.tip.innerWidth() - 10, tipTop = tipEl.offset().top + tipEl.innerHeight() + 10;break;case 2:
          tipTop = $(window).innerHeight() - this.tip.innerHeight() - 40, tipLeft = 50;break;case 3:
          tipLeft = tipEl.offset().left + tipEl.innerWidth() + 15, tipTop = tipEl.offset().top + tipEl.innerHeight() + 15;break;case 4:
          tipLeft = tipEl.offset().left, tipTop = tipEl.offset().top - this.tip.innerHeight() - 25;break;case 5:
          tipLeft = $('[tip__position="' + this.currentTip + '"]').offset().left + 50, tipTop = $('[tip__position="' + this.currentTip + '"]').offset().top - this.tip.innerHeight() - 20;break;case 6:
          tipLeft = tipEl.offset().left - this.tip.innerWidth() - 10, tipTop = tipEl.offset().top - this.tip.innerHeight() - 10;break;case 7:
          tipLeft = tipEl.offset().left - this.tip.innerWidth() - 10, tipTop = tipEl.offset().top + tipEl.innerHeight() + 10;}return [tipLeft, tipTop];
    }
  }, {
    key: "moveGuideTip",
    value: function moveGuideTip(tipLeft, tipTop, currentTip, tipPos) {
      if (tipPos > this.tipsAmount) return this.closeGuide(), 0;tipPos <= this.tipsAmount && (this.tipCounter.text(tipPos), this.changeGuideCircle(currentTip)), 1 === currentTip ? (this.changeGuideCircle(currentTip), $(".guide-tip__prev-btn").hasClass("active") && $(".guide-tip__prev-btn").removeClass("active")) : currentTip > 1 && currentTip <= this.tipsAmount && !$(".guide-tip__prev-btn").hasClass("active") && $(".guide-tip__prev-btn").addClass("active"), this.tip.attr("active", ""), $(".guide-cover").attr("active", ""), this.tip.css("transform", "translateX(" + tipLeft + "px) translateY(" + tipTop + "px)");
    }
  }, {
    key: "nextTip",
    value: function nextTip() {
      this.currentTip++, this.tipPos++;for (var tipEl = $('[tip__position="' + this.currentTip + '"]'); 0 === tipEl.length;) {
        if (this.currentTip++, tipEl = $('[tip__position="' + this.currentTip + '"]'), this.currentTip > 15) return this.closeGuide(), 0;
      }this.tipTitle.text(tipEl.attr("tip__title")), this.tipText.text(tipEl.attr("tip__text"));var data = this.switchParameters(this.currentTip, tipEl),
          tipLeft = data[0],
          tipTop = data[1];this.moveGuideTip(tipLeft, tipTop, this.currentTip, this.tipPos);
    }
  }, {
    key: "prevTip",
    value: function prevTip() {
      this.currentTip--, this.tipPos--;for (var tipEl = $('[tip__position="' + this.currentTip + '"]'); 0 === tipEl.length;) {
        this.currentTip--, tipEl = $('[tip__position="' + this.currentTip + '"]'), this.currentTip <= 0 && this.closeGuide();
      }this.tipTitle.text(tipEl.attr("tip__title")), this.tipText.text(tipEl.attr("tip__text"));var data = this.switchParameters(this.currentTip, tipEl),
          tipLeft = data[0],
          tipTop = data[1];this.moveGuideTip(tipLeft, tipTop, this.currentTip, this.tipPos);
    }
  }, {
    key: "startTip",
    value: function startTip() {
      $(".slider-img").attr("brightness", ""), this.currentTip = 1, this.tipPos = 1;var tipEl = $('[tip__position="' + this.currentTip + '"]'),
          data = this.switchParameters(this.currentTip, tipEl),
          tipLeft = data[0],
          tipTop = data[1];$(".guide-tip__prev-btn").removeClass("active"), this.tipTitle.text(tipEl.attr("tip__title")), this.tipText.text(tipEl.attr("tip__text")), this.tipsAmount = "home" === $("section").attr("location") ? $("[tip__position]").length - $('[tip__title="Описание проекта"]').length + 1 : $("[tip__position]").length, this.tipCounter.text(this.currentTip), this.tipAmount.text(this.tipsAmount), this.moveGuideTip(tipLeft, tipTop, this.currentTip, this.tipPos);
    }
  }]);

  return interactiveGuide;
}();

var guide = new interactiveGuide();$(".guide-tip__next-btn").on("click", function () {
  guide.nextTip();
}), $(".guide-tip__prev-btn").on("click", function () {
  guide.prevTip();
}), $('.icon-wrapper_question[tip__title="Подсказки"]').on("click", function () {
  menu.isOpened() || 1 !== parseInt(get_cookie("mode")) || guide.startTip();
}), $(".guide-tip__close-btn").on("click", function () {
  guide.closeGuide();
}), $('.icon-wrapper_question[tip__title="Подсказки"]').on("mouseenter", function () {
  if (menu.isOpened() || 2 === parseInt(get_cookie("mode"))) return $('[tip__title="Подсказки"] .text').text("Недоступно"), $('[tip__title="Подсказки"]').attr("error", ""), 0;"Недоступно" === $('[tip__title="Подсказки"] .text').text() && $('[tip__title="Подсказки"] .text').text("Подсказки"), $('[tip__title="Подсказки"]').attr("error", null);
});
var mainMenu = function () {
  function mainMenu() {
    _classCallCheck(this, mainMenu);

    this.menuOpened = !1;
  }

  _createClass(mainMenu, [{
    key: "openMenu",
    value: function openMenu() {
      this.menuOpened = !0, $(".menu").addClass("active"), $(".menu-toggle").addClass("active"), $(".menu .text").show(), $(".menu .line-wrapper").addClass("active");
    }
  }, {
    key: "closeMenu",
    value: function closeMenu() {
      this.menuOpened = !1, $(".menu").removeClass("active"), $(".menu-toggle").removeClass("active"), $(".menu .line-wrapper").removeClass("active");
    }
  }, {
    key: "sectionScaleDown",
    value: function sectionScaleDown() {
      TweenMax.to("section", .1, { scale: .7, x: 0, opacity: .4, webkitFilter: "blur(30px)", transition: "1s transform, 1s opacity, 1s filter !important", height: "100vh", overflow: "hidden", pointerEvents: "none" });
    }
  }, {
    key: "sectionScaleUp",
    value: function sectionScaleUp() {
      TweenMax.to("section", .1, { scale: 1, x: 0, opacity: 1, webkitFilter: "blur(0px)", transition: "1s transform, 1s opacity, 1s filter !important", pointerEvents: "all" }), "project" === $("section").attr("location") && $(".menu .text").hide();
    }
  }, {
    key: "clickSound",
    value: function clickSound() {
      if (window.innerWidth > 1100) {
        var mySound = new Audio("static/audio/click01.mp3");mySound.volume = volume, mySound.play();
      }
    }
  }, {
    key: "pageHide",
    value: function pageHide(section) {
      var mX = 1.3 * -$(window).innerWidth();section ? (TweenMax.to("section." + section, .1, { scale: .7, opacity: .3, webkitFilter: "blur(0px)" }), TweenMax.to("section." + section, .1, { x: mX, opacity: 1 })) : (TweenMax.to("section", .1, { scale: .7, opacity: .3, webkitFilter: "blur(0px)" }), TweenMax.to("section", .1, { x: mX, opacity: 1 }).delay(.1));
    }
  }, {
    key: "togglePage",
    value: function togglePage(location, goto) {
      menu.menuOpened && this.closeMenu(), location === goto ? (this.sectionScaleUp(), "reviews" === location ? TweenMax.to(".flexRow_reviews-page", .1, { scale: 1, opacity: 1 }) : "contact" === location ? $(".menu .text").hide() : $(".menu .text").show()) : (isDesktop() && cursorLoading(), "reviews" === location && $(".flexRow_reviews-page").css("display", "none"), "contact" === goto && setTimeout(function () {
        $(".menu .text").hide();
      }, 1e3), this.pageHide());
    }
  }, {
    key: "goToProject",
    value: function goToProject() {
      isDesktop() && cursorLoading(), $("header").attr("project", ""), TweenMax.to(swiperContainer, .4, { css: { opacity: 0, x: -400, y: 0, z: 0 } }), TweenMax.to(counterWrap, .5, { css: { opacity: 0 } }), TweenMax.to(externalCaption, .5, { css: { opacity: 0 } }), TweenMax.to(imageSliderWrapper, .5, { css: { opacity: 0 }, delay: .5 });
    }
  }, {
    key: "isOpened",
    value: function isOpened() {
      return !0 === this.menuOpened;
    }
  }]);

  return mainMenu;
}();

var menu = new mainMenu();function cursorLoading() {
  var cursorLoad = $("#magic-cursor");$("#magic-cursor").hasClass("show-loader") ? setTimeout(function () {
    cursorLoad.one("animationiteration webkitAnimationIteration", function () {
      cursorLoad.removeClass("show-loader");
    });
  }, 500) : $("#magic-cursor").addClass("show-loader");
}function checkNavActive() {
  var nav = $(".nav_mobile"),
      menu = $(".menu_mobile"),
      cover = $(".menu_mobile__cover"),
      section = $("section");nav.attr("active") ? (section.attr("scale", null), nav.attr("active", null), menu.attr("active", null), cover.attr("active", null)) : (section.attr("scale", ""), nav.attr("active", "1"), menu.attr("active", ""), cover.attr("active", ""), $(".menu .text").show());
}if ($(document).ready(function () {
  $(".menu-toggle").on("click", function () {
    $(".menu-toggle").toggleClass("active");
  });
}), $("html").on("click", ".router-link", function () {
  isDesktop() && menu.clickSound();var goto = $(this).attr("goto");setTimeout(function () {
    $.html5Translate(dict, language);
  }, 200), "home" === goto ? ($(".icon-wrapper_mode:not(.icon-wrapper_mode-mobile)").attr("active", ""), setTimeout(function () {
    $("header").attr("project", null);
  }, 1400), $(".menu .text").show()) : $(".icon-wrapper_mode:not(.icon-wrapper_mode-mobile)").attr("active", null), "project" === goto && $(".home-grid").attr("active", null), "project" === goto ? menu.goToProject() : menu.togglePage($("section").attr("location"), goto);
}), $("html").on("click", ".about-show-button", function () {
  menu.closeMenu(), menu.clickSound(), $("header").attr("about", ""), setTimeout(function () {
    $(".section.about").attr("active", "");
  }, 400);
}), $("html").on("click", ".close-about-btn", function () {
  window.innerWidth > 1100 ? ($("header").attr("about", null), $(".section.about").attr("active", null), setTimeout(function () {
    menu.openMenu();
  }, 400)) : ($("header").attr("about", null), $(".section.about").attr("active", null), $(".menu_mobile").click());
}), $(".ring-btn").on("mouseenter", function () {
  ringBtnDiagram.animate(1);
}), $(".ring-btn").on("mouseleave", function () {
  ringBtnDiagram.animate(0);
}), $(".ring-btn").on("click", function () {
  isDesktop() && (menu.clickSound(), !0 === menu.menuOpened ? (menu.closeMenu(), menu.sectionScaleUp(), "reviews" === $("section").attr("location") && TweenMax.to(".flexRow_reviews-page", .1, { scale: 1, opacity: 1 })) : (menu.openMenu(), menu.sectionScaleDown(), "reviews" === $("section").attr("location") && TweenMax.to(".flexRow_reviews-page", .1, { scale: .7, opacity: 0 })));
}), $(".menu_mobile").on("click", function () {
  !0 === menu.menuOpened ? (menu.menuOpened = !1, menu.sectionScaleUp(), "reviews" === $("section").attr("location") && TweenMax.to(".flexRow_reviews-page", .1, { scale: 1, opacity: 1 })) : (menu.menuOpened = !0, menu.sectionScaleDown(), "reviews" === $("section").attr("location") && TweenMax.to(".flexRow_reviews-page", .1, { scale: .7, opacity: 0 }));
}), $(".menu_mobile, .nav_mobile a").on("click", function () {
  checkNavActive();
}), $(window).on("popstate", function () {
  "" !== location.hash.split("#!/")[1] && "" === window.location.hash && (menu.pageHide($("section").attr("location")), $("section").attr("location") ? $(".flexRow_reviews-page").css("display", "none") : $(".flexRow_reviews-page").css("display", "flex"));
}), $(document).on("blur", ".contact-form__input-wrapper input, textarea", function () {
  if (!$(this).val()) {
    var label = $(this).parent().find("label"),
        inputTitle = $(this).parent().find(".contact-form__input-title");TweenMax.to(inputTitle, .8, { css: { color: "rgba(255,255,255,.35)" } }), TweenMax.to(label, .8, { css: { width: "0%" } });
  }
}), $(document).on("focus", ".contact-form__input-wrapper input,textarea", function () {
  var label = $(this).parent().find("label"),
      inputTitle = $(this).parent().find(".contact-form__input-title");TweenMax.to(inputTitle, .8, { css: { color: "white" } }), TweenMax.to(label, .8, { css: { width: "100%" } });
}), $(window).on("load", function () {
  navigator.userAgent.search(/Safari/), navigator.userAgent.search(/Firefox/), navigator.userAgent.search(/MSIE/) > 0 || navigator.userAgent.search(/NET CLR /), navigator.userAgent.search(/Chrome/), navigator.userAgent.search(/YaBrowser/), navigator.userAgent.search(/OPR/), navigator.userAgent.search(/Konqueror/), navigator.userAgent.search(/Iceweasel/), navigator.userAgent.search(/SeaMonkey/), navigator.userAgent.search(/Edge/), setTimeout(function () {
    "home" == $("section").attr("location") && 1 !== windowLoading && location.reload();
  }, 100);
}), $(window).innerWidth() > 1100) {
  var equalizerClick = function equalizerClick() {
    var sound = null,
        liquid = $(".liquid-wrapper"),
        equalizer = $(".equalizer");switch (0 === $("#backgr-audio").length && screen.width > 1100 && ($("body").append("<audio id='backgr-audio' loop src='static/audio/Faded.mp3'></audio>"), (sound = document.getElementById("backgr-audio")).volume = volume, sound.play()), sound = document.getElementById("backgr-audio"), ~~equalizerActive) {case 0:
        document.getElementById("equalizer").classList.toggle("active"), equalizer.attr("active", ""), liquid.attr("active", ""), document.getElementsByTagName("audio").volume = volume, sound.volume = volume;break;case 1:
        liquid.attr("active", null), document.getElementById("equalizer").classList.toggle("active"), document.getElementsByTagName("audio").volume = 0, sound.volume = 0, equalizer.attr("active", null);}
  };

  var clickSound = function clickSound() {
    var mySound = new Audio("static/audio/click01.mp3");mySound.volume = volume, mySound.play();
  };

  var setFullscreen = function setFullscreen(body) {
    if (clickSound(), document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen();else {
      var el = document.documentElement;(el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen).call(el);
    }
  };

  var equalizerActive;$(window).on("load", function () {
    equalizerActive = $("#equalizer").hasClass("active"), $("#equalizer").on("click", function () {
      equalizerActive = $("#equalizer").hasClass("active"), equalizerClick();
    });
  });var e = { x: 0, y: 0 },
      t = { x: 0, y: 0 },
      n = .25,
      o = !1,
      a = document.getElementById("ball"),
      i = document.getElementById("ball-loader");TweenLite.set(a, { xPercent: -50, yPercent: -50 }), document.addEventListener("mousemove", function (t) {
    var n = window.pageYOffset || document.documentElement.scrollTop;e.x = t.pageX, e.y = t.pageY - n;
  }), TweenLite.ticker.addEventListener("tick", function () {
    o || (t.x += (e.x - t.x) * n, t.y += (e.y - t.y) * n, TweenLite.set(a, { x: t.x, y: t.y }));
  }), $(".magic-parallax").mouseenter(function (e) {
    TweenMax.to(this, .3, { scale: 2 }), TweenMax.to(a, .3, { scale: 2, borderWidth: "1px", opacity: .2 }), TweenMax.to(i, .3, { scale: 2, borderWidth: "1px", top: 1, left: 1 }), TweenMax.to($(this).children(), .3, { scale: .6 }), o = !0;
  }), $(".magic-parallax").mouseleave(function (e) {
    TweenMax.to(this, .3, { scale: 1 }), TweenMax.to(a, .3, { scale: 1, borderWidth: "2px", opacity: 1 }), TweenMax.to(i, .3, { scale: 1, borderWidth: "2px", top: 0, left: 0 }), TweenMax.to($(this).children(), .3, { scale: 1, x: 0, y: 0 }), o = !1;
  }), $(".magic-parallax").mousemove(function (e) {
    var n, i, l, r, d, s, p, h, u, w, f, m;n = e, i = this.getBoundingClientRect(), l = n.pageX - i.left, r = n.pageY - i.top, d = window.pageYOffset || document.documentElement.scrollTop, t.x = i.left + i.width / 2 + (l - i.width / 2) / 2, t.y = i.top + i.height / 2 + (r - i.height / 2 - d) / 2, TweenMax.to(a, .3, { x: t.x, y: t.y }), s = e, p = this, h = this.querySelector(".icon"), u = p.getBoundingClientRect(), w = s.pageX - u.left, f = s.pageY - u.top, m = window.pageYOffset || document.documentElement.scrollTop, TweenMax.to(h, .3, { x: (w - u.width / 2) / u.width * 20, y: (f - u.height / 2 - m) / u.height * 20, ease: Power2.easeOut });
  }), $(".hide-ball").mouseenter(function (e) {
    TweenMax.to("#ball", .2, { borderWidth: "1px", scale: 2, opacity: 0 });
  }), $(".hide-ball").mouseleave(function (e) {
    TweenMax.to("#ball", .3, { borderWidth: "2px", scale: 1, opacity: 1 });
  }), $(".link").mouseenter(function (e) {
    TweenMax.to("#ball", .2, { borderWidth: "0px", scale: 3, backgroundColor: "rgba(127, 127, 127, 1)", opacity: .15 });
  }), $(".link").mouseleave(function (e) {
    TweenMax.to("#ball", .3, { borderWidth: "2px", scale: 1, backgroundColor: "rgba(127, 127, 127, 0)", opacity: 1 });
  });
}