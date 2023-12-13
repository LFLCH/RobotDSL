grammar RobotScript

entry Model:
    (functionsDef+=FunctionDef | statements+=Statement)*;

FunctionDef:
    type=Type name=ID '('(params+=Parameter(',' params+=Parameter)*)? ')' block=Block;

Parameter:
    type=Type name=ID;

Type:
    type=('void' | 'boolean' | 'int' | 'double');

VariableDecl:
    type=Type name=ID '=' expression=Expression;

RobotSymbol:
    Parameter | VariableDecl;

Block:
    {infer Block} '{' statements += Statement* '}';

Statement:
    VariableDecl ';'|
    Assignment ';'|
    FunctionReturn |
    ControlStructure|
    Expression ';' 
    ;

Assignment:
    lhs=[RobotSymbol:ID] '=' expr=Expression;

FunctionReturn:
    'return' expression=Expression ';';

Movement:
    movement='Forward' | 'Backward' | 'Left' | 'Right';

Rotation:
    rotation='Clock' | 'Anticlock';

TimeUnit:
    unit='s' | 'ms';

DistanceUnit:
    unit='m' | 'dm' | 'cm' | 'mm';

ControlStructure:
   For | While | If;

For:
    'for' '(' 
    init=(VariableDecl | Assignment) ';'
    cond=Expression';'
    advancement=Assignment
    ')'
    block=Block
    ;


While:
    'while' '(' expr=Expression ')' block=Block
    ; 

If:
    'if''('expr=Expression')' thenBlock=Block
    ('elseif''('expr=Expression')'elifBlock=Block)*
    ('else'elseBlock=Block)?
    ;

Expression:
    Or;

Or infers Expression:
    And ({infer Or.left=current} "||" right=And)*;

And infers Expression:
    Equality ({infer And.left=current} "&&" right=Equality)*;

Equality infers Expression:
    Comparison (
        {infer Equality.left=current} op=("==" | "!=")
        right=Comparison
    )*
    ;

Comparison infers Expression:
    PlusOrMinus (
        {infer Comparison.left=current} op=(">=" | "<=" | ">" | "<")
        right=PlusOrMinus
    )*
    ;

PlusOrMinus infers Expression:
    MulOrDiv (
        ({infer Plus.left=current} '+' | {infer Minus.left=current} '-')
        right=MulOrDiv
    )*
    ;

MulOrDiv infers Expression:
    Primary (
        {infer MulOrDiv.left=current} op=('*'|'/' |'%')
        right=Primary
    )*
    ;

Primary infers Expression:
    '(' Expression ')' |
    {infer Not} "!" expression=Primary | 
    {infer Minus} "-" expression=Primary |
    Atomic
    ;   

Atomic infers Expression:
    {infer IntConstant} value=INT |
    {infer DoubleConstant} value=DOUBLE |
    {infer BoolConstant} value=('true' | 'false') |
    {infer VariableCall} variable=[RobotSymbol:ID] |
    {infer FunctionCall} functionCall=[FunctionDef:ID] 
                                        methodInvocation='('
                                        (args+=Expression (','args+=Expression)*)? 
                                        ')' |
    {infer RobotAdjust} robotAdjustment='ModifySpeed' args=Expression 'in' unit=DistanceUnit |
    {infer RobotMovement} robotMovement=Movement args=Expression 'in' unit=DistanceUnit |
    {infer RobotRotation} robotRotation=Rotation args=Expression |
    {infer RobotTimeSensor} robotTimeSensor='CurrentTime' 'in' unit=TimeUnit |
    {infer RobotDistanceSensor} robotDistanceSensor='CurrentDistance' 'in' unit=DistanceUnit
    ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal DOUBLE returns number: /[0-9]+.[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
