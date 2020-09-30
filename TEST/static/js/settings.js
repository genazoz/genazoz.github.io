"use strict";

if ($(window).innerWidth() > 1100) {
  var mySound,
      volume = .2,
      options = { animate: !0, patternWidth: 500, patternHeight: 500, grainOpacity: .07, grainDensity: 1, grainWidth: 1, grainHeight: 1 };$(window).on("load", function () {
    grained("#grain", options);
  }), $("body").easeScroll({ frameRate: 120, animationTime: 1100, stepSize: 70, keyboardSupport: !1, arrowScroll: 50, touchpadSupport: !1, fixedBackground: !1 });var ringBtnDiagram = new ProgressBar.Circle(ringBtnCircle, { strokeWidth: 2.5, easing: "easeOutExpo", duration: 1200, color: "rgba(250,250,250,1)", trailColor: "transparent", trailWidth: 0, step: function step(state, bar) {
      bar.path.setAttribute("stroke", "rgba(230,230,230,1)");
    } });
}