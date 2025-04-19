export class RaceTime {
    static isValidTime(input) {
        // check if in hh:mm format
        return /^\d{2}:[0-5][0-9]$/.test(input)
    }

    static zeropad(num) {
        return num.toString().padStart(2, '0')
    }

    static timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    static minutesToTime(mins) {
        if (!mins) return "--:--"
        const hours = Math.floor(mins / 60);
        const minutes = Math.round(mins % 60);
        return `${RaceTime.zeropad(hours)}:${RaceTime.zeropad(minutes)}`;
    }

    static EPH(EP, mins){
        return EP / mins * 60
    }
}
