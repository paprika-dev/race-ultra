import { 
    
    navbtn,
    view,
    formSelections,
    formAddCP, 
    formRemoveCP, 
    formsSetTarget,
    formTargetRT, 
    formTargetSplit,
    formRecce,
    arrivalBtn

} from "./modules/utils/elements.js";
import { showForm, showView } from "./modules/ui/menu.js";
import { RaceTime } from "./modules/utils/raceTime.js";
import { racePlan } from "./modules/views/racePlan.js";
import { raceTracker } from "./modules/views/raceTracker.js";
import { Checkpoint } from "./modules/race/checkpoint.js";
import { race } from "./modules/race/race.js";


// Enable Touch
document.addEventListener("touchstart", function(){}, true);

// Load Data from Local Storage
window.onload = (e) => {
    const checkpoints = window.localStorage.getItem("checkpoints");
    const total = window.localStorage.getItem("total");
    const target = window.localStorage.getItem("target");
    const recce = window.localStorage.getItem("recce");
    
    if (checkpoints) { race.checkpoints = JSON.parse(checkpoints) };
    if (total) {race.total = JSON.parse(total) };
    if (target) {race.target = JSON.parse(target) };
    if (recce) {race.target = JSON.parse(recce) };

    racePlan.render();
    raceTracker.render();
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
    racePlan.addCheckpoint(cp);
    racePlan.render();
    raceTracker.updateCheckpointInfoBox();
    
    formAddCP.form.reset();
})

/// remove CP
formRemoveCP.btnRemoveCP.addEventListener('click', (e) => {
    e.preventDefault();
    let i = formRemoveCP.splitSelecton.value
    if (i != "") { racePlan.removeCheckpoint(i) };
    racePlan.render();
    raceTracker.updateCheckpointInfoBox();
})

formRemoveCP.btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    race.reset();
    racePlan.render();
    raceTracker.render();
})

/// set target
formTargetRT.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (RaceTime.isValidTime(formTargetRT.input.value)) {
        racePlan.setTargetRT(formTargetRT.input.value);
        formTargetRT.input.placeholder = "hh:mm";
    } else {
        formTargetRT.form.reset();
        race.removeTarget();
        formTargetRT.input.placeholder = "hh:mm (please input in valid format)";
    }

    racePlan.render();
})

formTargetSplit.splitSelecton.addEventListener('change', (e)=>{
    const i = formTargetSplit.splitSelecton.value;
    formTargetSplit.input.value = race.checkpoints[i].target.split;
})

formTargetSplit.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (RaceTime.isValidTime(formTargetSplit.input.value)) {
        let i = formTargetSplit.splitSelecton.value
        if (i != "") { racePlan.adjustTargetSplit(i, formTargetSplit.input.value) };
        formTargetSplit.input.placeholder = "hh:mm";
        racePlan.render();
    } else {
        formTargetSplit.input.placeholder = "hh:mm (please input in valid format)";
    }

    formTargetSplit.form.reset();
})

// record recce
formRecce.form.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (RaceTime.isValidTime(formRecce.input.value)) {
        let i = formRecce.splitSelecton.value
        if (i != "") { racePlan.reccordRecce(i, formRecce.input.value) };
        formRecce.input.placeholder = "hh:mm";
        racePlan.render();
    } else {
        formRecce.input.placeholder = "hh:mm (please input in valid format)";
    }

    formRecce.form.reset();
})

// tracker view
arrivalBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    if (!race.actual.finished) {
        raceTracker.recordArrival();
        raceTracker.render();
    } 
})
