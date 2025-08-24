import fs from "fs/promises"
import path from "path"

export const writeJsonToFile = async (data, filePath) => {
    const jsonData = JSON.stringify(data, null, 4);

    try {
        await fs.unlink(filePath).catch((err) => {
            if (err.code !== 'ENOENT') throw err;
        });

        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}
