import packageJson from "./package.json" assert { type: "json" };

import { program } from "commander";
import consola from "consola";

import { RenameCommand } from "./commands/rename.command";
import { DjangoCommand } from "./commands/django.command";
import { ElysiaCommand } from "./commands/elysia.command";

program
	.version(packageJson.version)
	.name("files-cli")
	.description("A CLI for managing files and directories")
	.action((options: {}) => {
		consola.info("Welcome to Files CLI!");
	});

program.addCommand(RenameCommand);
program.addCommand(DjangoCommand);
program.addCommand(ElysiaCommand);

program.parse(process.argv);
