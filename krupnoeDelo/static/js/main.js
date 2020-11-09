/**
 * Настройки
 */
let activatedModals = 0,
    modalsArr = [],
    activatedMP = document.querySelectorAll('MP.active').length, 
    MWZindex = 112;


/**
 * Добавляет кроссбраузерный обработчик событий элементам
 * @return null
 */
function addEventToEls(els, evnt, func) {
    let objOrNo = typeof els === 'object';
    if(!objOrNo && els !== null){
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
 * ForEach по элементам
 * @return null
 */
function each(els, func){
    let objOrNo = typeof els === 'object';
    if(!objOrNo && els !== null){
        els = document.querySelectorAll(els);
    }
    els.forEach(function (x) {
        func(x);
    });
}

/**
 * Открывает / закрывает модальные окна
 * @return null
 */
function modalAnimate(modal){
    modal.classList.contains('active')?modalDisactivate(modal):modalActivate(modal);
}
function modalActivate(modal){
    modalsArr.push(modal);
    activatedModals++;
    modal.style.zIndex = MWZindex;
    MWZindex++;
    modal.classList.add('active');
    modal.setAttribute('data-active','');
    modal.querySelector('[data-modal-wrapper]').setAttribute('data-active','');
}
function modalDisactivate(modal){
    activatedModals--;
    MWZindex--;
    modalsArr.pop();
    modal.classList.remove('active');
    modal.removeAttribute('data-active');
    modal.querySelector('[data-modal-wrapper]').removeAttribute('data-active');
}
addEventToEls('[data-toggle-modal-btn]', 'click', function(event){

    let modal = this.getAttribute('data-switching-modal'),
        modalClass = '.' + modal;
    if(modal){
        modalAnimate(document.querySelector(modalClass));
    }
    else if(this.classList.contains('modal-window') || this.classList.contains('MW') || this.classList.contains('M')){
        if(event.target.className == this.getAttribute('class')){
            modalAnimate(this);
        }
    }
    else{
        modalAnimate(this.closest('.modal-window, .MW, .M'));
    }
})


/**
 * Внешний вид кнопок при нажатии/отведении мыши
 * @return null
 */
const filterDOM = document.querySelectorAll('.main__nav-panel .filter:not(.filter_priority-checkbox)');
addEventToEls(filterDOM, 'mouseup', function(event){
    each(filterDOM, function(x){x.classList.remove('active', 'press');})
    this.classList.add('active');
})
addEventToEls(filterDOM, 'mousedown', function(event){
    each(filterDOM, function(x){ x.classList.remove('press');})
    this.classList.add('press');
})
addEventToEls(filterDOM, 'mouseleave', function(event){
    each(filterDOM, function(x){ 
        if(x.classList.contains('press')){
        x.classList.remove('press');
    }})
})

const buttonDOM = document.querySelectorAll('button');
addEventToEls(buttonDOM, 'mouseup', function(event){
    each(buttonDOM, function(x){x.classList.remove('press');})
})
addEventToEls(buttonDOM, 'mousedown', function(event){
    each(buttonDOM, function(x){ x.classList.remove('press');})
    this.classList.add('press');
})
addEventToEls(buttonDOM, 'mouseleave', function(event){
    each(buttonDOM, function(x){x.classList.remove('press');})
})

const iconNavDOM = document.querySelector('.header__icon-nav'),
      navPanelDOM = document.querySelector('.main__nav-panel');
iconNavDOM.addEventListener('click',function(){
    this.classList.toggle('active');
    navPanelDOM.classList.toggle('active');
})

const priorityTgglDOM = document.querySelector('.filter_priority-checkbox'),
      priorityFltrDOM = document.querySelectorAll('.filter_priority');
priorityTgglDOM.addEventListener('click',function(){
    this.classList.toggle('active');
    each(priorityFltrDOM, function(x){ 
        x.classList.toggle('show');
    })
})

document.addEventListener('keyup', function(e) {
    if (e.key === "Escape") {
        if(modalsArr.length){
            var MW = modalsArr[modalsArr.length-1];
            modalDisactivate(MW);
        }
    }
    if(e.key === "Enter"){
        if(modalsArr.length){
            var MW = modalsArr[modalsArr.length-1];
            MW.querySelector('.button-success, [data-enter-clickable]').click();
        }
    }
});

/**
 * Проверка инпутов
 * @return int
 */
function checkForInputs(inputs) {
    /**
     * Обьявление переменных
     */
    let inputCheck = 1;


    /**
     * Проверка на заполнение
     */
    inputs.forEach(function (x) {
        if(x.getAttribute('type') == "select"){
            if(x.querySelector('option:nth-child(1):selected').length > 0){
                x.setAttribute('data-issue', '');
            }
        }else if (x.getAttribute('type') == "text" && !x.value || x.tagName == "TEXTAREA" && !x.value) {
            if(!x.classList.contains('non-binding'))
            {
                x.parentNode.setAttribute('data-issue', '');
                x.setAttribute('data-issue', '');
                inputCheck++;
            }
        }else{
            x.parentNode.removeAttribute('data-issue');
            x.removeAttribute('data-issue');
        }
    });
    
    return inputCheck;
}

addEventToEls(".M__create-btn, .M__edit-btn",'click', function(event){
    event.preventDefault();

    let inputs, 
        issueCounter; 
    
    inputs = this.closest('.M').querySelectorAll('input[type="text"],input[type="select"],textarea');
    issueCounter = checkForInputs(inputs);
    if(issueCounter > 0)
    return 0
})