import React from 'react';
import StopButton from "./StopButton";

function Popup({ show, toggleStop }: { show: boolean, toggleStop: ()=>void }) {
    return (
        <div className={`popup ${show ? 'show' : ''}`}>
            <StopButton toggle={toggleStop} />
        </div> /* add the show class here */
    );
}

export default Popup;