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

export function translateToArduino(game : Game) : string {
    let ino = "#include <PinChangeInt.h> \
    \n#include <PinChangeIntConfig.h> \
    \n#include <EEPROM.h> \
    \n#define _NAMIKI_MOTOR	 //for Namiki 22CL-103501PG80:1 \
    \n#include <fuzzy_table.h> \
    \n#include <PID_Beta6.h> \
    \n#include <MotorWheel.h> \
    \n#include <Omni4WD.h> \
    \n\nirqISR(irq1, isr1); \
    \nMotorWheel wheel1(3, 2, 4, 5, &irq1); \
    \nirqISR(irq2, isr2); \
    \nMotorWheel wheel2(11, 12, 14, 15, &irq2); \
    \nirqISR(irq3, isr3);  \
    \nMotorWheel wheel3(9, 8, 16, 17, &irq3); \
    \nirqISR(irq4, isr4); \
    \nMotorWheel wheel4(10, 7, 18, 19, &irq4); \
    \nOmni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4); \
    \n\nvoid setup() { \
    \n  //TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis() \
    \n  TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz \
    \n  TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz \
    \n   Omni.PIDEnable(0.31, 0.01, 0, 10); \
    \n}  \
    \n    void moveInCircle(float radius, int speed) \
    \n{ \
    \nfloat angularSpeed = speed / radius; \
    \nOmni.setVelocity(angularSpeed, 0, 0); \
    \n} \
    \n \
    \nvoid moveInSquare(float sideLength, int speed) \
    \n{ \
    \nfor (int i = 0; i < 4; ++i) \
    \n{ \
    \n    Omni.setVelocity(0, speed, 0); \
    \n    delay(sideLength * 1000 / speed); \
    \n    Omni.setVelocity(0, 0, 0); \
    \n    delay(1000); \
    \n    Omni.setVelocity(0, 0, speed); \
    \n    delay(1000); \
    \n} \
    \n} \
    \nvoid loop() { \
    \n  Omni.demoActions(30,1500,500,false); \
    \n moveInCircle(30, 1500); \
    \n delay(500); \
    \n \n moveInSquare(500, 1500); \
    \n delay(500); \
    \n}";

    return ino;
}