import { views, navitems, forms, formSelections } from "../utils/elements.js";

export function showView(view, i) {
    views.forEach(v => v.classList.remove('active'));
    view.classList.add('active');

    navitems.forEach(navitem => navitem.classList.remove('selected'));
    navitems[i].classList.add('selected');
}

export function showForm(form, i) {
    forms.forEach(f => f.classList.remove('active'));
    form.classList.add('active');

    formSelections.forEach(s => s.classList.remove('selected'));
    formSelections[i].classList.add('selected');
}
