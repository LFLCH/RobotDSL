import type { Game } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RpcLanguageMetaData } from '../language/generated/module.js';
import { createRpcServices } from '../language/rpc-module.js';
import { extractAstNode, extractDocument } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import { generateGameDescription, generateJavaScript } from '../generator/file-generator.js';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRpcServices(NodeFileSystem).Rpc;
    const model = await extractAstNode<Game>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
    console.log(generatedFilePath)
    console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

/**
 * 
 * @param fileName 
 * @param opts 
 * ./bin/cli.js describe  examples/test.rpc 
 */
export const parseGameAndDescribe = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRpcServices(NodeFileSystem).Rpc;
    const model = await extractAstNode<Game>(fileName, services);
    const generatedFilePath = generateGameDescription(model, fileName, opts.destination);
    console.log(chalk.green(`Results stored in : ${generatedFilePath}`));
}

/**
 * 
 * @param name 
 * run with ./bin/cli.js hello
 */
export const helloName = async (name : string) : Promise<void> =>{
    name = name ? name : "user";
    console.log(`hello ${name} !`);
}

/**
 * 
 * @param fileName 
 * run with ./bin/cli.js parseAndValidate examples/failing_test.rpc
 */
export const parseAndValidate = async (fileName: string): Promise<void> => {
    // retrieve the services for our language
    const services =  createRpcServices(NodeFileSystem).Rpc; 
    // extract a document for our program
    const document = await extractDocument(fileName, services);
    // extract the parse result details
    const parseResult = document.parseResult;
    // verify no lexer, parser, or general diagnostic errors show up
    if (parseResult.lexerErrors.length === 0 && 
        parseResult.parserErrors.length === 0
    ) {
        console.log(chalk.green(`Parsed and validated ${fileName} successfully!`));
    } else {
        console.log(chalk.red(`Failed to parse and validate ${fileName}!`));
    }
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    // program
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     .version(require('../../package.json').version);

    const fileExtensions = RpcLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program
        .command('describe')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(parseGameAndDescribe);

    program
        .command('hello')
        .argument('[name]', 'A string representing a name')
        .description('Says hello')
        .action(helloName)

    program
        .command('parseAndValidate')
        .argument('<file>', 'Source file to parse & validate (ending in ${fileExtensions})')
        .description('Indicates where a program parses & validates successfully, but produces no output code')
        .action(parseAndValidate) // we'll need to implement this function

    program.parse(process.argv);
}
