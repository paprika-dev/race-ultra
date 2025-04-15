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

// Checkpoint Table

const tb = document.getElementById('cptable-body');
const formAddCP = document.getElementById('form-addcp');
const formRemoveCP = document.getElementById('form-removecp');
const btnRemoveCP = document.getElementById('btn-removecp');
const btnReset = document.getElementById('btn-reset');
const splitSelections = document.getElementsByClassName('select-split')

class Checkpoint {
    constructor(name, dist, elev) {
        this.name = name
        this.dist = dist
        this.elev = elev
        this.EP = this.dist + this.elev * 0.01
    }
}

class RacePlan {
    constructor() {
        this.raceStart = "";
        this.checkpoints = [];
    }

    addCheckpoint(checkpoint) {
        this.checkpoints.push(checkpoint);
        this.save();
    }

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

    calculateTotal() {
        return this.checkpoints.reduce((total, checkpoint) => {
            total.dist += checkpoint.dist;
            total.elev += checkpoint.elev;
            total.EP += checkpoint.EP;
            return total;
        }, { dist: 0, elev: 0, EP: 0 });
    }

    updateSplitSelection() {
        let options = "<option selected>Select Split</option>"

        for (let i = 1; i < this.checkpoints.length; i++) {
            options += `<option value="${i}">${this.prefixedName(i)}</option>`;
        }

        for (let i = 0; i < splitSelections.length; i++) {
            splitSelections[i].innerHTML = options
        }
    }

    updateCheckpointTable() {
        if (this.checkpoints.length == 0) {   
            const dummy = "<td>-</td>".repeat(9)
            tb.innerHTML = `
                <tr><td>Start<br>${dummy}</tr>
                <tr><td>Finish<br>${dummy}</tr>
                <tr><td>Total</td>${dummy}</tr>`;
            return;
        }

        const total = this.calculateTotal();
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
                <td>${displayFigure(cp.EP/total.EP*100, 0)}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `
        }

        tb.insertRow().innerHTML = 
            `
                <td>Total</td>
                <td>${total.dist}</td>
                <td>${total.elev}</td>
                <td>${displayFigure(total.EP, 1)}</td>
                <td>100</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `
    
    }

    render() {
        this.updateCheckpointTable();
        this.updateSplitSelection();
    }

    save() {
        localStorage.setItem("checkpoints", JSON.stringify(this.checkpoints));
    }

    removeCheckpoint(i) {
        this.checkpoints.splice(i)
        this.save()
    }
    
    reset() {
        this.checkpoints = []
        localStorage.removeItem("checkpoints")
    }
}



const raceUltra = new RacePlan();

window.onload = (e) => {
    const CPs = window.localStorage.getItem("checkpoints");
    
    if (CPs) { raceUltra.checkpoints = JSON.parse(CPs) };
    raceUltra.render();
}

formAddCP.addEventListener('submit', (e) => {
    e.preventDefault();
    cp = new Checkpoint(
        formAddCP.querySelector('input[name="cpname"]').value,
        formAddCP.querySelector('input[name="cpdistance"]').valueAsNumber,
        formAddCP.querySelector('input[name="cpelevgain"]').valueAsNumber
    )
    raceUltra.addCheckpoint(cp);
    raceUltra.render();
    
    formAddCP.reset();
})

btnRemoveCP.addEventListener('click', (e) => {
    e.preventDefault();
    let i = formRemoveCP.getElementsByTagName('select')[0].value
    raceUltra.removeCheckpoint(i);
    raceUltra.render();
})

btnReset.addEventListener('click', (e) => {
    e.preventDefault();
    raceUltra.reset();
    raceUltra.render();
})
