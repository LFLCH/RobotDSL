import chalk from 'chalk';
import { Command } from 'commander';
import { RobotScriptLanguageMetaData } from '../language/representation/module.js';
import { createRobotScriptServices } from '../language/robot-script-module.js';
import { extractAstNode } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import { Interpreter } from '../interpretation/interpreter.js';
import { VModel } from '../language/semantics/visitor.js';
import { EnvironmentParameters } from '../interpretation/environment/parameters.js';
import { Compiler } from '../compilation/compiler.js';
import { generate } from './generator.js';
import { RobotEnvironment } from '../interpretation/environment/environment.js';


export const generateArduinoAction = async (fileName: string, opts: CompilationOptions): Promise<void> => {
    const services = createRobotScriptServices(NodeFileSystem).RobotScript;
    const model = await extractAstNode<VModel>(fileName, services);
    const compiler = new Compiler();
    const result = compiler.compile(model);
    if(opts.destination){
        const generatedFilePath =  generate(result, fileName, opts.destination,'ino');
        console.log(chalk.green(`Arduino code generated successfully: ${generatedFilePath}`));
    }
    if(opts.log === "true"){
        console.log(result);
    }
}

export const interpretRobotScriptFile = async (fileName: string, opts : InterpretationOptions): Promise<void> => {
    const services = createRobotScriptServices(NodeFileSystem).RobotScript;
    const model = await extractAstNode<VModel>(fileName, services);
    const params : EnvironmentParameters = {
        robotsNumber: parseInt(opts.robotsNumber),
        spaceAtStart: parseFloat(opts.spaceAtStart)
    }
    const interpreter =  new Interpreter(RobotEnvironment.getParameteredEnvironment(params));
    const environment = interpreter.interpret(model);
    const result = JSON.stringify(environment, undefined, 2);
    if(opts.destination){
        const generatedFilePath =  generate(result, fileName, opts.destination, 'json');
        console.log(chalk.green(`RunningEnvironment generated successfully: ${generatedFilePath}`));
    }
    if(opts.log === "true"){
        console.log(result);
    }

}


interface InterpretationOptions {
    destination: string,
    log: string,
    robotsNumber: string,
    spaceAtStart: string
}

interface CompilationOptions {
    destination: string,
    log: string
}


export default function(): void {
    const program = new Command();

    const fileExtensions = RobotScriptLanguageMetaData.fileExtensions.join(', ');

    program
        .command('compile')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of the generated Arduino file', 'generated')
        .option('-l, --log', 'logs the generated Arduino to the console', "false")
        .description('compiles a Roboscript file (.rbs) into Arduino code')
        .action(generateArduinoAction);
    
    program
        .command('interpret')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of the generated JSON file from (RunningEnvironment format)', undefined)
        .option('-l, --log', 'logs the generated JSON file to the console', "true")
        .option('-r, --robotsNumber <number>', 'number of robots', '1')
        .option('-s, --spaceAtStart <number>', 'space between robots at start', '0')
        .description('interprets a RobotScript file (.rbs)')
        .action(interpretRobotScriptFile);
    program.parse(process.argv);
}
