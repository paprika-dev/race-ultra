export const views = document.querySelectorAll('.view');
export const view = {
    plan : document.getElementById('race-plan'),
    tracker : document.getElementById('race-tracker'),
    report : document.getElementById('race-report')
};

export const navitems = document.querySelectorAll('.nav-item');
export const navbtn = {
    plan : document.getElementById('nav-btn-1'),
    tracker : document.getElementById('nav-btn-2'),
    report : document.getElementById('nav-btn-3')
};

// plan view
export const forms = document.querySelectorAll('.cpinput');
export const formSelections = document.querySelectorAll('.form-menu-item');


export const formAddCP = {
    form : document.getElementById('form-addcp'),
    inputName : document.querySelector('input[name="cpname"]'),
    inputDist : document.querySelector('input[name="cpdistance"]'),
    inputElev : document.querySelector('input[name="cpelevgain"]'),
    inputDistElev : document.getElementById('input-dist-elev')
};

export const formRemoveCP = {
    form: document.getElementById('form-removecp'),
    splitSelecton: document.querySelector('#form-removecp select'),
    btnRemoveCP : document.getElementById('btn-removecp'),
    btnReset : document.getElementById('btn-reset')
};

export const formsSetTarget = document.getElementById('forms-settarget')

export const formTargetRT = {
    form: document.getElementById('form-settargetrt'),
    input : document.querySelector('input[name="rtTarget"]')
};

export const formTargetSplit = {
    form : document.getElementById('form-settargetsplit'),
    input : document.querySelector('input[name="splitTarget"]'),
    splitSelecton: document.querySelector('#form-settargetsplit select')
};

export const formRecce = {
    form : document.getElementById('form-reccesplit'),
    input : document.querySelector('input[name="reccesplit"]'),
    splitSelecton: document.querySelector('#form-reccesplit select')
};

export const splitSelections = document.getElementsByClassName('select-split');

export const tb = document.getElementById('cptable-body');

// tracker view
export const progressbar = document.getElementsByClassName('myprogress-bar')[0]

const metrics = document.getElementsByClassName('metric-figure')
export const dashboard = {
    rtpassed : metrics[0],
    rttarget: metrics[1],
    rtprojected: metrics[2],
    buffer: metrics[3],
    pace: metrics[4]
}

const checkpointInfoBoxes = document.getElementsByClassName('checkpoint');
let [box1, box2] = checkpointInfoBoxes;

export const infoBoxLastCP = {
    cpname: box1.querySelector('.cp-name'),
    cpinfo: box1.querySelector('.cp-info')
} 

export const infoBoxNextCP = {
    cpname: box2.querySelector('.cp-name'),
    cpinfo: box2.querySelector('.cp-info')
} 

export const arrival = {
    timeInput: document.getElementById('arrival-time'),
    btn:document.getElementById('arrival-btn')
}
export const resetraceBtn =  document.getElementById('resetrace-btn')


