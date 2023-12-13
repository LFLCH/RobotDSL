import * as ASTInterfaces from '../generated/ast.js';
import { AstNode, CstNode, LangiumDocument, Reference } from 'langium';

export interface RobotScriptVisitor{
    // TODO : create one visit method for each concept of the language
    visitModel(node : ASTInterfaces.Model) : any;
    visitFunctionDef(node : ASTInterfaces.FunctionDef) : any;
    visitBlock(node : ASTInterfaces.Block) : any;
    visitParameter(node : ASTInterfaces.Parameter) : any;
    visitType(node : ASTInterfaces.Type) : any;
    visitStatement(node : ASTInterfaces.Statement) : any;
    visitExpression(node : ASTInterfaces.Expression) : any;
}

// TODO : create one concrete class for each concept
export class VModel implements ASTInterfaces.Model {
   constructor(
        public $type: 'Model',
         public functionsDef: ASTInterfaces.FunctionDef[],
         public instructions: ASTInterfaces.Statement[],
         public $container?: AstNode | undefined,
         public $containerProperty?: string | undefined,
         public $containerIndex?: number | undefined,
         public $cstNode?: CstNode | undefined,
         public $document?: LangiumDocument<AstNode> | undefined
   ){}
   accept(visitor: RobotScriptVisitor): any {}
}

export class VFunctionDef implements ASTInterfaces.FunctionDef {
    constructor(
        public $type: 'FunctionDef',
        public $container: ASTInterfaces.Model,
        public block: ASTInterfaces.Block,
        public name: string,
        public params: ASTInterfaces.Parameter[],
        public type: ASTInterfaces.Type,
        public $containerProperty?: string | undefined,
        public $containerIndex?: number | undefined,
        public $cstNode?: CstNode | undefined,
        public $document?: LangiumDocument<AstNode> | undefined
    ){}
    accept(visitor: RobotScriptVisitor): any {}
}

export class VBlock implements ASTInterfaces.Block {
    constructor(
        public $type: 'Block',
        public $container: ASTInterfaces.FunctionDef,
        public instructions: ASTInterfaces.Statement[],
        public statements: ASTInterfaces.Statement[],
        public $containerProperty?: string | undefined,
        public $containerIndex?: number | undefined,
        public $cstNode?: CstNode | undefined,
        public $document?: LangiumDocument<AstNode> | undefined,
    ){}
    accept(visitor: RobotScriptVisitor): any {}
}

