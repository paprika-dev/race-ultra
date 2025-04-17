import { displayFigure } from "./functions.js";

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

export const raceTime = new RaceTime();
