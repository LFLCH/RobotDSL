import type { Game, Play, Player } from '../language/generated/ast.js';


export interface GameDescription {
    players : string [],
    plays : [string, string][], // (play, action)
    winner? : string,
    draw : boolean,
    finished : boolean
}

function compareEntities(e1 : Play["entity"], e2 : Play["entity"]) : number {
    if(e1===e2) return 0;
    const winning_associations = {
        "rock" : "scissors",
        "paper" : "rock",
        "scissors" : "paper" 
    }
    return winning_associations[e1]===e2? 1 : -1;
}

function evaluateGame(game: Game) : Player | undefined  {
    let result = compareEntities(game.plays[0].entity, game.plays[1].entity);
    if(result>0)return game.plays[0].player.ref!;
    else if(result<0) return game.plays[1].player.ref!;
    return undefined;
} 

export function describeGame(game : Game): GameDescription { 
    let gd : GameDescription = {
        players : [],
        plays : [],
        draw : false,
        finished : true
    }

    let winner : Player | undefined  = evaluateGame(game);
    gd.winner = winner? winner.name : undefined;
    gd.draw = gd.winner===undefined;

    for(let play of game.plays){
        let player : string = play.player.ref!.name;
        if(!gd.players.includes(player)){
            gd.players.push(player);
        }
        let entity : string = play.entity;
        gd.plays.push([player, entity]);
    }
    return gd;
}