import { progressbar, dashboard, arrivalBtn } from "../utils/elements.js"
import { race } from "../race/race.js"
import { displayFigure } from "../utils/displayFigure.js";

class RaceTracker {
    recordArrival(){
        console.log(race.actual.started, race.actual.finished);
        if (!race.actual.started) {
            race.actual.started = true; // mark race start
        } else {
            race.actual.lastcheckpoint += 1;
            let i = race.actual.lastcheckpoint;
            race.actual.progress += race.checkpoints[i].percentageEP;

            if (race.actual.lastcheckpoint + 1 == race.checkpoints.length) {
                race.actual.finished = true; // mark race finish
            } 
        }
        console.log("af ", race.actual.started, race.actual.finished);
    }

    arrivalProjection(){
        // this.rt.projected = 
        // this.checkpoints = 
    }

    // Rendering
    updateDashboard() {
        progressbar.style.width = `${displayFigure(race.actual.progress * 100, 2)}%`;
        // dashboard.rtpassed.innerHTML = race.actual.rt;
        // dashboard.rtprojected = race.projected.rt;
        // dashboard.buffer = race.actual.buffer;
        // dashboard.pace = race.pace.plan;
    }

    updateLastCheckpoint() {

    }

    updateNextCheckpoint(){

    }
    
    updateBtnText(){
        arrivalBtn.innerHTML = race.actual.finished ? 
            `<i class="bi bi-award-fill"></i> Congratulations!` : (race.actual.started ?
                `<i class="bi bi-bookmark-star-fill"></i> Arrived at ${race.prefixedName(race.actual.lastcheckpoint + 1)}` : 
                `<i class="bi bi-flag-fill"></i> Start`
            )
    }

    render() {
        this.updateDashboard();
        console.log('renderde')
        // this.updateLastCheckpoint();
        // this.updateNextCheckpoint();
        this.updateBtnText();
    }
}

export const raceTracker = new RaceTracker();