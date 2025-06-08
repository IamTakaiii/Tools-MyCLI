import { Command } from "commander";
import consola from "consola";
import degit from "degit";
import klear from "kleur";
import inquirer from "inquirer";
import { resolvePath, validateDestinationPath, validateProjectName } from "../utils/validators";
import ora from "ora";

const DJANGO_PUBLIC_GIT_REPO = "git@github.com:IamTakaiii/Template-Django.git";

const PROJECT_TYPE_CHOICES = [
	{
		name: "DRF Project With PostgreSQL",
		value: "original",
	},
];

const determineGit = (type: string): string => {
	let repo = DJANGO_PUBLIC_GIT_REPO;
	switch (type) {
		case "original":
			repo += "#original-version";
			break;
		default:
			repo = DJANGO_PUBLIC_GIT_REPO;
			break;
	}
	return repo;
};

export const DjangoCommand = new Command("django")
	.alias("gdj")
	.description("Generate Django project structure")
	.action(async () => {
		try {
			consola.info(klear.bold().blue("Welcome to the Django Project Generator!"));
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
					default: "my_django_project",
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
			consola.error(klear.bold().red("An error occurred while generating the Django project:"), error);
			process.exit(1);
		}
	});
