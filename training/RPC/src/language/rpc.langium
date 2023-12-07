// npm run langium:generate
// npm run build:web
// npm run serve
grammar Rpc

entry Game:
    GameInit plays+=(Play)* ;

GameInit:
    players += (Player)*;

Player:
    'player' name=ID;

Play:
    player=[Player:ID] 'play' entity=('rock' | 'paper' | 'scissors');


terminal NEWLINE: "\r"? "\n";
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;