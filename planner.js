document.addEventListener("touchstart", function(){}, true);

function displayFigure(x, dp) {
    return Number.parseFloat(x).toFixed(dp)
}

// UI show / hide

function showView(viewId, btn) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    const navitems = document.querySelectorAll('.nav-item');
    navitems.forEach(navitem => navitem.classList.remove('selected'));
    navitems[btn].classList.add('selected');
}

function showForm(formId, btn) {
    const forms = document.querySelectorAll('.cpinput');
    forms.forEach(f => f.classList.remove('active'));
    document.getElementById(formId).classList.add('active');

    const formselections = document.querySelectorAll('.form-menu-item');
    formselections.forEach(s => s.classList.remove('selected'));
    formselections[btn].classList.add('selected');
}

// Race Planner

const tb = document.getElementById('cptable-body');

const formAddCP = document.getElementById('form-addcp');
const inputName = formAddCP.querySelector('input[name="cpname"]');
const inputDist = formAddCP.querySelector('input[name="cpdistance"]');
const inputElev = formAddCP.querySelector('input[name="cpelevgain"]');
const inputDistElev = document.getElementById('input-dist-elev');

const formRemoveCP = document.getElementById('form-removecp');
const btnRemoveCP = document.getElementById('btn-removecp');
const btnReset = document.getElementById('btn-reset');

const formTargetRT = document.getElementById('form-settargetrt');
const inputTargetRT = formTargetRT.querySelector('input[name="rtTarget"]');
const formTargetSplit = document.getElementById('form-settargetsplit');
const inputTargetSplit = formTargetSplit.querySelector('input[name="splitTarget"]');

const formRecce = document.getElementById('form-reccesplit');

const splitSelections = document.getElementsByClassName('select-split');


class Checkpoint {
    constructor(name, dist, elev) {
        this.name = name
        this.dist = dist
        this.elev = elev
        this.EP = this.dist + this.elev * 0.01
        this.targetsplit = "-"
        this.targetEPH = "-"
    }
}

class RaceTime {
    isValidTime(input) {
        // check if in hh:mm format
        return /^\d{2}:[0-5][0-9]$/.test(input)
    }

    zeropad(num) {
        return num.toString().padStart(2, '0')
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(mins) {
        const hours = Math.floor(mins / 60);
        const minutes = Math.round(mins % 60);
        return `${this.zeropad(hours)}:${this.zeropad(minutes)}`;
    }
    
    allocateMinutes(raceTime, percentage) {
        return this.timeToMinutes(raceTime) * percentage
    }

    EPH(EP, mins){
        return displayFigure(EP / mins * 60, 2)
    }

    timeDiff(time1, time2) {

    }
}

class RacePlan {
    constructor() {
        this.raceStart = "";
        this.checkpoints = [];
        this.target = { rt: "", EPH: "" }
        this.total = { dist: 0, elev: 0, EP: 0 }
    }

    // Local Storage
    saveTarget() {
        localStorage.setItem("target", JSON.stringify(this.target));
    }

    saveCheckpoints() {
        localStorage.setItem("checkpoints", JSON.stringify(this.checkpoints));
        localStorage.setItem("total", JSON.stringify(this.total));
    }

    removeTarget() {
        this.target = { rt: "", EPH: "" }
        localStorage.removeItem("target");

        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]
            cp.targetsplit = "-"
            cp.targetEPH = "-"
        }
        this.saveCheckpoints()
    }  

    reset() {
        this.checkpoints = [];
        this.total = { dist: 0, elev: 0, EP: 0 }
        localStorage.removeItem("checkpoints");
        localStorage.removeItem("total");

        this.removeTarget();
    }    

    // Target
    setTargetRT(targetrt){
        // set target total race time & avg EPH
        this.target.rt = targetrt;
        this.target.EPH = raceTime.EPH(this.total.EP, raceTime.timeToMinutes(this.target.rt))

        // set target split, EPH & effort(%)
        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]
            const mins = raceTime.allocateMinutes(this.target.rt, cp.percentageEP)
            cp.targetsplit = raceTime.minutesToTime(mins)
            cp.targetEPH = raceTime.EPH(cp.EP, mins)
        };

        // save target and checkpoints
        this.saveTarget();
        this.saveCheckpoints();
    }

    adjustTargetSplit(i, split){
        // adjust target split & split EPH
        const cp = this.checkpoints[i]
        cp.targetsplit = split;
        cp.targetEPH = raceTime.EPH(cp.EP, raceTime.timeToMinutes(split))

        // adjust total target race time & avg EPH
        let totalmins = 0
        for (let k = 1; k < this.checkpoints.length; k++) {
            totalmins += raceTime.timeToMinutes(this.checkpoints[k].targetsplit);
        }
        this.target.rt = raceTime.minutesToTime(totalmins);
        this.target.EPH = raceTime.EPH(this.total.EP, totalmins);

        // save target and checkpoints
        this.saveTarget();
        this.saveCheckpoints();
    }

    // Checkpoints
    calculateTotal() {
        this.total = this.checkpoints.reduce((total, checkpoint) => {
            total.dist += checkpoint.dist;
            total.elev += checkpoint.elev;
            total.EP += checkpoint.EP;
            return total;
        }, { dist: 0, elev: 0, EP: 0 });

        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]
            cp.percentageEP = cp.EP/this.total.EP
        };
    }

    addCheckpoint(checkpoint) {
        this.checkpoints.push(checkpoint);
        this.calculateTotal();
        this.saveCheckpoints();
    }
    

    removeCheckpoint(i) {
        this.checkpoints.splice(i, 1);
        this.calculateTotal();
        this.saveCheckpoints();
    }      

    // Rendering
    prefixedName(i) {
        let prefix = ""
        switch (i) { 
            case 0: 
                prefix = "Start: "; break;
            case this.checkpoints.length - 1: 
                prefix = "Finish: "; break;
            default: 
                prefix = "CP" + i + ": ";
        }
        return prefix + this.checkpoints[i].name
    }

    updateInputSection() {
        // checkpoint input
        if (this.checkpoints.length == 0) {
            inputName.placeholder = "Starting Location";
            inputDist.style.display = "none";
            inputElev.style.display = "none";
            inputDist.value = 0;
            inputElev.value = 0;
        } else {
            inputName.placeholder = "Checkpoint Name";
            inputDist.style.display = "block";
            inputElev.style.display = "block";
        }

        if (this.target.rt == "") {
            formTargetRT.reset();
            formTargetSplit.style.display = "none"
            
        } else {
            inputTargetRT.value = this.target.rt
            formTargetSplit.style.display = "block"
        }
    }

    updateSplitSelection() {
        let options = `<option value="">Select Split</option>`

        for (let i = 1; i < this.checkpoints.length; i++) {
            options += `<option value="${i}">${this.prefixedName(i)}</option>`;
        }

        for (let i = 0; i < splitSelections.length; i++) {
            splitSelections[i].innerHTML = options
        }
    }

    updateCheckpointTable() {
        // no input data
        if (this.checkpoints.length == 0) {   
            const dummy = "<td>-</td>".repeat(9)
            tb.innerHTML = `
                <tr><td>Start<br>${dummy}</tr>
                <tr><td>Finish<br>${dummy}</tr>
                <tr><td>Total</td>${dummy}</tr>`;
            return;
        }

        // has input data
        tb.innerHTML = ''
        tb.insertRow().innerHTML = `<td>${this.prefixedName(0)}</td>`+"<td>-</td>".repeat(9)

        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]

            tb.insertRow().innerHTML = 
            `
                <td>${this.prefixedName(i)}</td>
                <td>${cp.dist}</td>
                <td>${cp.elev}</td>
                <td>${displayFigure(cp.EP, 1)}</td>
                <td>${displayFigure(cp.percentageEP*100, 0)}</td>
                <td>-</td>
                <td>${cp.targetsplit}</td>
                <td>-</td>
                <td>${cp.targetEPH}</td>
                <td>-</td>
            `
        }

        tb.insertRow().innerHTML = 
            `
                <td>Total</td>
                <td>${displayFigure(this.total.dist, 1)}</td>
                <td>${this.total.elev}</td>
                <td>${displayFigure(this.total.EP, 1)}</td>
                <td>100</td>
                <td>100</td>
                <td>${this.target.rt}</td>
                <td>-</td>
                <td>${this.target.EPH}</td>
                <td>-</td>
            `
    
    }

    render() {
        this.updateInputSection();
        this.updateCheckpointTable();
        this.updateSplitSelection();
    }
}


// Race Ultra
const raceUltra = new RacePlan();
const raceTime = new RaceTime();

window.onload = (e) => {
    const CPs = window.localStorage.getItem("checkpoints");
    const total = window.localStorage.getItem("total");
    const target = window.localStorage.getItem("target");
    
    if (CPs) { raceUltra.checkpoints = JSON.parse(CPs) };
    if (total) {raceUltra.total = JSON.parse(total) }
    if (target) {raceUltra.target = JSON.parse(target) }
    raceUltra.render();
}

// input view

/// add CP
formAddCP.addEventListener('submit', (e) => {
    e.preventDefault();
    cp = new Checkpoint(
        inputName.value,
        inputDist.valueAsNumber,
        inputElev.valueAsNumber
    )
    raceUltra.addCheckpoint(cp);
    raceUltra.render();
    
    formAddCP.reset();
})

/// remove CP
btnRemoveCP.addEventListener('click', (e) => {
    e.preventDefault();
    let i = formRemoveCP.getElementsByTagName('select')[0].value
    if (i != "") { raceUltra.removeCheckpoint(i) };
    raceUltra.render();
})

btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    raceUltra.reset();
    raceUltra.render();
})

/// set target
formTargetRT.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (raceTime.isValidTime(inputTargetRT.value)) {
        raceUltra.setTargetRT(inputTargetRT.value);
        inputTargetRT.placeholder = "hh:mm";
    } else {
        formTargetRT.reset();
        raceUltra.removeTarget();
        inputTargetRT.placeholder = "hh:mm (please input in valid format)";
    }

    raceUltra.render();
})

formTargetSplit.addEventListener('submit', (e)=>{
    e.preventDefault();

    if (raceTime.isValidTime(inputTargetSplit.value)) {
        let i = formTargetSplit.getElementsByTagName('select')[0].value
        if (i != "") { raceUltra.adjustTargetSplit(i, inputTargetSplit.value) };
        inputTargetSplit.placeholder = "hh:mm";
        raceUltra.render();
    } else {
        inputTargetSplit.placeholder = "hh:mm (please input in valid format)";
    }

    formTargetSplit.reset();
})

// record recce
formRecce.addEventListener('submit', (e)=>{
    e.preventDefault();
})
