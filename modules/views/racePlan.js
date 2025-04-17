import { tb, formAddCP, formTargetRT, formTargetSplit, splitSelections } from "../utils/elements.js";
import { RaceTime } from "../utils/raceTime.js";
import { displayFigure, displayEffort } from "../utils/displayFigure.js";
import { race } from "../race/race.js";

class RacePlan {
    // Checkpoints
    addCheckpoint(checkpoint) {
        race.checkpoints.push(checkpoint);
        race.calculateTotal();
        race.saveCheckpoints();
    }
    
    removeCheckpoint(i) {
        race.checkpoints.splice(i, 1);
        race.calculateTotal();
        race.saveCheckpoints();
    }    

    // Target
    setTargetRT(targetrt){
        // set target total race time & avg EPH
        race.target.rt = targetrt;
        race.target.EPH = RaceTime.EPH(race.total.EP, RaceTime.timeToMinutes(race.target.rt));

        // set target split, EPH & effort(%)
        for (let i = 1; i < race.checkpoints.length; i++) {
            const cp = race.checkpoints[i];
            const mins = RaceTime.allocateMinutes(race.target.rt, cp.percentageEP);
            cp.target.split = RaceTime.minutesToTime(mins);
            cp.target.EPH = RaceTime.EPH(cp.EP, mins);
            cp.target.effort = cp.percentageEP;
        };

        // save target and checkpoints
        race.saveTarget();
        race.saveCheckpoints();
    }

    adjustTargetSplit(i, split){
        // adjust target split & split EPH
        const cp = race.checkpoints[i];
        const mins = RaceTime.timeToMinutes(split)
        cp.target.split = split;
        cp.target.EPH = RaceTime.EPH(cp.EP, mins);

        // adjust total target race time & avg EPH
        let totalmins = 0;
        for (let k = 1; k < race.checkpoints.length; k++) {
            totalmins += RaceTime.timeToMinutes(race.checkpoints[k].target.split);
        };
        race.target.rt = RaceTime.minutesToTime(totalmins);
        race.target.EPH = RaceTime.EPH(race.total.EP, totalmins);

        // adjust target effort(%)
        for (let k = 1; k < race.checkpoints.length; k++) {
            const checkpointK =  race.checkpoints[k]
            checkpointK.target.effort = RaceTime.timeToMinutes(checkpointK.target.split) / totalmins
        }

        // save target and checkpoints
        race.saveTarget();
        race.saveCheckpoints();
    }

    // Recce
    reccordRecce(i, split){
        // record recce split & split EPH
        const cp = race.checkpoints[i];
        const mins = RaceTime.timeToMinutes(split)
        cp.recce.split = split;
        cp.recce.EPH = RaceTime.EPH(cp.EP, mins);

        // check if full recce is done
        let totalmins = 0;
        for (let k = 1; k < race.checkpoints.length; k++) {
            const s = race.checkpoints[k].recce.split
            if (s == "") {
                race.recce.fullRecce = false
                break;
            }
            race.recce.fullRecce = true
            totalmins += RaceTime.timeToMinutes(s);
        };

        // if full recce is made, adjust total recce race time & avg EPH, as well as split recce effort(%)
        if (race.recce.fullRecce) {
            race.recce.rt = RaceTime.minutesToTime(totalmins);
            race.recce.EPH = RaceTime.EPH(race.total.EP, totalmins);

            for (let k = 1; k < race.checkpoints.length; k++) {
                const checkpointK =  race.checkpoints[k]
                checkpointK.recce.effort = RaceTime.timeToMinutes(checkpointK.recce.split) / totalmins
            }
        }

        // save target and checkpoints
        race.saveRecce();
        race.saveCheckpoints();
    }  

    // Rendering
    updateInputSection() {
        // checkpoint input
        if (race.checkpoints.length == 0) {
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

        if (race.target.rt == "") {
            formTargetRT.form.reset();
            formTargetSplit.form.style.display = "none"
            
        } else {
            formTargetRT.input.value = race.target.rt
            formTargetSplit.form.style.display = "block"
        }
    }

    updateSplitSelection() {
        let options = `<option value="">Select Split</option>`

        for (let i = 1; i < race.checkpoints.length; i++) {
            options += `<option value="${i}">${race.prefixedName(i)}</option>`;
        }

        for (let i = 0; i < splitSelections.length; i++) {
            splitSelections[i].innerHTML = options
        }
    }

    updateCheckpointTable() {
        // no input data
        if (race.checkpoints.length == 0) {   
            const dummy = "<td>-</td>".repeat(9)
            tb.innerHTML = `
                <tr><td>Start<br>${dummy}</tr>
                <tr><td>Finish<br>${dummy}</tr>
                <tr><td>Total</td>${dummy}</tr>`;
            return;
        }

        // has input data
        tb.innerHTML = ''
        tb.insertRow().innerHTML = `<td>${race.prefixedName(0)}</td>`+"<td>-</td>".repeat(10)

        for (let i = 1; i < race.checkpoints.length; i++) {
            const cp = race.checkpoints[i]

            tb.insertRow().innerHTML = 
            `
                <td>${race.prefixedName(i)}</td>
                <td>${displayFigure(cp.dist, 1)}</td>
                <td>${cp.elev}</td>
                <td>${displayFigure(cp.EP, 1)}</td>
                <td>${displayFigure(cp.percentageEP*100, 0)}</td>
                <td>${displayEffort(cp.target.effort*100, 0)}</td>
                <td>${displayEffort(cp.recce.effort*100, 0)}</td>
                <td>${displayEffort(cp.target.split, -1)}</td>
                <td>${displayEffort(cp.recce.split, -1)}</td>
                <td>${displayEffort(cp.target.EPH, 2)}</td>
                <td>${displayEffort(cp.recce.EPH, 2)}</td>
            `
        }

        tb.insertRow().innerHTML = 
            `
                <td>Total</td>
                <td>${displayFigure(race.total.dist, 1)}</td>
                <td>${race.total.elev}</td>
                <td>${displayFigure(race.total.EP, 1)}</td>
                <td>100</td>
                <td>${race.target.rt ? "100" : "-"}</td>
                <td>${race.recce.rt ? "100" : "-"}</td>
                <td>${displayEffort(race.target.rt, -1)}</td>
                <td>${displayEffort(race.recce.rt, -1)}</td>
                <td>${displayEffort(race.target.EPH, 2)}</td>
                <td>${displayEffort(race.recce.EPH, 2)}</td>
            `
    
    }

    render() {
        this.updateInputSection();
        this.updateCheckpointTable();
        this.updateSplitSelection();
    }
}

export const racePlan = new RacePlan();
