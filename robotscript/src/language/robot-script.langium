grammar RobotScript

entry Model:
    (functionsDef += FunctionDef | functionsCall+=FunctionCall | instructions+=Instruction)*;

FunctionDef:
    TYPE 'function' name=ID '('(Parameter)* ')' Block;

Parameter:
    TYPE name=ID;

Type:
    BOOLEAN | INT | DOUBLE;

Block:
    '{'
        Instructions
    '}';

Instruction:
    (Assignation | FunctionCall | ControlStructure)*;


Assignation:
    Variable '=' Expression;

Variable:
    TYPE name=ID;

Expression:
    ArithmeticExpression | BooleanExpression;

ArithmeticExpression:
    UnaryArithmeticOperator | BinaryArithmeticOperator;

UnaryArithmeticOperator:
    ('-'ArithmeticOperand | (ArithmeticOperand ('++' | '--')) | ('++' | '--')ArithmeticOperand);

BinaryArithmeticOperator:
    ArithmeticOperand ('+' | '-' | '*' | '/' | '%' | '<' | '<=' | '>' | '>=' | '==' | '!=' | '+=' | '-=' | '*=' | '/=' | '%=') ArithmeticOperand;

ArithmeticOperand:
    Variable | INT | DOUBLE;

BooleanExpression:
    UnaryBooleanOperator | BinaryBooleanOperator;

UnaryBooleanOperator:
    '!' BooleanOperand;

BinaryBooleanOperator:
    BooleanOperand ('&&' | '||' | '==' | '!=') BooleanOperand;

BooleanOperand:
    Variable | BOOLEAN;

FunctionCall:
    name=ID '('(Type)');'

Person:
    'person' name=ID;

Greeting:
    'Hello' person=[Person:ID] '!';

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal TYPE returns string: ("boolean" | "int" | "double");
terminal INT returns number: /[0-9]+/;
terminal BOOLEAN returns number: /(0 | 1)/;
terminal DOUBLE returns number: /[0-9]+.[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
