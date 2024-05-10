import React, { useState } from 'react';
import Popup from "./PopUp";

function MenuButton({toggleStop, toggleSpeed}:{toggleStop: ()=>void, toggleSpeed: () => number}){
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="menu-container">
            <button className="menu-button" onClick={togglePopup}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            {isOpen && <Popup show={isOpen} toggleStop={toggleStop} toggleSpeed={toggleSpeed}/>}
        </div>
    );
}

export default MenuButton;