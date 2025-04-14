function showView(viewId, btn) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const navitems = document.querySelectorAll('.nav-item');
    navitems.forEach(navitem => navitem.classList.remove('selected'));
    navitems[btn].classList.add('selected');
}

function showForm(formId, btn) {
    const forms = document.querySelectorAll('form');
    forms.forEach(f => f.classList.remove('active'));
    document.getElementById(formId).classList.add('active');

    const formselections = document.querySelectorAll('.form-menu-item');
    formselections.forEach(s => s.classList.remove('selected'));
    formselections[btn].classList.add('selected');
}


const form = document.getElementById('form-add-cp');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('submitted')
})


function addRecceSplit(){

}

document.addEventListener("touchstart", function(){}, true);
// tetsing