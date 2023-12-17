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
    Expression ';' ;

Assignment:
    symbol=[RobotSymbol:ID] '=' expression=Expression;

FunctionReturn:
    'return' expression=Expression ';';

Movement:
    movement=('Forward' | 'Backward' | 'Left' | 'Right');

Rotation:
    rotation=('Clock' | 'Anticlock');

TimeUnit:
    unit=('s' | 'ms');

DistanceUnit:
    unit=('m' | 'dm' | 'cm' | 'mm');

ControlStructure:
   For | While | If;

For:
    'for' '(' 
    init=(VariableDecl | Assignment) ';'
    condition=Expression';'
    increment=Assignment
    ')'
    block=Block
    ;


While:
    'while' '(' condition=Expression ')' block=Block
    ; 

If:
    'if''('mainCondition=Expression')' thenBlock=Block
    ('elseif''('subsidaryConditions+=Expression')'elifBlock=Block)*
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
        {infer Equality.left=current} operator=("==" | "!=")
        right=Comparison
    )*
    ;

Comparison infers Expression:
    PlusOrMinus (
        {infer Comparison.left=current} operator=(">=" | "<=" | ">" | "<")
        right=PlusOrMinus
    )*
    ;

PlusOrMinus infers Expression:
    MulOrDiv (
        ( {infer PlusMinus.left=current} operator=('+' | '-'))
        right=MulOrDiv
    )*
    ;

MulOrDiv infers Expression:
    Primary (
        {infer MulDiv.left=current} operator=('*'|'/' |'%')
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
    {infer BoolConstant} value=('true'|'false') |
    {infer VariableCall} variable=[RobotSymbol:ID] |
    {infer FunctionCall} functionCall=[FunctionDef:ID] '(' (args+=Expression (','args+=Expression)*)? ')' |
    {infer RobotSpeedAdjust} 'ModifySpeed' speed=Expression 'in' unit=DistanceUnit |
    {infer RobotMovement} robotMovement=Movement distance=Expression 'in' unit=DistanceUnit |
    {infer RobotRotation} robotRotation=Rotation angle=Expression |
    {infer RobotTimeSensor} 'CurrentTime' 'in' unit=TimeUnit |
    {infer RobotDistanceSensor} 'CurrentDistance' 'in' unit=DistanceUnit |
    {infer Print} 'Print'  expression=Expression  
    ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal DOUBLE returns number: /[0-9]+.[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
