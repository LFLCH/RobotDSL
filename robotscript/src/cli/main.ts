import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { RobotScriptLanguageMetaData } from '../language/generated/module.js';
import { createRobotScriptServices } from '../language/robot-script-module.js';
import { extractAstNode } from './cli-util.js';
import { generateArduino } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import { Interpreter } from '../interpretation/interpreter.js';

// export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
//     const services = createRobotScriptServices(NodeFileSystem).RobotScript;
//     const model = await extractAstNode<Model>(fileName, services);
//     const generatedFilePath = generateJavaScript(model, fileName, opts.destination);
//     console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
// };


export const generateArduinoAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createRobotScriptServices(NodeFileSystem).RobotScript;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateArduino(model, fileName);
    console.log(chalk.green(`Arduino code generated successfully: ${generatedFilePath}`));
}

export const interpretRobotScriptFile = async (fileName: string): Promise<void> => {
    const services = createRobotScriptServices(NodeFileSystem).RobotScript;
    const model = await extractAstNode<Model>(fileName, services);
    const interpreter = new Interpreter();
    interpreter.interpret(model);
}

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    // program
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // .version(require('../../package.json').version);

    const fileExtensions = RobotScriptLanguageMetaData.fileExtensions.join(', ');
    // program
    //     .command('generate')
    //     .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    //     .option('-d, --destination <dir>', 'destination directory of generating')
    //     .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
    //     .action(generateAction);

    program
        .command('arduino')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates Arduino file from a RobotScript file (.rbs)')
        .action(generateArduinoAction);
    
    program
        .command('interpret')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .description('interprets a RobotScript file (.rbs)')
        .action(interpretRobotScriptFile);
    program.parse(process.argv);
}
