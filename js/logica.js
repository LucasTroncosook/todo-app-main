const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);
const $id = (el) => document.getElementById(el);

const dones = $$('.section article div section > a:first-child');
const eliminarDone = Array.from($$('.section article div section > a:last-child'));
let sectionDones = Array.from($$('.section article div section'));

let body = $('body');
let backImage = $('.back-image');
let main = $('.main');

let donesActive = [];
let donesCompleted = [];

const navAction = Array.from($$('.div-nav nav > a'));

const listaTarea = $id('lista');
const newTarea = $id('nueva-tarea');
const clearCompleted = $id('clear-completed');
const toggleDark = $id('toggle-dark');
const leftItems = $id('items-left');

const interator = (array, evento, logica) => {
    array.forEach(item => {
        item.addEventListener(evento, logica);
    });
};

const updateArrays = ()=> {
    donesActive = sectionDones.filter(section => !section.querySelector('a:first-child').classList.contains('done'));
    donesCompleted = sectionDones.filter(section => section.querySelector('a:first-child').classList.contains('done'));

    if(sectionDones.length <= 6){
        listaTarea.style.overflowY = "hidden";
    }else{
        listaTarea.style.overflowY = "scroll";
    }
};

const renderState = (state) => {
    listaTarea.innerHTML = '';

    switch(state){
        case "all":
            sectionDones.forEach(section => listaTarea.appendChild(section));
            break;
        case "active":
            donesActive.forEach(section => listaTarea.appendChild(section));
            break;
        case "completed":
            donesCompleted.forEach(section => listaTarea.appendChild(section));
            break;    
    }
};

const updateAndRender = () => {
    updateArrays();
    const activeAction = navAction.find(a => a.classList.contains('active')).id;
    renderState(activeAction);
};

const actualizarValorText = () => {
    const cantidadLeftItems = sectionDones.filter(section => 
        !section.querySelector('a:first-child').classList.contains('done')
    ).length;
    leftItems.textContent = `${cantidadLeftItems} items left`;
};

const handleTaskClick = (evento) => {
    evento.target.classList.toggle('done');
    updateAndRender();
    actualizarValorText();
};

interator(dones, 'click', handleTaskClick);

interator(navAction, 'click', (evento) => {
    navAction.forEach(a => a.classList.remove('active'));
    evento.target.classList.add('active');
    updateAndRender();
});

interator(eliminarDone, 'click', (evento) => {
    const section = evento.target.closest('section');
    if (section) {
        section.remove();
        sectionDones = sectionDones.filter(s => s !== section);
        updateAndRender();
        actualizarValorText();
    }
});

newTarea.addEventListener('keydown', function(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        const newSection = document.createElement('section');

        newSection.innerHTML = `
            <a href="#"></a>
            <span>${e.target.value}</span>
            <a href="#">
                <img src="./images/icon-cross.svg" alt="icon-cross">
            </a>
        `;

        sectionDones.push(newSection);

        newSection.querySelector('a:first-child').addEventListener('click', handleTaskClick);
        newSection.querySelector('a:last-child').addEventListener('click', (evento) => {
            const section = evento.target.closest('section');
            if (section) {
                section.remove();
                sectionDones = sectionDones.filter(s => s !== section);
                updateAndRender();
                actualizarValorText();
            }
        });

        e.target.value = '';

        updateAndRender();
    }
});

clearCompleted.addEventListener('click', function() {
    sectionDones = sectionDones.filter(section => 
        !section.querySelector('a:first-child').classList.contains('done')
    );
    updateAndRender();
    actualizarValorText();
});

toggleDark.addEventListener('click', function(e) {
    if (this.children[0].src.endsWith('icon-sun.svg')) {
        this.children[0].setAttribute('src', './images/icon-moon.svg');
        body.classList.add('light');
        backImage.classList.add('light');
        main.classList.add('light');
    } else {
        this.children[0].setAttribute('src', './images/icon-sun.svg');
        body.classList.remove('light');
        backImage.classList.remove('light');
        main.classList.remove('light');
    }
});

updateArrays();
renderState('all');
