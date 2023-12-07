import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from '../cli/cli-util.js';
import { Game } from '../language/generated/ast.js';
import { describeGame, translateToArduino } from './generator.js';




export function generateJavaScript(model: Game, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);
    // model.plays.forEach(play => fileNode.append(`console.log('Hello, ${play.player.ref?.name}!');`, NL));

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    console.log(generatedFilePath)
    return generatedFilePath;
}


export function generateGameDescription(game: Game, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.json`;

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }

    const result = describeGame(game);

    fs.writeFileSync(generatedFilePath, JSON.stringify(result, undefined, 2));
    return generatedFilePath;
}

export function generateIno(game: Game, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.ino`;

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }

    const result = translateToArduino(game);

    fs.writeFileSync(generatedFilePath, result);
    return generatedFilePath;
}