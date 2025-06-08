import { Command } from "commander";
import consola from "consola";
import path from "path";
import fs from "fs/promises";

type RenameCommandOptions = { prefix?: string; suffix?: string; number?: number; extension?: string };

const generateNewFileName = (name: string, ogExtension: string, prefix?: string, suffix?: string, number?: number) => {
	const baseName = path.basename(name, ogExtension);
	const newFileName = [
		prefix ? `${prefix}_` : "",
		baseName,
		suffix ? `_${suffix}` : "",
		number !== undefined ? `_${number}` : "",
		ogExtension,
	].join("");
	return newFileName;
};

export const RenameCommand = new Command("rename")
	.alias("rn")
	.description("Rename a file or files in a directory")
	.argument("<source>", "Source file or directory to rename files in")
	.argument("<name>", "New name for the file(s)")
	.option("-p, --prefix <prefix>", "Prefix to add to the file name")
	.option("-s, --suffix <suffix>", "Suffix to add to the file name")
	.option("-n, --number <number>", "Number to add to the file name", parseInt)
	.option("-e, --extension <extension>", "File extension to rename", ".txt")
	.action(async (source: string, newName: string, options: RenameCommandOptions) => {
		const stats = await fs.stat(source);
		const isDirectory = stats.isDirectory();

		if (!isDirectory) {
			const fileName = path.basename(source);
			const fileExtension = options.extension || path.extname(fileName) || ".txt";
			const newFileName = generateNewFileName(newName, fileExtension, options.prefix, options.suffix, options.number);
			const newFilePath = path.join(path.dirname(source), newFileName);
			await fs.rename(source, newFilePath);
			consola.success(`Renamed ${fileName} to ${newFileName}`);
			return;
		}

		const files = await fs.readdir(source);
		for (const file of files) {
			const filePath = path.join(source, file);
			const stats = await fs.stat(filePath);
			if (stats.isFile()) {
				const fileExtension = path.extname(file) || options.extension || ".txt";
				const newFileName = generateNewFileName(newName, fileExtension, options.prefix, options.suffix, options.number);
				const newFilePath = path.join(source, newFileName);
				await fs.rename(filePath, newFilePath);
				consola.success(`Renamed ${file} to ${newFileName}`);
			}
		}
	});
