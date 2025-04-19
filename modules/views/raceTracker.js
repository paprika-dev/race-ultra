import { 
    progressbar, 
    dashboard, 
    arrival,
    resetraceBtn,
    infoBoxLastCP,
    infoBoxNextCP
} from "../utils/elements.js"
import { race } from "../race/race.js"
import { displayFigure } from "../utils/displayFigure.js";
import { RaceTime } from "../utils/raceTime.js";

class RaceTracker {
    recordArrival(){
        const arrivaltime = arrival.timeInput.value;

        if (!race.actual.started) {
            race.actual.started = true; // mark race start
            race.checkpoints[0].arrival = arrivaltime; // mark race start
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
    updateTargetTime() {
        dashboard.rttarget.innerHTML = RaceTime.minutesToTime(race.target.rt);
    }

    updateDashboard() {
        progressbar.style.width = `${displayFigure(race.actual.progress * 100, 2)}%`;
        this.updateTargetTime();
        // dashboard.rtpassed.innerHTML = race.actual.rt;
        // dashboard.rtprojected = race.projected.rt;
        // dashboard.buffer = race.actual.buffer;
        // dashboard.pace = race.pace.plan;
    }

    initializeInfoBox(box, cpname){
        box.cpname.innerHTML = cpname;
        box.cpinfo.innerHTML = "EP | km | +m";
        box.targetArrival.innerHTML = "--:--";
        box.actualOrProjArrival.innerHTML = "--:--";
        box.buffer.innerHTML = "-";
        box.splitEPH = "-";
    }

    updateCheckpointInfoBox() {
        // no CP input
        if (race.checkpoints.length == 0) {
            this.initializeInfoBox(infoBoxLastCP, "Last CP");
            this.initializeInfoBox(infoBoxNextCP, "Next CP");
            return
        }

        let i = race.actual.lastcheckpoint;

        // last CP
        if (race.checkpoints.length > 0) {
            infoBoxLastCP.cpname.innerHTML = race.prefixedName(i);
            infoBoxLastCP.cpinfo.innerHTML = 
                `${displayFigure(race.checkpoints[i].EP, 1)} EP | 
                 ${displayFigure(race.checkpoints[i].dist, 1)} km | 
                 +${race.checkpoints[i].elev} m`
            infoBoxLastCP.targetArrival.innerHTML = race.checkpoints[i].target.arrival || "--:--";
        }

        // next CP
        if (race.actual.finished) {
            this.initializeInfoBox(infoBoxNextCP, "You have made it!");
        } else if (race.checkpoints.length > 1) {
            infoBoxNextCP.cpname.innerHTML = race.prefixedName(i+1);
            infoBoxNextCP.cpinfo.innerHTML = 
            `${displayFigure(race.checkpoints[i+1].EP, 1)} EP | 
             ${displayFigure(race.checkpoints[i+1].dist, 1)} km | 
             +${race.checkpoints[i+1].elev} m`
             infoBoxNextCP.targetArrival.innerHTML = race.checkpoints[i+1].target.arrival || "--:--";
        }
    }
    
    updateBtnText(){
        arrival.btn.innerHTML = race.actual.finished ? 
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