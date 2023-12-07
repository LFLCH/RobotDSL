import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { RpcAstType, Player, GameInit } from './generated/ast.js';
import type { RpcServices } from './rpc-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: RpcServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.RpcValidator;
    const checks: ValidationChecks<RpcAstType> = {
        GameInit : validator.checkGame,
        Player: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class RpcValidator {
    
    plays : Map<Player, String>;

    constructor(
    )
    {
        this.plays = new Map();
    }


    checkPersonStartsWithCapital(person: Player, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }
    
    checkGame(game : GameInit, accept : ValidationAcceptor): void {
        if(game.players.length!==2){
            accept('error', "Two players are necessary for playing the game", {node : game});
        }
        else if(game.plays.length!==2){
            accept('error', "A game is composed of two game actions", {node : game});
        }
        else {
            this.plays = new Map();
            if(game.plays){
                for (let play of game.plays){
                    const player = play.player.ref;
                    if(player){
                        if(this.plays.has(player)){
                            accept('error', player.name +" already plays "+ this.plays.get(player), {node: play});
                        }
                        else {
                            this.plays.set(player, play.entity);
                        }
                    }
                }
            }
        }
    }

}
