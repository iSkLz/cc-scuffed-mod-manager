const fs = require('fs'), path = require('path');

recursiveScan('src');

function recursiveScan(folderPath) {
	let entries = fs.readdirSync(folderPath, { withFileTypes: true });
	let folders = [];
	
	let files = entries.filter(entry => {
		if (entry.isDirectory()) {
			folders.push(entry.name);
			return false;
		} else return entry.name.match(/\.html|html|png|js|json$/);
	});
	
	files.forEach(file => {
		let destFolderPath = folderPath.replace('src', 'build');
		if (!fs.existsSync(destFolderPath)) fs.mkdirSync(destFolderPath, { recursive: true });
		fs.copyFileSync(path.join(folderPath, file.name), path.join(destFolderPath, file.name));
	});	
	
	folders.forEach(folder => recursiveScan(path.join(folderPath, folder)));
}