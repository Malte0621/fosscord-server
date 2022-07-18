const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { getSystemErrorMap } = require("util");
const { argv, stdout, exit } = require("process");

if(argv.includes("help")) {
	console.log(`Fosscord build script help:

Arguments:
  clean			Cleans up previous builds
  copyonly		Only copy source files, don't build (useful for updating assets)
  verbose		Enable verbose logging
  logerrors		Log build errors to console
  pretty-errors		Pretty-print build errors`);
	exit(0);
}

let steps = 2, i = 0;
if (argv.includes("clean")) steps++;
if (argv.includes("copyonly")) steps--;
const dirs = ["api", "util", "cdn", "gateway", "bundle"];

const verbose = argv.includes("verbose") || argv.includes("v");
const logerr = argv.includes("logerrors");
const pretty = argv.includes("pretty-errors");

let copyRecursiveSync = function(src, dest) {
	if(verbose) console.log(`cpsync: ${src} -> ${dest}`);
	let  exists = fs.existsSync(src);
	if(!exists){
		console.log(src + " doesn't exist, not copying!");
		return;
	}
	let  stats = exists && fs.statSync(src);
	let isDirectory = exists && stats.isDirectory();
	if (isDirectory) {
	  fs.mkdirSync(dest, {recursive: true});
	  fs.readdirSync(src).forEach(function(childItemName) {
		copyRecursiveSync(path.join(src, childItemName),
						  path.join(dest, childItemName));
	  });
	} else {
	  fs.copyFileSync(src, dest);
	}
  };

if (argv.includes("clean")) {
	console.log(`[${++i}/${steps}] Cleaning...`);
	dirs.forEach((a) => {
		let d = "../" + a + "/dist";
		if (fs.existsSync(d)) {
			fs.rmSync(d, { recursive: true });
			if (verbose) console.log(`Deleted ${d}!`);
		}
	});
}

console.log(`[${++i}/${steps}] Copying src files...`);
copyRecursiveSync(path.join(__dirname, "..", "..", "api", "assets"), path.join(__dirname, "..", "dist", "api", "assets"));
copyRecursiveSync(path.join(__dirname, "..", "..", "api", "client_test"), path.join(__dirname, "..", "dist", "api", "client_test"));
copyRecursiveSync(path.join(__dirname, "..", "..", "api", "locales"), path.join(__dirname, "..", "dist", "api", "locales"));
dirs.forEach((a) => {
	copyRecursiveSync("../" + a + "/src", "dist/" + a + "/src");
	if (verbose) console.log(`Copied ${"../" + a + "/dist"} -> ${"dist/" + a + "/src"}!`);
});

if (!argv.includes("copyonly")) {
	console.log(`[${++i}/${steps}] Compiling src files ...`);

	let buildFlags = ''
	if(pretty) buildFlags += '--pretty '

	try {
		execSync(
			'node "' +
				path.join(__dirname, "..", "node_modules", "typescript", "lib", "tsc.js") +
				'" -p "' +
				path.join(__dirname, "..") +
				'" ' + buildFlags,
			{
				cwd: path.join(__dirname, ".."),
				shell: true,
				env: process.env,
				encoding: "utf8"
			}
		)
	} catch (error) {
		if(verbose || logerr) {
			error.stdout.split(/\r?\n/).forEach((line) => {
				let _line = line.replace('dist/','',1);
				if(!pretty && _line.includes('.ts(')) {
					//reformat file path for easy jumping
					_line = _line.replace('(',':',1).replace(',',':',1).replace(')','',1)
				}
				console.error(_line);
			})
		}
		console.error(`Build failed! Please check build.log for info!`);
		if(pretty) fs.writeFileSync("build.log.ansi",  error.stdout);
		fs.writeFileSync("build.log",  error.stdout.replaceAll(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
	}
}

