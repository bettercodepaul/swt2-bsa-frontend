import { Set } from './../types/set';
import { Match } from './../types/match';
import { Play } from '../types/play';
export class MatchJsonToClass {

    static parseMatch(match: any) {
        const result = new Match(match.mannschaft, match.bahn);
        result.sets = MatchJsonToClass.parseSets(match.sets);
        result.currentSetNumber = match.currentSetNumber;
        result.currentSet = result.sets[result.currentSetNumber - 1];
        result.satzpunkte = match.satzpunkte;
        result.selectedPlayNumber = 0; // not used
        return result;
    }

    private static parseSets(sets: any) {
        const result = new Array<Set>();
        sets.forEach((set: any) => {
            result.push(MatchJsonToClass.parseSet(set));
        });
        return result;
    }

    private static parseSet(set: any) {
        const result = new Set(set.number);
        result.plays = MatchJsonToClass.parsePlays(set.plays);
        result.currentPlayNumber = set.currentPlayNumber;
        result.currentPlay = result.plays[result.currentPlayNumber - 1];
        return result;
    }

    private static parsePlays(plays: any) {
        const result = new Array<Play>();
        plays.forEach((play: any) => {
            result.push(MatchJsonToClass.parsePlay(play));
        });
        return result;
    }

    private static parsePlay(play: any) {
        const result = new Play(play.number);
        result.final = play.final;
        result.result = play.result;
        return result;
    }
}
