var myFullpage = new fullpage('#fullpage', {
  // sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff'],
  navigation: true,
  scrollingSpeed: 800,
  easingcss3: 'cubic-bezier(.85,.01,.2,.99)',
  verticalCentered: true,
	onLeave: function(origin, destination, direction){
    var sectionIndex = destination.index,
      element = $('.background'),
      protein = $('.image-wrapper');
    if(sectionIndex != 0){
      protein.attr('hide', '');
      setTimeout(function(){
        element.attr('active', '');
      },50)
    }
    else{
      setTimeout(function(){
        element.attr('active', null);
      }, 300)
      protein.attr('hide', null);
    }
  },
});
myFullpage.setMouseWheelScrolling(false);
myFullpage.setAllowScrolling(false);


const ease = {
    exponentialIn: (t) => {
      return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
    },
    exponentialOut: (t) => {
      return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
    },
    exponentialInOut: (t) => {
      return t == 0.0 || t == 1.0
        ? t
        : t < 0.5
          ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
          : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
    },
    sineOut: (t) => {
      const HALF_PI = 1.5707963267948966;
      return Math.sin(t * HALF_PI);
    },
    circularInOut: (t) => {
      return t < 0.5
          ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
          : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
    },
    cubicIn: (t) => {
      return t * t * t;
    },
    cubicOut: (t) => {
      const f = t - 1.0;
      return f * f * f + 1.0;
    },
    cubicInOut: (t) => {
      return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    },
    quadraticOut: (t) => {
      return -t * (t - 2.0);
    },
    quarticOut: (t) => {
      return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    },
  }
  
class ShapeOverlays {
    constructor(elm) {
      this.elm = elm;
      this.path = elm.querySelectorAll('path');
      this.numPoints = 5;
      this.duration = 600;
      this.delayPointsArray = [];
      this.delayPointsMax = 230;
      this.delayPerPath = 90;
      this.timeStart = Date.now();
      this.isOpened = true;
      this.isAnimating = false;
    }
    toggle() {
      this.isAnimating = true;
      const range = Math.random() * Math.PI * 2;
      for (var i = 0; i < this.numPoints; i++) {
        const radian = (i / (this.numPoints - 1)) * Math.PI * 2;
        this.delayPointsArray[i] = (Math.sin(radian + range) + 1) / 2 * this.delayPointsMax;
      }
      if (this.isOpened === false) {
        this.open();
      } else {
        this.close();
      }
    }
    open() {
      this.isOpened = true;
      this.elm.classList.add('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
    close() {
      this.isOpened = false;
      this.elm.classList.remove('is-opened');
      this.timeStart = Date.now();
      this.renderLoop();
    }
    updatePath(time) {
      const points = [];
      for (var i = 0; i < this.numPoints; i++) {
        points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
      }
  
      let str = '';
      str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
      for (var i = 0; i < this.numPoints - 1; i++) {
        const p = (i + 1) / (this.numPoints - 1) * 100;
        const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
        str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
      }
      str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
      return str;
    }
    render() {
      if (this.isOpened) {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
        }
      } else {
        for (var i = 0; i < this.path.length; i++) {
          this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
        }
      }
    }
    renderLoop() {
      this.render();
      if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
        requestAnimationFrame(() => {
          this.renderLoop();
        });
      }
      else {
        this.isAnimating = false;
      }
    }
  }
  
  
$(window).on('load', function(){
  const elmOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elmOverlay);
  $('.button.wc-forward').text('В корзину');
  // (function() {
  //   const elmHamburger = document.querySelector('.hamburger');
  //   const gNavItems = document.querySelectorAll('.global-menu__item');
  //   elmHamburger.addEventListener('click', () => {
  //     if (overlay.isAnimating) {
  //       return false;
  //     }
  //     overlay.toggle();
  //     if (overlay.isOpened === true) {
  //       elmHamburger.classList.add('is-opened-navi');
  //       for (var i = 0; i < gNavItems.length; i++) {
  //         gNavItems[i].classList.add('is-opened');
  //       }
  //     } else {
  //       elmHamburger.classList.remove('is-opened-navi');
  //       for (var i = 0; i < gNavItems.length; i++) {
  //         gNavItems[i].classList.remove('is-opened');
  //       }
  //     }
  //   });
  // }());

    
  $(".loading-page .counter h1").css('opacity','1');
  var counter = 0;
  var c = 0;
  var i = setInterval(function() {
      $(".loading-page .counter h1").html(c);
      $(".loading-page").css("width", c + "%");
      counter++;
      c++;
      if(counter == 85) {
        var styles = {
            opacity: 0,
            pointerEvents: 'none',
        }
        $(".loading-page").css(styles);
      }
      if(counter == 95){
        clearInterval(i);
        overlay.toggle();
        $('.shape-overlays').css('background','transparent');
        setTimeout(function(){
          myFullpage.setMouseWheelScrolling(true);
          myFullpage.setAllowScrolling(true);
        }, 200)
      }
  }, 10);
  })


$(document).on("mousemove",function(e) {
  if(window.innerWidth < 1100)
  {
    $("img[alt='protein']").attr("style", null);
    $(".circle-wrapper").attr("style", null);
    return 0;
  }
  var ax = -($(window).innerWidth()/2- e.pageX)/80;
  var ay = -($(window).innerHeight()/2- e.pageY)/80;
  var ax1 = -($(window).innerWidth()/2- e.pageX)/40;
  var ay1 = -($(window).innerHeight()/2- e.pageY)/40;
    $("img[alt='protein']").attr("style", "transform: translateY("+ay+"px) translateX("+ax+"px);-webkit-transform: translateY("+ay+"px) translateX("+ax+"px);-moz-transform: translateY("+ay+"px) translateX("+ax+"px)");
    $(".circle-wrapper").attr("style", "transform: translateY("+ay1+"px) translateX("+ax1+"px);-webkit-transform: translateY("+ay1+"px) translateX("+ax1+"px);-moz-transform: translateY("+ay+"px) translateX("+ax+"px)");
});

$('.subscribe-input button').mouseenter(function(){
  var protein = $('.image-wrapper_protein');
  $('.image-wrapper_circle').attr('active','');
  $('header').attr('hide','');
  protein.attr('hide', '');
})
$('.subscribe-input button').mouseleave(function(){
  var protein = $('.image-wrapper_protein');
  $('header').attr('hide',null);
  $('.image-wrapper_circle').attr('active',null);
  protein.attr('hide', null);
})

$(document).ready(function(){
  $('.goods-wrapper').slick({
    slidesToShow: 4,
    infinite: true,
    speed: 300,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1
        }
      }
    ]
  });
});

$('.header__cart').on('click', function(event){
  $('.cart-menu-wrapper').attr('active', '');
  myFullpage.setMouseWheelScrolling(false);
  myFullpage.setAllowScrolling(false);
})
$('.cart-menu-wrapper').on('click', function(){
  if($(event.target).attr('class') == $(this).attr('class')){
    $(this).attr('active', null);
    myFullpage.setMouseWheelScrolling(true);
    myFullpage.setAllowScrolling(true);
  }
})

