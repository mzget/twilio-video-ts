"use strict";
// information about network-infomation api.
// https://wicg.github.io/netinfo/#dfn-effective-connection-type
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSpeedChangedHandler = [];
function addSpeedChangeListener(speedChangeListener) {
    var id = exports.onSpeedChangedHandler.indexOf(speedChangeListener);
    if (id < 0) {
        exports.onSpeedChangedHandler.push(speedChangeListener);
    }
}
exports.addSpeedChangeListener = addSpeedChangeListener;
function removeSpeedChangeListener(speedChangeListener) {
    var id = exports.onSpeedChangedHandler.indexOf(speedChangeListener);
    exports.onSpeedChangedHandler.splice(id);
}
exports.removeSpeedChangeListener = removeSpeedChangeListener;
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var internetProps;
function speedChanged(ev) {
    console.log('Connection Change', ev.target);
    if (connection.rtt >= 270) {
        if (internetProps)
            internetProps.active = true;
        if (exports.onSpeedChangedHandler && exports.onSpeedChangedHandler.length >= 0) {
            exports.onSpeedChangedHandler.map(function (listener) {
                listener(false);
            });
        }
    }
    else {
        if (internetProps)
            internetProps.active = false;
        if (exports.onSpeedChangedHandler && exports.onSpeedChangedHandler.length >= 0) {
            exports.onSpeedChangedHandler.map(function (listener) {
                listener(true);
            });
        }
    }
}
function removeSpeedCheck() {
    if (connection) {
        connection.removeEventListener('change', speedChanged);
    }
}
exports.removeSpeedCheck = removeSpeedCheck;
function speedCheck(_internetProps) {
    if (_internetProps && _internetProps.hasOwnProperty("active")) {
        internetProps = _internetProps;
        // {downlink: 4.7, effectiveType: "4g", onchange: null, rtt: 150, saveData: false}
        if (connection) {
            console.log('Connection', connection, navigator.mozConnection, navigator.webkitConnection);
            connection.addEventListener('change', speedChanged);
            // default 4g is 270
            if (connection.rtt >= 270) {
                internetProps.active = true;
                if (exports.onSpeedChangedHandler && exports.onSpeedChangedHandler.length >= 0) {
                    exports.onSpeedChangedHandler.map(function (listener) {
                        listener(false);
                    });
                }
            }
        }
        else {
            console.warn('No connection info api implemented.');
        }
    }
    else {
        console.warn("No internetProps data!");
    }
}
exports.default = speedCheck;
