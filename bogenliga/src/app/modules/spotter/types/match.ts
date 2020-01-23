import { Set } from './set';

export class Match {

    sets: Array<Set>;

    selectedPlayNumber: number;

    currentSetNumber: number;
    currentSet: Set;

    mannschaft: string;
    bahn: number;
    satzpunkte: number;

    constructor(mannschaft: string, bahn: number) {
        this.mannschaft = mannschaft;
        this.bahn = bahn;
        this.satzpunkte = 0;

        this.selectedPlayNumber = 1;
        this.currentSetNumber = 1;
        this.currentSet = new Set(this.currentSetNumber);

        this.sets = new Array<Set>();
        this.sets.push(this.currentSet);
    }

    addSet(): boolean {
        if (this.currentSet.canFinish()) {
            this.currentSetNumber++;
            this.currentSet = new Set(this.currentSetNumber);
            this.sets.push(this.currentSet);
            return true;
        }
        return false;
    }

    addPlay(): boolean {
        if (this.currentSet.addPlay()) {
            return true;
        }
        return false;
    }

    canFinish(): boolean {
        this.sets.forEach((set: Set) => {
            if (!set.canFinish()) {
                return false;
            }
        });
        return true;
    }

    lastSet() {
        if (this.currentSetNumber > 1) {
            return this.sets[this.sets.length - 2];
        }
        return null;
    }

}
