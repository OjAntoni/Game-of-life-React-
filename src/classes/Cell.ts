export default class Cell{
    isAlive : boolean = false;

    constructor(alive?: boolean) {
        if(alive) this.isAlive = alive;
    }

}