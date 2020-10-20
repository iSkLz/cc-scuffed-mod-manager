const { exec, execSync } = require('child_process');
const fs = require('fs'), path = require('path');
console.log("Compiling Materialize CSS");
exec("npm run mat");
console.log("Running server");
exec("npm run server", { cwd: path.resolve("build") });

console.log("Starting filesystem watcher");
fs.watch("src", { recursive: true }, build);

function build(e, file) {
	console.log("Detected change, executing build...");
	if (file.match(/\.ts$/))
		execSync("npm run ts");
	execSync("npm run static");
}