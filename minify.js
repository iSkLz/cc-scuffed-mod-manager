const fs = require('fs');
fs.writeFileSync(process.argv[3] != null ? process.argv[3] : process.argv[2], fs.readFileSync(process.argv[2], "utf8").replace(/\s/g /*all whitespace characters*/, ""))