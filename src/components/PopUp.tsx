import React from 'react';
import StopButton from "./StopButton";
import SpeedButton from "./SpeedButton";

function Popup({ show, toggleStop, toggleSpeed }: { show: boolean, toggleStop: ()=>void, toggleSpeed: () => number }) {
    return (
        <div className={`popup ${show ? 'show' : ''}`}>
            <StopButton toggle={toggleStop} />
            <SpeedButton toggleSpeed={toggleSpeed} />
        </div> /* add the show class here */
    );
}

export default Popup;