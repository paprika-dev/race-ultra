export function displayFigure(x, dp) {
    return Number.parseFloat(x).toFixed(dp)
}

export function displayEffort(x, dp) {
    if (x) {
        if (dp == -1) return x
        return displayFigure(x, dp)
    }
    return "-"
}