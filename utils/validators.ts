import path from "path";
import klear from "kleur";

export const validateProjectName = (name: string): boolean | string => {
	if (!name) return klear.red("Project name cannot be empty.");
	if (!/^[a-zA-Z0-9_]+$/.test(name))
		return klear.red("Project name can only contain letters, numbers, and underscores.");
	return true;
};

export const validateDestinationPath = (input: string): boolean | string => {
	if (!input) return true;
	const resolvedPath = path.resolve(input);
	if (!path.isAbsolute(resolvedPath)) {
		return klear.red("Please provide an absolute path.");
	}
	return true;
};

export const resolvePath = (input: string): string => {
	if (!input) return process.cwd();
	const resolvedPath = path.resolve(input);
	return resolvedPath;
};
