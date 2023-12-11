grammar RobotScript

entry Model:
    (functionsDef += FunctionDef | instructions += Instruction)*;

FunctionDef:
    TYPE 'function' name = ID '('(Parameter)* ')' Block;

Parameter:
    TYPE name = ID;

Type:
    returns = (VOID | BOOLEAN | INT | DOUBLE);

Block:
    '{'
        Instruction
    '}';

Instruction:
    (Assignation | FunctionCall | ControlStructure | FunctionReturn)*;

Assignation:
    VariableDecl '=' Expression';';

VariableDecl:
    TYPE name = ID;

Variable:
    name = ID;

Expression:
    BasicExpression | ArithmeticExpression | BooleanExpression;

BasicExpression:
    Variable | BOOLEAN | INT | DOUBLE;

ArithmeticExpression:
    UnaryArithmeticOperator | BinaryArithmeticOperator;

UnaryArithmeticOperator:
    ('-'ArithmeticOperand | (ArithmeticOperand ('++' | '--')) | ('++' | '--')ArithmeticOperand);

BinaryArithmeticOperator:
    ArithmeticOperand ('+' | '-' | '*' | '/' | '%' | '<' | '<=' | '>' | '>=' | '==' | '!=') ArithmeticOperand;

ArithmeticOperand:
    ArithmeticExpression | Variable | INT | DOUBLE;

BooleanExpression:
    UnaryBooleanOperator | BinaryBooleanOperator;

UnaryBooleanOperator:
    '!' BooleanOperand;

BinaryBooleanOperator:
    BooleanOperand ('&&' | '||' | '==' | '!=') BooleanOperand;

BooleanOperand:
    BooleanExpression | Variable | BOOLEAN;

FunctionCall:
   (Type name = ID '('(Expression)*');') | RobotAction';' | RobotSensor';';

RobotAction:
    Movement | Rotation;

Movement:
    returns = MOVEMENT DOUBLE UNIT;

Rotation:
    returns = ROTATION DOUBLE;

RobotSensor:
    returns = SENSOR;

ControlStructure:
    While | If;

While:
    'while(' BooleanExpression ')' Block;

If:
    'if(' BooleanExpression ')' Then Else;

Then:
    Block;

Else:
    ('elseif(' BooleanExpression')')*
    'else' Block;

FunctionReturn:
    'return' Expression;


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal MOVEMENT returns string: ("Forward" | "Backward" | "Left" | "Right");
terminal ROTATION returns string: ("Clock" | "Anticlock");
terminal SENSOR returns string: ("GetDistance" | "GetTime");
terminal UNIT returns string:("mm" | "cm" | "m");
terminal TYPE returns string: ("void" | "boolean" | "int" | "double");
terminal INT returns number: /[0-9]+/;
terminal BOOLEAN returns string: ("True" | "False");
terminal DOUBLE returns number: /[0-9]+.[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal VOID returns string: "NULL";

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
