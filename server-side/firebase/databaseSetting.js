const read = require('readline-sync');

async function run() {
	while (true) {
	    console.log("\n\n\n************\nServer-side options: ");
	    console.log("1. Update database");
	    console.log("2. Create new database");
	    var option = read.question("\nOption: ");
	    switch(parseInt(option)) {
	        case 1: {
	            await require('./updateDatabase.js').run();
	            break;
	        };
	        case 2: {
	        	await require('./createNewDatabase.js').run();
	        	break;
	        };
	        default: {
	        	console.log("Nothing to do!");
	        	break;
	        }
	    }
	}
}

run();