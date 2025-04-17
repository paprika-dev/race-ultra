import { progressbar, dashboard, arrivalBtn } from "../utils/elements.js"
import { race } from "../race/race.js"

class RaceTracker {
    constructor() {
        this.racestart = ""
        this.progress = { lastcheckpoint: 0, perc: "" }
        this.rt = { passed: "", target:"", projected: "", buffer: "" }
        this.pace = { lastsplit: "", target:"", projected: "", plan: "" }
    }

    recordArrival(i){
        // const lastcheckpoint = this.checkpoints[i]
        // this.progress.lastcheckpoint = i
        // this.progress.perc += lastcheckpoint.target.effort
        // this.rt.passed = 
        // this.pace.lastsplit = 
    }

    arrivalProjection(){
        // this.rt.projected = 
        // this.checkpoints = 
    }

    updateDashboard() {
        progressbar.style.width = this.progress.perc;
        dashboard.rtpassed.innerHTML = this.rt.passed;
        dashboard.rtprojected = this.rtprojected;
        dashboard.buffer = this.rt.buffer;
        dashboard.pace = this.pace.plan;
    }

    updateLastCheckpoint() {

    }

    updateNextCheckpoint(){

    }
    
    updateBtnText(){
        arrivalBtn.innerHTML = `arrived at`
    }

    render() {
        // this.updateDashboard();
        // this.updateLastCheckpoint();
        // this.updateNextCheckpoint();
        // this.updateBtnText();
    }
}

export const raceTracker = new RaceTracker();
