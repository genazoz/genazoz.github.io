TweenMax.to("section.about",.1,{x:0,scale:.7}),TweenMax.to("section.about div,h1,h2",.1,{y:"80px",opacity:"0"}),TweenMax.to("section.about",.1,{scale:1}).delay(1),TweenMax.to("section.about div,h1,h2",1.7,{y:"0px",opacity:"1",ease:Expo.easeOut}).delay(1),TweenMax.to("section.about",.1,{pointerEvents:"all"}).delay(1),setTimeout(function(){$("#magic-cursor").hasClass("show-loader")&&cursorLoading()},1100);