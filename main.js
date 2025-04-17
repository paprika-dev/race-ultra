import { 

    navbtn,
    view,
    formSelections,
    formAddCP, 
    formRemoveCP, 
    formsSetTarget,
    formTargetRT, 
    formTargetSplit,
    formRecce 

} from "./modules/elements.js";
import { showForm, showView } from "./modules/menu.js";
import { raceTime } from "./modules/raceTime.js";
import { raceUltra } from "./modules/racePlan.js";
import { Checkpoint } from "./modules/checkpoint.js";

// Enable Touch
document.addEventListener("touchstart", function(){}, true);

// Load Data from Local Storage
window.onload = (e) => {
    const checkpoints = window.localStorage.getItem("checkpoints");
    const total = window.localStorage.getItem("total");
    const target = window.localStorage.getItem("target");
    const recce = window.localStorage.getItem("recce");
    
    if (checkpoints) { raceUltra.checkpoints = JSON.parse(checkpoints) };
    if (total) {raceUltra.total = JSON.parse(total) };
    if (target) {raceUltra.target = JSON.parse(target) };
    if (recce) {raceUltra.target = JSON.parse(recce) };

    raceUltra.render();
}

// Switch View
navbtn.plan.addEventListener('click', (e)=>{
    showView(view.plan, 0)
})

navbtn.tracker.addEventListener('click', (e)=>{
    showView(view.tracker, 1)
})

navbtn.report.addEventListener('click', (e)=>{
    showView(view.report, 2)
})

// Switch Input Form
formSelections[0].addEventListener('click', (e)=>{
    showForm(formAddCP.form, 0)
})

formSelections[1].addEventListener('click', (e)=>{
    showForm(formRecce.form, 1)
})

formSelections[2].addEventListener('click', (e)=>{
    showForm(formRemoveCP.form, 2)
})

formSelections[3].addEventListener('click', (e)=>{
    showForm(formsSetTarget, 3)
})


// input view

/// add CP
formAddCP.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cp = new Checkpoint(
        formAddCP.inputName.value,
        formAddCP.inputDist.valueAsNumber,
        formAddCP.inputElev.valueAsNumber
    )
    raceUltra.addCheckpoint(cp);
    raceUltra.render();
    
    formAddCP.form.reset();
})

/// remove CP
formRemoveCP.btnRemoveCP.addEventListener('click', (e) => {
    e.preventDefault();
    let i = formRemoveCP.splitSelecton.value
    if (i != "") { raceUltra.removeCheckpoint(i) };
    raceUltra.render();
})

formRemoveCP.btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    raceUltra.reset();
    raceUltra.render();
})

/// set target
formTargetRT.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (raceTime.isValidTime(formTargetRT.input.value)) {
        raceUltra.setTargetRT(formTargetRT.input.value);
        formTargetRT.input.placeholder = "hh:mm";
    } else {
        formTargetRT.form.reset();
        raceUltra.removeTarget();
        formTargetRT.input.placeholder = "hh:mm (please input in valid format)";
    }

    raceUltra.render();
})

formTargetSplit.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (raceTime.isValidTime(formTargetSplit.input.value)) {
        let i = formTargetSplit.splitSelecton.value
        if (i != "") { raceUltra.adjustTargetSplit(i, formTargetSplit.input.value) };
        formTargetSplit.input.placeholder = "hh:mm";
        raceUltra.render();
    } else {
        formTargetSplit.input.placeholder = "hh:mm (please input in valid format)";
    }

    formTargetSplit.form.reset();
})

// record recce
formRecce.form.addEventListener('submit', (e)=>{
    e.preventDefault();
})
