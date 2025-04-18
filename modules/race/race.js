class Race {
    constructor() {
        this.checkpoints = []
        this.total = { dist: 0, elev: 0, EP: 0 };
        this.target = { rt: "", EPH: "" };
        this.recce = { rt: "", EPH: "", fullRecce: true };
        this.actual = 
        { 
            started: false, 
            finished: false, 
            lastcheckpoint: 0, 
            progress: 0, 
            rt: "", 
            buffer: "" 
        }
        this.projected = { nextarrival: "", rt: "" }
        // this.pace = { lastsplit: "", target:"", projected: "", plan: "" }
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

    saveCheckpoints() {
        localStorage.setItem("checkpoints", JSON.stringify(this.checkpoints));
        localStorage.setItem("total", JSON.stringify(this.total));
    }

    saveTarget() {
        localStorage.setItem("target", JSON.stringify(this.target));
    }

    saveRecce() {
        localStorage.setItem("recce", JSON.stringify(this.recce));
    }

    saveProgress() {
        localStorage.setItem("actual", JSON.stringify(this.actual));
    }

    removeTarget() {
        this.target = { rt: "", EPH: "" }
        localStorage.removeItem("target");

        for (let i = 1; i < this.checkpoints.length; i++) {
            const cp = this.checkpoints[i]
            cp.target = { effort: "", split: "", EPH: "" }
        }
        this.saveCheckpoints();
    }  

    reset() {
        this.checkpoints = [];
        this.total = { dist: 0, elev: 0, EP: 0 };
        this.target = { rt: "", EPH: "" };
        this.recce = { rt: "", EPH: "", fullRecce: true };

        localStorage.removeItem("checkpoints");
        localStorage.removeItem("total");
        localStorage.removeItem("target");
        localStorage.removeItem("recce");
    }    
}

export const race = new Race();
