export class Checkpoint {
    constructor(name, dist, elev) {
        this.name = name
        this.dist = dist
        this.elev = elev
        this.EP = this.dist + this.elev * 0.01
        this.percentageEP = 0
        this.target = { effort: "", split: "", EPH: "" }
        this.recce = { effort: "", split: "", EPH: "" }
        this.actual = { effort: "", split: "", EPH: "", buffer: "" }
    }
}


