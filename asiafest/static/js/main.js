$('.header-btn').bind('click',function () {
   $('header').toggleClass('mobile-active');
   $(this).toggleClass('mobile-active');
});
$('.custom-image-wrapper').children().bind('mouseenter',function () {
    if($(window).innerWidth()>1100)
    {
        var styles = {
            boxShadow: 'unset',
            width: '50%',
            height: '100%',
            zIndex: 0
        };
        $('.custom-image-wrapper').children().css(styles);
        $('.custom-image-wrapper').children().removeClass('disactive');
        
        var styles = {
            boxShadow: '0 0 100px rgba(0,0,0,.2)',
            width: '80%',
            height: '105%',
            zIndex: 2
        };
        $(this).css(styles);
        $('.custom-image-wrapper').children().addClass('disactive');
        $(this).removeClass('disactive');
    }
})
// $('.custom-image-wrapper').children().bind('mouseleave',function () {{
//     if($(window).innerWidth()>1100) {
//     }
//         var styles = {
//             boxShadow: 'unset',
//             width: '50%',
//             height: '100%',
//             zIndex: 0
//         };
//         $(this).css(styles);
//         $('.custom-image-wrapper').children().removeClass('disactive');
//     }})
// $(window).bind('scroll',function () {
//     if($(this).scrollTop()>$(window).innerHeight())
//     {
//         $('header').addClass('black');
//     }
//     else{
//         $('header').removeClass('black');
//     }
//     if($(this).scrollTop()>$(window).innerHeight()/7){
//         $('.preview__socials').addClass('black');
//     }else{
//         $('.preview__socials').removeClass('black');
//     }
// })
$(window).bind('load',function () {
   $('.img-wrapper').attr('style','background-image: url('+$('.img-wrapper').attr('url1')+')');
})
var guests = $('.guests').children().toArray(), curGuest = 1;
$('.guest-btn').bind('click',function () {
    if($(this).hasClass('next')){
       curGuest++;
    }
    else if($(this).hasClass('back')){
       curGuest--;
    }
    if(curGuest < 1){
       curGuest = guests.length;
    }
    else if(curGuest > guests.length){
       curGuest = 1;
    }
   guests.forEach(function (item) {
       item = $(item);
       item.attr('active',null);
       if(item.hasClass('guest'+curGuest)){
           item.attr('active','');
           $('.img-wrapper').attr('style','background-image: url('+$('.img-wrapper').attr('url'+curGuest)+')');
       }
   })
});
// $(window).bind('scroll',function () {
//    // var backgrPos = parseInt($(this).scrollTop())/2,
//        // titlePos = parseInt($(this).scrollTop())/2;
//    // $('.col.preview').attr('style','background-position: left '+-backgrPos+'% !important');
//    // $('.preview__h1').attr('style','transform: translateY('+titlePos+'px)');
// });
$('.header__nav li').bind('click',function () {
    $('html,body').animate({scrollTop: $($(this).attr('to')).offset().top-80}, 600);
    setTimeout(function(){
        $('header').toggleClass('mobile-active');
    },600)
});
var event = new Date(2020, 7, 9);
setInterval(function () {
    var remain = (event - new Date);
    var days = parseInt(remain/(1000*60*60*24)),
        hours = parseInt(remain/(1000*60*60)) - days*24, // = 23
        minutes = parseInt(remain/(1000*60)) - days*24*60 - hours*60,
        seconds = parseInt(remain/1000) - days*24*60*60 - hours*60*60 - minutes*60;
    $('.event-date-widget__date_days').find('.event-date-widget__num').text(days);
    $('.event-date-widget__date_days').find('.event-date-widget__text').text(getTrueDay(days));
    $('.event-date-widget__date_hours').find('.event-date-widget__num').text(hours);
    $('.event-date-widget__date_hours').find('.event-date-widget__text').text(getTrueHour(hours));
    $('.event-date-widget__date_minutes').find('.event-date-widget__num').text(minutes);
    $('.event-date-widget__date_minutes').find('.event-date-widget__text').text(getTrueMinute(minutes));
    $('.event-date-widget__date_seconds').find('.event-date-widget__num').text(seconds);
    $('.event-date-widget__date_seconds').find('.event-date-widget__text').text(getTrueSecond(seconds));
},1000)
function getTrueDay(num) {
    switch(num%10){
        case 1:
            return (num%100)==11?'дней':'день';
            break;
        case 0:case 5:case 6:case 7:case 8:case 9:
        return 'дней';
        break;
        case 2:case 3:case 4:
        let perc = (num%100);
        return perc==12||perc==13||perc==14?'дней':'дня';
        break;
    }
}
function getTrueHour(num) {
    switch(num%10){
        case 1:
            return (num%100)==11?'часов':'час';
            break;
        case 0:case 5:case 6:case 7:case 8:case 9:
        return 'часов';
        break;
        case 2:case 3:case 4:
        let perc = (num%100);
        return perc==12||perc==13||perc==14?'часов':'часа';
        break;
    }
}
function getTrueMinute(num) {
    switch(num%10){
        case 1:
            return (num%100)==11?'минут':'минута';
            break;
        case 0:case 5:case 6:case 7:case 8:case 9:
        return 'минут';
        break;
        case 2:case 3:case 4:
        let perc = (num%100);
        return perc==12||perc==13||perc==14?'минут':'минуты';
        break;
    }
}
function getTrueSecond(num) {
    switch(num%10){
        case 1:
            return (num%100)==11?'секунд':'секунда';
            break;
        case 0:case 5:case 6:case 7:case 8:case 9:
        return 'секунд';
        break;
        case 2:case 3:case 4:
        let perc = (num%100);
        return perc==12||perc==13||perc==14?'секунд':'секунды';
        break;
    }
}
$(window).on('scroll',function(){
    if($(window).innerWidth()>1100 && $(window).innerWidth()<1901){
        if($(window).scrollTop()<$(window).innerHeight()-250){
            var scale = 1+parseInt($(window).scrollTop())/2000,
                scale2 = 1+parseInt($(window).scrollTop())/4500;
            $('.scale').attr('style','transform: scale('+scale+'); opacity: 1;');
            $('.h1-wrapper').attr('style','transform: scale('+scale2+'); opacity: 1;');
        }
    }
    if($(window).innerWidth()>1900){
        if($(window).scrollTop()<$(window).innerHeight()-400){
            var scale = 1+parseInt($(window).scrollTop())/2500,
                scale2 = 1+parseInt($(window).scrollTop())/4500;
            $('.scale').attr('style','transform: scale('+scale+'); opacity: 1;');
            $('.h1-wrapper').attr('style','transform: scale('+scale2+'); opacity: 1;');
        }}
})
$('.grayscale').appear();
// Когда класс class появляется в области видимости экрана срабатывает нужный нам код.
$('.grayscale').on('appear', function(event, $all_appeared_elements) {
     $(this).removeClass('grayscale');
});
$('.grayscale').on('disappear', function(event, $all_disappeared_elements) {
    $(this).addClass('grayscale');
});

/*--------------------------------------------------
    Grain effect settings
    Настройки эффекта зерна
---------------------------------------------------*/

var options = {
    "animate": false,
    "patternWidth": 600,
    "patternHeight": 600,
    "grainOpacity": 0.028,
    "grainDensity": 1,
    "grainWidth": 1,
    "grainHeight": 1
};

$(window).on('load',function () {
    if($(window).innerWidth()>1100){
        grained("#grain", options);
    }
});
