const prompt = require('syncprompt');

async function run() {
	while (true) {
	    console.log("\n\n\n************\nServer-side options: ");
	    console.log("1. Update database");
	    console.log("2. Create new database");
	    console.log("3. Crawl data");
	    var option = prompt("\nOption: ");
	    switch(parseInt(option)) {
	        case 1: {
	            await require('./updateDatabase.js').run();
	            break;
	        };
	        case 2: {
	        	await require('./createNewDatabase.js').run();
	        	break;
	        };
	        case 3: {
	        	await require('../scripts/crawlData.js').run();
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