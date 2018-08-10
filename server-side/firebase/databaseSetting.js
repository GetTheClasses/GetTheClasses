const read = require('readline-sync');

async function run() {
	while (true) {
	    console.log("\n\n\n************\nServer-side options: ");
	    console.log("1. Update database");
	    var option = read.question("\nOption: ");
	    switch(parseInt(option)) {
	        case 1: {
	            await require('./updateDatabase.js').run();
	            break;
	        }
	    }
	}
}

run();