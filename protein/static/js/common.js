
$('.header__search .fa-search').click(function(e){
    if(!$(this).hasClass('active'))
      e.preventDefault();
    var input = $(this).parent().find('input');
    input.focus();
    $(this).toggleClass('disactive');
    $('.header__search .fa-times').toggleClass('active');
    $('.header__search input').toggleClass('active');
  })
  
  $('.header__search .fa-times').click(function(e){
    e.preventDefault();
    var input = $(this).parent().find('input');
    if(input.val())
      input.val('')
    $(this).toggleClass('active');
    $('.header__search .fa-search').toggleClass('disactive');
    $('.header__search input').toggleClass('active');
  })
  
  $('.header__search input').keydown(function(e){
    if(e.key === "Enter"){
      $('.header__search .fa-search').addClass('active');
      $('.header__search .fa-search').click(); 
    }
    if (e.key === "Escape") { // escape key maps to keycode `27`
      $('.header__search .fa-times').click();
    }
  });
  
  $('a[href="http://wshop.loc/shop/"]').on('mouseenter',function(){
      $('header').attr('show-category', '');
  })
  $('header').on('mouseleave',function(){
      $('header').attr('show-category', null);
  })

  $(window).on('load', function(){
    $('.category-menu').children().each(function(){
      var height = 0;
      $(this).find('.cat-item, a').each(function(){
        height += parseInt($(this).outerHeight(true));
      })
      $(this).attr('style', 'height: ' + height + 'px');
    })
  })