import { tb, formAddCP, formTargetRT, formTargetSplit, splitSelections } from "./elements.js";
import { raceTime } from "./raceTime.js";

function displayFigure(x, dp) {
    return Number.parseFloat(x).toFixed(dp)
}

function displayTarget(x, dp) {
    if (x) {
        if (dp == -1) return x
        return displayFigure(x, dp)
    }
    return "-"
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
            cp.targetsplit = ""
            cp.targetEPH = ""
            cp.targeteffort = ""
        }
        this.saveCheckpoints()
    }  

    reset() {
        this.checkpoints = [];
        this.total = { dist: 0, elev: 0, EP: 0 }
        this.target = { rt: "", EPH: "" }

        localStorage.removeItem("checkpoints");
        localStorage.removeItem("total");
        localStorage.removeItem("target");
    }    

    // Target
    setTargetRT(targetrt){
        // set target total race time & avg EPH
        this.target.rt = targetrt;
        this.target.EPH = raceTime.EPH(this.total.EP, raceTime.timeToMinutes(this.target.rt));

        // set target split, EPH & effort(%)
        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i];
            const mins = raceTime.allocateMinutes(this.target.rt, cp.percentageEP);
            cp.targetsplit = raceTime.minutesToTime(mins);
            cp.targetEPH = raceTime.EPH(cp.EP, mins);
            cp.targeteffort = cp.percentageEP;
        };

        // save target and checkpoints
        this.saveTarget();
        this.saveCheckpoints();
    }

    adjustTargetSplit(i, split){
        // adjust target split & split EPH
        const cp = this.checkpoints[i];
        const mins = raceTime.timeToMinutes(split)
        cp.targetsplit = split;
        cp.targetEPH = raceTime.EPH(cp.EP, mins);

        // adjust total target race time & avg EPH
        let totalmins = 0;
        for (let k = 1; k < this.checkpoints.length; k++) {
            totalmins += raceTime.timeToMinutes(this.checkpoints[k].targetsplit);
        };
        this.target.rt = raceTime.minutesToTime(totalmins);
        this.target.EPH = raceTime.EPH(this.total.EP, totalmins);

        // adjust target effort(%)
        for (let k = 1; k < this.checkpoints.length; k++) {
            const checkpointK =  this.checkpoints[k]
            checkpointK.targeteffort = raceTime.timeToMinutes(checkpointK.targetsplit) / totalmins
        }

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
            cp.percentageEP = cp.EP / this.total.EP
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
            formAddCP.inputName.placeholder = "Starting Location";
            formAddCP.inputDist.style.display = "none";
            formAddCP.inputElev.style.display = "none";
            formAddCP.inputDist.value = 0;
            formAddCP.inputElev.value = 0;
        } else {
            formAddCP.inputName.placeholder = "Checkpoint Name";
            formAddCP.inputDist.style.display = "block";
            formAddCP.inputElev.style.display = "block";
        }

        if (this.target.rt == "") {
            formTargetRT.form.reset();
            formTargetSplit.form.style.display = "none"
            
        } else {
            formTargetRT.input.value = this.target.rt
            formTargetSplit.form.style.display = "block"
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
                <td>${displayFigure(cp.dist, 1)}</td>
                <td>${cp.elev}</td>
                <td>${displayFigure(cp.EP, 1)}</td>
                <td>${displayTarget(cp.targeteffort*100, 0)}</td>
                <td>${displayFigure(cp.percentageEP*100, 0)}</td>
                <td>${displayTarget(cp.targetsplit, -1)}</td>
                <td>-</td>
                <td>${displayTarget(cp.targetEPH, 2)}</td>
                <td>-</td>
            `
        }

        tb.insertRow().innerHTML = 
            `
                <td>Total</td>
                <td>${displayFigure(this.total.dist, 1)}</td>
                <td>${this.total.elev}</td>
                <td>${displayFigure(this.total.EP, 1)}</td>
                <td>${this.target.rt ? 100 : "-"}</td>
                <td>100</td>
                <td>${displayTarget(this.target.rt, -1)}</td>
                <td>-</td>
                <td>${displayTarget(this.target.EPH, 2)}</td>
                <td>-</td>
            `
    
    }

    render() {
        this.updateInputSection();
        this.updateCheckpointTable();
        this.updateSplitSelection();
    }
}

export const raceUltra = new RacePlan();
