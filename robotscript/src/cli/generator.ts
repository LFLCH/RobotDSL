import type { Model } from '../language/generated/ast.js';
// import * as fs from 'node:fs';
// import { CompositeGeneratorNode, NL, toString } from 'langium';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

// export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
//     const data = extractDestinationAndName(filePath, destination);
//     const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

//     const fileNode = new CompositeGeneratorNode();
//     fileNode.append('"use strict";', NL, NL);
//     // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));
//     // model.instructions.forEach(instruction => fileNode.append(`console.log('${instruction}');`, NL));

//     if (!fs.existsSync(data.destination)) {
//         fs.mkdirSync(data.destination, { recursive: true });
//     }
//     fs.writeFileSync(generatedFilePath, toString(fileNode));
//     return generatedFilePath;
// }

export function generateArduino(model: Model, filePath: string){
    console.log("Instructions: ")
    // model.instructions.forEach(instruction => console.log(`${instruction}`));
    console.log("Functions: ")
    // model.functionsDef.forEach(functionDef => console.log(`${functionDef}`));
}