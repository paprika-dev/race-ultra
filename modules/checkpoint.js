export class Checkpoint {
    constructor(name, dist, elev) {
        this.name = name
        this.dist = dist
        this.elev = elev
        this.EP = this.dist + this.elev * 0.01
        this.targetsplit = "-"
        this.targetEPH = "-"
    }
}
