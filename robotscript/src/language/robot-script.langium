grammar RobotScript

entry Model:
    (functionsDef+=FunctionDef | instructions+=Statement)*;

FunctionDef:
    type=Type 'function' name=ID '('(params+=Parameter(',' params+=Parameter)*)? ')' block=Block;

Parameter:
    type=Type name=ID;

VariableDeclaration:
    type=Type name=ID;

RobotSymbol:
    Parameter | VariableDeclaration;




Block:
    {infer Block} '{' statements += Statement* '}';

Statement:
    Assignation |
    FunctionReturn |
    Expression ';' |
    ControlStructure
    ;

Assignation:
    VariableDeclaration '=' expression=Expression';';

FunctionReturn:
    'return' expression=Expression;


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
        {infer MulOrDiv.left=current} op=('*'|'/')
        right=Primary
    )*
    ;

Primary infers Expression:
    '(' Expression ')' |
    {infer Not} "!" expression=Primary | 
    SelectionExpression
    ;

SelectionExpression infers Expression:
    Atomic
    (
        (methodInvocation?='('
            (args+=Expression (','args+=Expression)*)? ')' )?
    )*
    ;   



Atomic infers Expression:
    {infer IntConstant} value=INT |
    {infer DoubleConstant} value = DOUBLE |
    {infer BoolConstant} value = ('true' | 'false') |
    {infer VariableCall} variable=[RobotSymbol:ID]
    ;

ControlStructure:
    While;

While:
    'while(' expr=Expression ')' block=Block;

Type:
    type='void' | 'boolean' | 'int' | 'double'
    ;


hidden terminal WS: /\s+/;
terminal VOID returns string: "NULL";
terminal ID: /[_a-zA-Z][\w_]*/;
terminal MOVEMENT returns string: ("Forward" | "Backward" | "Left" | "Right");
terminal ROTATION returns string: ("Clock" | "Anticlock");
terminal SENSOR returns string: ("GetDistance" | "GetTime");
terminal UNIT returns string:("mm" | "cm" | "m");
terminal INT returns number: /[0-9]+/;
terminal BOOLEAN returns string: ("True" | "False");
terminal DOUBLE returns number: /[0-9]+.[0-9]+/;
// terminal TYPE returns string: ("void" | "boolean" | "int" | "double");

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
