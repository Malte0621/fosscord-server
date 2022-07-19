const path = require("path");
const fs = require("fs");
const { env } = require("process");
const { execSync } = require("child_process");
const { argv, stdout, exit } = require("process");

const parts = ["api", "util", "cdn", "gateway", "bundle"];
const bundleRequired = ["@ovos-media/ts-transform-paths"];

const removeModules = argv.includes("cleanup");

function getLines(output) {
	return output.split("\n").length;
}

function execIn(cmd, workdir) {
	try {
		return execSync(cmd, {
			cwd: workdir,
			shell: true,
			env: process.env,
			encoding: "utf-8",
		});
	} catch (error) {
		return error.stdout;
	}
}

parts.forEach((part) => {
	console.log(`Installing all packages for ${part}...`);
	execIn("npm i", path.join(__dirname, "..", "..", part));
});

parts.forEach((part) => {
	let partDir = path.join(__dirname, "..", "..", part);
	let distDir = path.join(partDir, "dist");
	let start = 0;
	start = getLines(
		execIn("npm ls --parseable --package-lock-only -a", partDir)
	);
	if (fs.existsSync(distDir))
		fs.rmSync(distDir, {
			recursive: true,
			force: true,
		});
	let x = {
		dependencies: [],
		devDependencies: [],
		invalidDirs: [],
		invalidFiles: [],
		missing: [],
		using: [],
	};
	x = JSON.parse(execIn("npx depcheck --json", partDir).stdout);

	fs.writeFileSync(
		path.join(__dirname, "..", `depclean.out.${part}.json`),
		JSON.stringify(x, null, "\t"),
		{ encoding: "utf8" }
	);

	let depsToRemove = x.dependencies.join(" ");
	if (depsToRemove) execIn(`npm r --save ${depsToRemove}`, partDir);

	depsToRemove = x.devDependencies.join(" ");
	if (depsToRemove) execIn(`npm r --save --dev ${depsToRemove}`, partDir);

	if (removeModules && fs.existsSync(path.join(partDir, "node_modules")))
		fs.rmSync(path.join(partDir, "node_modules"), {
			recursive: true,
			force: true,
		});
	let end = getLines(
		execIn("npm ls --parseable --package-lock-only -a", partDir)
	);
	console.log(`${part}: ${start} -> ${end} (diff: ${start - end})`);
});
console.log("Installing required packages for bundle...");

execIn(`npm i --save ${bundleRequired.join(" ")}`, path.join(__dirname, ".."));
