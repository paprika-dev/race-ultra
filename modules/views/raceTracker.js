import { 
    progressbar, 
    dashboard, 
    arrivalBtn, 
    resetraceBtn,
    infoBoxLastCP,
    infoBoxNextCP
} from "../utils/elements.js"
import { race } from "../race/race.js"
import { displayFigure } from "../utils/displayFigure.js";

class RaceTracker {
    recordArrival(){
        if (!race.actual.started) {
            race.actual.started = true; // mark race start
        } else {
            race.actual.lastcheckpoint += 1;
            let i = race.actual.lastcheckpoint;
            race.actual.progress += race.checkpoints[i].percentageEP;

            if (race.actual.lastcheckpoint + 1 == race.checkpoints.length) {
                race.actual.finished = true; // mark race finish
                resetraceBtn.style.display = 'block';
            } 
        }
    }

    arrivalProjection(){
        // this.rt.projected = 
        // this.checkpoints = 
    }

    resetRace(){
        race.actual = 
        { 
            started: false, 
            finished: false, 
            lastcheckpoint: 0, 
            progress: 0, 
            rt: "", 
            buffer: "" 
        }
        resetraceBtn.style.display = 'none'
    }

    // Rendering
    updateDashboard() {
        progressbar.style.width = `${displayFigure(race.actual.progress * 100, 2)}%`;
        // dashboard.rtpassed.innerHTML = race.actual.rt;
        // dashboard.rtprojected = race.projected.rt;
        // dashboard.buffer = race.actual.buffer;
        // dashboard.pace = race.pace.plan;
    }

    initializeInfoBox(box){
        box.cpinfo.innerHTML = "EP | km | +m"
    }

    updateCheckpointInfoBox() {
        // no CP input
        if (race.checkpoints.length == 0) {
            infoBoxLastCP.cpname.innerHTML = "Last CP";
            infoBoxNextCP.cpname.innerHTML = "Next CP";
            this.initializeInfoBox(infoBoxLastCP);
            this.initializeInfoBox(infoBoxNextCP);
            return
        }

        let i = race.actual.lastcheckpoint;

        // last CP
        if (race.checkpoints.length > 0) {
            infoBoxLastCP.cpname.innerHTML = race.prefixedName(i);
            infoBoxLastCP.cpinfo.innerHTML = 
                `${race.checkpoints[i].EP} EP | 
                 ${race.checkpoints[i].dist} km | 
                 +${race.checkpoints[i].elev} m`
        }

        // next CP
        if (race.actual.finished) {
            infoBoxNextCP.cpname.innerHTML = "You have made it!"
            this.initializeInfoBox(infoBoxNextCP);
        } else if (race.checkpoints.length > 1) {
            infoBoxNextCP.cpname.innerHTML = race.prefixedName(i+1);
            infoBoxNextCP.cpinfo.innerHTML = 
            `${race.checkpoints[i+1].EP} EP | 
             ${race.checkpoints[i+1].dist} km | 
             +${race.checkpoints[i+1].elev} m`
        }
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
        this.updateCheckpointInfoBox();
        this.updateBtnText();
    }
}

export const raceTracker = new RaceTracker();