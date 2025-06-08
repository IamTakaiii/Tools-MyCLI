import { Command } from "commander";
import consola from "consola";
import degit from "degit";
import klear from "kleur";
import inquirer from "inquirer";
import { resolvePath, validateDestinationPath, validateProjectName } from "../utils/validators";
import ora from "ora";

const PUBLIC_GIT_REPO = "git@github.com:IamTakaiii/Template-Elysia.git";

const PROJECT_TYPE_CHOICES = [
	{
		name: "Elysia Project With PostgreSQL",
		value: "original",
	},
];

const determineGit = (type: string): string => {
	let repo = PUBLIC_GIT_REPO;
	switch (type) {
		case "original":
			repo += "#original-version";
			break;
		default:
			repo = PUBLIC_GIT_REPO;
			break;
	}
	return repo;
};

export const ElysiaCommand = new Command("elysia")
	.alias("ges")
	.description("Generate Elysia project structure")
	.action(async () => {
		try {
			consola.info(klear.bold().blue("Welcome to the Elysia Project Generator!"));
			const args = await inquirer.prompt([
				{
					type: "list",
					name: "type",
					message: "Select project type:",
					default: "original",
					choices: PROJECT_TYPE_CHOICES,
				},
				{
					type: "input",
					name: "name",
					message: "Enter the project name:",
					default: "my_elysia_project",
					validate: validateProjectName,
				},
				{
					type: "input",
					name: "destination",
					message: "Enter the destination path (leave empty for current directory):",
					default: "",
					validate: validateDestinationPath,
				},
			]);

			const spinner = ora("Cloning project template...").start();

			const { type, name, destination } = args;

			const resolvedDestination = destination ? resolvePath(destination) : process.cwd();

			const projectPath = `${resolvedDestination}/${name}`;

			const gitRepo = determineGit(type);

			const emitter = degit(gitRepo, {
				cache: false,
				force: true,
				verbose: true,
			});

			await emitter.clone(projectPath);

			spinner.stop();

			consola.success(
				klear.bold().green(`Project ${klear.blue(name)} created successfully at ${klear.blue(projectPath)}!`)
			);
		} catch (error) {
			consola.error(klear.bold().red("An error occurred while generating the Elysia project:"), error);
			process.exit(1);
		}
	});
