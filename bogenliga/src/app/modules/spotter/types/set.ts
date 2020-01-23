import { Play } from './play';
export class Set {

    number: number;
    plays: Array<Play>;
    currentPlay: Play;
    currentPlayNumber: number;

    constructor(number: number) {
        this.number = number;
        this.plays = this.createPlays();
        this.currentPlay = this.plays[0];
        this.currentPlayNumber = this.currentPlay.number;
    }

    private createPlays() {
        const plays = new Array<Play>();
        for (let i = 1; i < 7; i++) {
            plays.push(new Play(i));
        }
        return plays;
    }

    nextPlay(): boolean {
        if (this.currentPlayNumber < 6) {
            this.currentPlay = this.plays[this.currentPlayNumber];
            this.currentPlayNumber = this.currentPlay.number;
            return true;
        }
        return false;
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
            if (!play.final || play.result < 0) {
                return false;
            }
        });
        return true;
    }

    play(number?: number): Play {
        if (number) {
            if (number > 0 && number < 7) {
                return this.plays[number - 1];
            }
            return null;
        } else {
            return this.currentPlay;
        }
    }

}
