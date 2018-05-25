// information about network-infomation api.
// https://wicg.github.io/netinfo/#dfn-effective-connection-type

export const onSpeedChangedHandler = [] as Array<(ok: boolean) => void>;
export function addSpeedChangeListener(speedChangeListener: (ok: boolean) => void) {
  const id = onSpeedChangedHandler.indexOf(speedChangeListener);
  if (id < 0) {
    onSpeedChangedHandler.push(speedChangeListener);
  }
}
export function removeSpeedChangeListener(speedChangeListener: (ok: boolean) => void) {
  const id = onSpeedChangedHandler.indexOf(speedChangeListener);
  onSpeedChangedHandler.splice(id);
}

const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
let internetProps: undefined | any;

function speedChanged(ev: any) {
  console.log('Connection Change', ev.target);

  if (connection.rtt >= 270) {
    if (internetProps) internetProps.active = true;

    if (onSpeedChangedHandler && onSpeedChangedHandler.length >= 0) {
      onSpeedChangedHandler.map(listener => {
        listener(false);
      });
    }
  } else {
    if (internetProps) internetProps.active = false;

    if (onSpeedChangedHandler && onSpeedChangedHandler.length >= 0) {
      onSpeedChangedHandler.map(listener => {
        listener(true);
      });
    }
  }
}

export function removeSpeedCheck() {
  if (connection) {
    connection.removeEventListener('change', speedChanged);
  }
}

function speedCheck(_internetProps: any) {
  if (_internetProps && _internetProps.hasOwnProperty("active")) {
    internetProps = _internetProps;
    // {downlink: 4.7, effectiveType: "4g", onchange: null, rtt: 150, saveData: false}
    if (connection) {
      console.log('Connection', connection, navigator.mozConnection, navigator.webkitConnection);
      connection.addEventListener('change', speedChanged);
      // default 4g is 270
      if (connection.rtt >= 270) {
        internetProps.active = true;

        if (onSpeedChangedHandler && onSpeedChangedHandler.length >= 0) {
          onSpeedChangedHandler.map(listener => {
            listener(false);
          });
        }
      }
    } else {
      console.warn('No connection info api implemented.');
    }
  }
  else {
    console.warn("No internetProps data!");
  }
}

export default speedCheck;
