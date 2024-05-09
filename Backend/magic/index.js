const prisma = require("./prisma");

const commands = {
    prisma: {
        meta: { desc: "prisma related commands" },
        options: {
            merge: {
                desc: "merges all the schema files into one file.",
                task: prisma.mergeSchemas
            }
        }
    },

};


const showHelp = () => {
    console.log("\n\nSyntax: node magic.js <command> <option>")
    console.log("\ncommands:\n");
    
    for (const [command, command_info] of Object.entries(commands)) {
        console.log(`${command}: ${command_info.meta.desc}`);

        console.log(" options: ");
        for(const [option, option_info] of Object.entries(command_info.options)){
            console.log(`  ${option}: ${option_info.desc}`);
        }
        console.log("\n");
    }
}



const main = () => {

    const args = process.argv.slice(2);
    const argc = args.length;
    if (argc < 1) {
        console.log("Must provide a command.")
        showHelp();
        return;
    }

    const command = args[0];
    if(Object.prototype.hasOwnProperty.call(commands, command)){
        const options = commands[command].options;

        if(argc < 2){
            console.log("Must provide an option.");
            showHelp();
            return;
        }

        const option = args[1];
        if(Object.prototype.hasOwnProperty.call(options, option)){
            const task = options[option].task;
            task(args.slice(2));
        }else{
            console.log("\nInvalid Option.");
            showHelp();
        }

    }else{
        console.log("\nInvalid command.");
        showHelp();
    }
}

main();
