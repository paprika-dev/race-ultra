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



document.addEventListener("touchstart", function(){}, true);

function displayFigure(x, dp) {
    return Number.parseFloat(x).toFixed(dp)
}

const tb = document.getElementById('cptable-body');

function clearTable() {
    tb.innerHTML = '';
}

class Checkpoint {
    constructor(name, dist, elev) {
        this.name = name
        this.dist = dist
        this.elev = elev
        this.EP = this.dist + this.elev * 0.01
    }
}

class CheckpointManager {
    constructor() {
        this.checkpoints = [];
    }

    addCheckpoint(checkpoint) {
        this.checkpoints.push(checkpoint);
    }

    calculateTotal() {
        return this.checkpoints.reduce((total, checkpoint) => {
            total.dist += checkpoint.dist;
            total.elev += checkpoint.elev;
            total.EP += checkpoint.EP;
            return total;
        }, { dist: 0, elev: 0, EP: 0 });
    }

    render() {
        clearTable();
        const total = this.calculateTotal();

        tb.insertRow().innerHTML = `<td>Start: ${this.checkpoints[0].name}</td>`+"<td>-</td>".repeat(9)

        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]
            const prefix = ((i == this.checkpoints.length - 1) ? "Finish: " : `CP${i}: `)
            tb.insertRow().innerHTML = 
            `
                <td>${prefix+cp.name}</td>
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
        console.log('updated the cp table')
    }

    save() {
        localStorage.setItem("checkpoints", JSON.stringify(this.checkpoints));
    }

    clear() {
        // this.checkpoints = []
        localStorage.removeItem("checkpoints")
    }
}



const cpmanager = new CheckpointManager();

window.onload = (e) => {
    const CPs = window.localStorage.getItem("checkpoints")
    
    if (CPs) {
        cpmanager.checkpoints = JSON.parse(CPs)
        cpmanager.render()
    }

}


const formAddCP = document.getElementById('form-addcp');
const formRemoveCP = document.getElementById('form-removecp');

formAddCP.addEventListener('submit', (e) => {
    e.preventDefault();
    cp = new Checkpoint(
        formAddCP.querySelector('input[name="cpname"]').value,
        formAddCP.querySelector('input[name="cpdistance"]').valueAsNumber,
        formAddCP.querySelector('input[name="cpelevgain"]').valueAsNumber
    )
    cpmanager.addCheckpoint(cp)
    cpmanager.save()
    cpmanager.render()
    
    formAddCP.reset();
})

formRemoveCP.addEventListener('submit', (e) => {
    e.preventDefault();
    cpmanager.clear()
    cpmanager.render()
})
