import {useState} from "react";

function SpeedButton ({toggleSpeed,}:{toggleSpeed: () => number}){
    const [speed, setSpeed] = useState(1000);
    const defaultSpeed = 1000;
    return (
        <p className='speedButton' onClick={()=> setSpeed(toggleSpeed())}>
            {defaultSpeed/speed}x
        </p>
    )
}

export default SpeedButton;