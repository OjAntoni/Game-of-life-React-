function StopButton({toggle}:{toggle: () => void}) {
    return <button onClick={()=> toggle()}>Stop</button>
}

export default StopButton;