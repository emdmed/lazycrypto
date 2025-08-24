import fs from "fs/promises"
import path from "path"

export const readJsonFromFile = async (filePath) => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`File not found: ${filePath}`);
            return null;
        }
        if (err instanceof SyntaxError) {
            console.error(`Invalid JSON in file: ${filePath}`, err.message);
            return null;
        }
        console.error("Error reading JSON file:", err);
        return null;
    }
}