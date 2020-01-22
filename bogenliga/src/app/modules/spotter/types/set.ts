import { Play } from './play';
export class Set {

    number: number;
    plays: Array<Play>;
    currentPlay: Play;
    currentPlayNumber: number;

    constructor(number: number) {
        this.number = number;
        this.currentPlayNumber = 1;
        this.currentPlay = new Play(this.currentPlayNumber);
        this.plays = new Array<Play>();
        this.plays.push(this.currentPlay);
    }

    addPlay(): boolean {
        if (this.currentPlayNumber < 6) {
            this.currentPlayNumber++;
            this.currentPlay = new Play(this.currentPlayNumber);
            this.plays.push(this.currentPlay);
            return true;
        } else {
            return false;
        }
    }

    getSum(): number {
        let sum = 0;
        this.plays.forEach((play: Play) => {
            sum += play.result;
        });
        return sum;
    }

    canFinish(): boolean {
        this.plays.forEach((play: Play) => {
            if (!play.final) {
                return false;
            }
        });
        return true;
    }

}
