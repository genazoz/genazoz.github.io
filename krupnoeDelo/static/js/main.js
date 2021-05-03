/**
 * Настройки
 */
let activatedModals = 0,
    modalsArr = [],
    activatedMP = document.querySelectorAll('MP.active').length, 
    MWZindex = 112,
    editedTodoID;


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
    var sel = window.getSelection(),
    str = String(sel);
    if(str.length > 0)
        return 0;
    activatedModals--;
    MWZindex--;
    modalsArr.pop();
    modal.classList.remove('active');
    modal.removeAttribute('data-active');
    modal.querySelector('[data-modal-wrapper]').removeAttribute('data-active');
}

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

const buttonDOM = document.querySelectorAll('button, input[type=submit]');
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
    let inputCheck = 0;


    /**
     * Проверка на заполнение
     */
    inputs.forEach(function (x) {
        if (x.getAttribute('type') == "text" && !x.value) {
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
let issueCounter;
addEventToEls(".M [type=submit]",'click', function(event){
    let inputs;
    
    inputs = this.closest('.M').querySelectorAll('input[type="text"]');
    issueCounter = checkForInputs(inputs);
})

addEventToEls("form",'submit', function(event){
    event.preventDefault();

    if(issueCounter > 0)
        return 0

    document.querySelector('.M.active').click();
})


/**
 * 
 * Работа с тудушками
 *
 */

addEventToEls('.filter_done', 'click', function(){
    let todosChecked = document.querySelectorAll('.todo-item input[type=checkbox]:checked'),
        todoItems = document.querySelectorAll('.todo-item');
    each(todoItems, function(x){x.style.display = 'none';})
    each(todosChecked, function(x){x.closest('.todo-item').style.display = 'table-row';})
})

addEventToEls('.filter_all', 'click', function(){
    let todoItems = document.querySelectorAll('.todo-item');
    each(todoItems, function(x){x.style.display = 'table-row';})
})

addEventToEls('.filter_new', 'click', function(){
    let todosChecked = document.querySelectorAll('.todo-item_new'),
        todoItems = document.querySelectorAll('.todo-item');
    each(todoItems, function(x){x.style.display = 'none';})
    each(todosChecked, function(x){x.style.display = 'table-row';})
})

addEventToEls('.header__add-task', 'click', function(){
    let inputName   =  document.querySelector('.M_addTask input[type=text]'),
        inputDate   =  document.querySelector('.M_addTask input[type=datetime-local]'),
        markCircle  =  document.querySelector('.M_addTask input[type=color]'),
        markColor   =  document.querySelector('.M_addTask .M__custom-input_mark span'),
        textarea    =  document.querySelector('.M_addTask textarea');
    
    inputName.value     = null;
    inputDate.value     = null;
    markCircle.value    = null;
    markColor.innerHTML = '#000000';
    textarea.value      = null;
})

addEventToEls(".M_editTask [type=submit]",'click', function(event){
    /**
     * Инпуты, в которых будут заменяться данные
     */
    let inputName   =  document.querySelector('.M_editTask input[type=text]').value.trim(),
        inputDate   =  document.querySelector('.M_editTask input[type=datetime-local]').value.trim(),
        select      =  document.querySelector('.M_editTask select').options[document.querySelector('.M_editTask select').selectedIndex].text,
        selectVal   =  document.querySelector('.M_editTask select').options[document.querySelector('.M_editTask select').selectedIndex].value,
        markColor    =  document.querySelector('.M_editTask .M__custom-input_mark span').innerHTML,
        textarea    =  document.querySelector('.M_editTask textarea').value.trim();
    /**
    * Данные редактируемой тудушки
    */
    let id             =  editedTodoID,
        todo           =  document.querySelector('#' + id),
        name           =  todo.querySelector('.todo-item__title a'),
        deadlineDate   =  todo.querySelector('.todo-item__deadline span'),
        deadlineTime   =  todo.querySelector('.todo-item__deadline p'),
        T              =  inputDate.split('T')[0].split('-')[2], 
        M              =  inputDate.split('T')[0].split('-')[1], 
        Y              =  inputDate.split('T')[0].split('-')[0],
        H              =  inputDate.split('T')[1].split(':')[0],
        MN             =  inputDate.split('T')[1].split(':')[1],
        date           =  T + '.' + M + '.' + Y,
        time           =  H + ':' + MN,
        priority       =  todo.querySelector('.todo-item__priority span'),
        color          =  todo.querySelector('.todo-item__priority-indicator'),
        describtion    =  todo.querySelector('.todo-item__title p');
    name.innerHTML                    =  inputName;
    deadlineDate.innerHTML            =  date;
    deadlineTime.innerHTML            =  time;
    priority.innerHTML                =  select;
    todo.setAttribute('data-priority', selectVal);
    color.style.backgroundColor       =  markColor;
    describtion.innerHTML  = 
        textarea == ''
        ? '...' 
        : textarea.trim();
})

addEventToEls(".M_addTask [type=submit]",'click', function(event){
    /**
     * Инпуты, в которых будут заменяться данные
     */
    let id          =  document.querySelectorAll('.todo-item').length,
        inputName   =  document.querySelector('.M_addTask input[type=text]').value.trim(),
        inputDate   =  document.querySelector('.M_addTask input[type=datetime-local]').value.trim(),
        select      =  document.querySelector('.M_addTask select').options[document.querySelector('.M_addTask select').selectedIndex].text,
        selectVal   =  document.querySelector('.M_addTask select').options[document.querySelector('.M_addTask select').selectedIndex].value,
        markColor   =  document.querySelector('.M_addTask .M__custom-input_mark span').innerHTML,
        textarea  = 
            document.querySelector('.M_addTask textarea').value.trim() == ''
            ? '...' 
            :  document.querySelector('.M_addTask textarea').value.trim(),
        T           =  inputDate.split('T')[0].split('-')[2], 
        M           =  inputDate.split('T')[0].split('-')[1], 
        Y           =  inputDate.split('T')[0].split('-')[0],
        H           =  inputDate.split('T')[1].split(':')[0],
        MN          =  inputDate.split('T')[1].split(':')[1],
        date        =  T + '.' + M + '.' + Y,
        time        =  H + ':' + MN;

    document.querySelector('.filter_all').click();
    each(document.querySelectorAll('.main__nav-panel .filter:not(.filter_priority-checkbox)'),function(x){x.classList.remove('active');})

    document.querySelector('.filter_all').classList.add('active');

    document.getElementById('todos-wrapper').insertAdjacentHTML('afterbegin', `
        <tr class="todo-item todo-item_new" data-priority="` + selectVal + `" id="todo-item_` + id + `">
            <td class="todo-item__title">
                <div class="flexRow">
                    <div class="todo-item__checkbox-wrapper">
                        <input class="todo-item__checkbox" type="checkbox" />
                        <div style="background: ` + markColor + `;"
                            class="todo-item__priority-indicator"
                        ></div>
                    </div>
                    <div class="flexCol">
                        <a href="/krupnoeDelo/item.html">` + inputName + `</a>
                        <p>` + textarea + `</p>
                    </div>
                </div>
            </td>
            <td class="todo-item__deadline">
                <span>` + date + `</span>
                <p>` + time + `</p>
            </td>
            <td class="todo-item__priority">
                <span>` + select + `</span>
                <p></p> 
            </td>
            <td>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    data-toggle-todo-modal
                    data-switching-modal="M_editTask"
                >
                    <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.4142 1.41421C16.6332 0.633165 15.3668 0.633165 14.5858 1.41421L13.1716 2.82843L16.7071 6.36396L18.1213 4.94975C18.9024 4.1687 18.9024 2.90237 18.1213 2.12132L17.4142 1.41421ZM1.04539 15.4815L0.443651 19.0919L4.05408 18.4901C4.46526 18.4216 4.84474 18.2263 5.1395 17.9316L16 7.07107L12.4645 3.53553L1.60396 14.396C1.30921 14.6908 1.11392 15.0703 1.04539 15.4815Z"
                    fill="#333333"
                    />
                </svg>
            </td>
        </tr>`);
 
})

addEventToEls('[data-filtrate]', 'click', sortTodos);

document.getElementById('todos-wrapper').addEventListener('click', function(event){
    if(event.target.hasAttribute('data-toggle-todo-modal')){
        let modal = event.target.getAttribute('data-switching-modal'),
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

        ItemDataToModal(event.target.closest('.todo-item'));
    }
})

function sortTodos(){
    let todosList = document.querySelectorAll('.todo-item'),
        todosArray = [],
        parent = todosList[0].parentNode,
        dataSort = this.getAttribute('data-filtrate');
    each(todosList, function(x){
        todosArray.push(parent.removeChild(x));
    })
    each(todosArray.sort(function(x, x2) {
        var priority = x.getAttribute('data-priority');
        var priority2 = x2.getAttribute('data-priority');
        if(priority == dataSort && priority != priority2) {
            return -1;
        }
        else{
            return 0
        }
    }), function(x) {
        parent.appendChild(x)
    });
}

window.onload = function(){ 
    document.getElementById('todos-wrapper').insertAdjacentHTML('afterbegin', `
    <tr class="todo-item" data-priority="medium" id="todo-item_1">
        <td class="todo-item__title">
            <div class="flexRow">
                <div class="todo-item__checkbox-wrapper">
                    <input class="todo-item__checkbox" type="checkbox" />
                    <div style="background: #eb5757;"
                        class="todo-item__priority-indicator"
                    ></div>
                </div>
                <div class="flexCol">
                    <a href="/krupnoeDelo/item.html">Сходить в магазин </a>
                    <p>
                        Купить следующий список продуктов: Молоко, огурцы, рыбу...
                    </p>
                </div>
            </div>
        </td>
        <td class="todo-item__deadline">
            <span>29.09.2020</span>
            <p>18:32</p>
        </td>
        <td class="todo-item__priority">
            <span>Средний</span>
            <p></p> 
        </td>
        <td>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                data-toggle-todo-modal
                data-switching-modal="M_editTask"
            >
                <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.4142 1.41421C16.6332 0.633165 15.3668 0.633165 14.5858 1.41421L13.1716 2.82843L16.7071 6.36396L18.1213 4.94975C18.9024 4.1687 18.9024 2.90237 18.1213 2.12132L17.4142 1.41421ZM1.04539 15.4815L0.443651 19.0919L4.05408 18.4901C4.46526 18.4216 4.84474 18.2263 5.1395 17.9316L16 7.07107L12.4645 3.53553L1.60396 14.396C1.30921 14.6908 1.11392 15.0703 1.04539 15.4815Z"
                fill="#333333"
                />
            </svg>
        </td>
    </tr>
    <tr class="todo-item" data-priority="high" id="todo-item_2">
        <td class="todo-item__title">
            <div class="flexRow">
                <div class="todo-item__checkbox-wrapper">
                <input class="todo-item__checkbox" type="checkbox" />
                <div style="background: #f2c94c;"
                    class="todo-item__priority-indicator"
                ></div>
                </div>
                <div class="flexCol">
                <a href="/krupnoeDelo/item.html">Помыть машину </a>
                <p>...</p>
                </div>
            </div>
        </td>
        <td class="todo-item__deadline">
            <span>29.09.2020</span>
            <p>19:17</p>
        </td>
        <td class="todo-item__priority">
            <span>Высокий</span>
            <p></p>
        </td>
        <td>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                data-toggle-todo-modal
                data-switching-modal="M_editTask"
            >
                <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.4142 1.41421C16.6332 0.633165 15.3668 0.633165 14.5858 1.41421L13.1716 2.82843L16.7071 6.36396L18.1213 4.94975C18.9024 4.1687 18.9024 2.90237 18.1213 2.12132L17.4142 1.41421ZM1.04539 15.4815L0.443651 19.0919L4.05408 18.4901C4.46526 18.4216 4.84474 18.2263 5.1395 17.9316L16 7.07107L12.4645 3.53553L1.60396 14.396C1.30921 14.6908 1.11392 15.0703 1.04539 15.4815Z"
                fill="#333333"
                />
            </svg>
        </td>
    </tr>
    <tr class="todo-item" data-priority="low" id="todo-item_3">
        <td class="todo-item__title">
            <div class="flexRow">
                <div class="todo-item__checkbox-wrapper">
                    <input class="todo-item__checkbox" type="checkbox" />
                    <div style="background: #6fcf97;"
                        class="todo-item__priority-indicator"
                    ></div>
                </div>
                <div class="flexCol">
                    <a href="/krupnoeDelo/item.html">Ужин </a>
                    <p>Приготовить лазанью и Карбанару</p>
                </div>
            </div>
        </td>
        <td class="todo-item__deadline">
            <span>29.09.2020</span>
            <p>20:50</p>
        </td>
        <td class="todo-item__priority">
            <span>Низкий</span>
            <p></p> 
        </td>
        <td>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                data-toggle-todo-modal
                data-switching-modal="M_editTask"
            >
                <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.4142 1.41421C16.6332 0.633165 15.3668 0.633165 14.5858 1.41421L13.1716 2.82843L16.7071 6.36396L18.1213 4.94975C18.9024 4.1687 18.9024 2.90237 18.1213 2.12132L17.4142 1.41421ZM1.04539 15.4815L0.443651 19.0919L4.05408 18.4901C4.46526 18.4216 4.84474 18.2263 5.1395 17.9316L16 7.07107L12.4645 3.53553L1.60396 14.396C1.30921 14.6908 1.11392 15.0703 1.04539 15.4815Z"
                fill="#333333"
                />
            </svg>
        </td>
    </tr>`);
    
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


    addEventToEls('input[type=color]', 'change', function(){
 
      let color  =  this.value,
        markColor = this.closest('.M__custom-input').querySelector('span')
        markColor.innerHTML  = color;
    })
}

function ItemDataToModal(todo){
    /**
     * Данные редактируемой тудушки
     */
    if(!todo){
        todo           =  this.closest('.todo-item');
    }
    let name           =  todo.querySelector('.todo-item__title a').innerHTML,
        deadlineDate   =  todo.querySelector('.todo-item__deadline span').innerHTML,
        deadlineTime   =  todo.querySelector('.todo-item__deadline p').innerHTML,
        T = deadlineDate.split('.')[0], 
        M = deadlineDate.split('.')[1], 
        Y = deadlineDate.split('.')[2],
        datetime = Y + '-' + M + '-' + T + "T" + deadlineTime;
        priority       =  todo.getAttribute('data-priority'),
        color          =  todo.querySelector('.todo-item__priority-indicator').style.backgroundColor,
        describtion    =  todo.querySelector('.todo-item__title p').innerHTML.trim();
        
        editedTodoID = todo.getAttribute('id');

    /**
     * Инпуты, в которых будут заменяться данные
     */
    let inputName   =  document.querySelector('.M_editTask input[type=text]'),
        inputDate   =  document.querySelector('.M_editTask input[type=datetime-local]'),
        select      =  document.querySelector('.M_editTask select'),
        markCircle  =  document.querySelector('.M_editTask input[type=color]'),
        markColor    =  document.querySelector('.M_editTask .M__custom-input_mark span'),
        textarea    =  document.querySelector('.M_editTask textarea');
    
    /**
     * RGB to HEX
     */
    color = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete (color[0]);
    for (var i = 1; i <= 3; ++i) {
        color[i] = parseInt(color[i]).toString(16);
        if (color[i].length == 1) color[i] = '0' + color[i];
    } 
    color ='#'+color.join('').toUpperCase(); 

    inputName.value = name.trim();

    inputDate.value = datetime.trim();
    select.value = priority;
    markCircle.value    = color;
    markColor.innerHTML  = color;
    textarea.value  = 
        describtion == '...'
        ? '' 
        : describtion.trim();
}