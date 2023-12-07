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
    #include <PinChangeIntConfig.h> \
    #include <EEPROM.h> \
    #define _NAMIKI_MOTOR	 //for Namiki 22CL-103501PG80:1 \
    #include <fuzzy_table.h> \
    #include <PID_Beta6.h> \
    #include <MotorWheel.h> \
    #include <Omni4WD.h> \
    \n irqISR(irq1, isr1); \
    MotorWheel wheel1(3, 2, 4, 5, &irq1); \
    \n irqISR(irq2, isr2); \
    MotorWheel wheel2(11, 12, 14, 15, &irq2); \
    \n irqISR(irq3, isr3);  \
    \n MotorWheel wheel3(9, 8, 16, 17, &irq3); \
    \n irqISR(irq4, isr4); \
    \ MotorWheel wheel4(10, 7, 18, 19, &irq4); \
    \n \n Omni4WD Omni(&wheel1, &wheel2, &wheel3, &wheel4); \
    void setup() { \
      //TCCR0B=TCCR0B&0xf8|0x01;    // warning!! it will change millis() \
      TCCR1B = TCCR1B & 0xf8 | 0x01; // Pin9,Pin10 PWM 31250Hz \
      TCCR2B = TCCR2B & 0xf8 | 0x01; // Pin3,Pin11 PWM 31250Hz \
       Omni.PIDEnable(0.31, 0.01, 0, 10); \
    } \
    \
    void loop() { \
      Omni.demoActions(30,1500,500,false); \
    }";

    return ino;
}