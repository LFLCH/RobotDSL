import * as fs from 'node:fs';
import { extractDestinationAndName } from './cli-util.js';
import path from 'node:path';


export function generate(result : string, filePath: string, destination: string, format: string): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.${format}`;

    saveFile(result, generatedFilePath);
    return generatedFilePath;
}

export  function saveFile(data: string, fileName: string) {
    // saves the file in the given path from the filename. Creates the directories if they don't exist
    const directory = path.dirname(fileName);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFile(fileName, data, (err) => {
        if (err) {
            console.error(err);
        }
    });
}