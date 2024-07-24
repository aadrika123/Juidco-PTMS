/*
merges individual .prisma files to one schema.prisma file
*/

const fs = require('fs');

const getSchemaFileList = async (folder, list) => {

    const items = fs.readdirSync(folder);
    const subFolders = [];
    for (let i = 0; i < items.length; i++) {
        const file = items[i];
        const x = folder + "/" + file;
        if (fs.lstatSync(x).isDirectory()) {
            subFolders.push(x);
        } else {
            list.push(x);
        }
    }

    for (let i = 0; i < subFolders.length; i++) {
        await getSchemaFileList(subFolders[i], list);
    }
}


const generateHistoryTable = async(d, outputFile) => {
    const lines = d.split("\n");
    let twinSchema = "";

    let extraFields = [];

    lines.forEach(line => {
        line = line.trim();
        if(line.startsWith("}") || line.indexOf("has history") != -1){
            const x = () => {};
            x();
        }
        else if(line.startsWith("model")){
            // console.log(line);
            const modelName = line.match( /model\s*(.*)\s\{/)[1];
            console.log("Creating twin (history) schema for "+modelName);
            line = line.replace(modelName, modelName + "_history");
            twinSchema += line + "\n";
        }else if(line.startsWith("id")){
            extraFields.push("record_" + line + "\n");
            twinSchema += "id\t\t\t\t\t\tInt\n";
        }
        else if(line.startsWith("created_at"))
        {
            twinSchema += "created_at\t\t\t\t\t\tDateTime?\n";
            extraFields.push(line.replaceAll("created_at", "record_created_at") + "\n");

        }else if(line.startsWith("updated_at")){
            twinSchema += "updated_at\t\t\t\t\t\tDateTime?\n";
        }
        else if(line.indexOf("references") == -1){
            twinSchema += line + "\n";
        }

    });


    // console.log(twinSchema);
    fs.appendFileSync(outputFile, twinSchema + "\n");

    extraFields.forEach((item) => {
        fs.appendFileSync(outputFile, item );
    });

    fs.appendFileSync(outputFile, "}\n");


}

const mergeSchemas = async (args) => {

    const schemaFolder = "./prisma/schemas";

    const list = [];
    await getSchemaFileList(schemaFolder, list);

    // console.log(list);

    const outputFile = "./prisma/schema.prisma";

    fs.writeFileSync(outputFile, "");

    list.forEach(file => {
        var d = fs.readFileSync(file).toString();
        fs.appendFileSync(outputFile, d + "\n");


        // generate history table if required
        const firstLine = (d.match(/(^.*)/) || [])[1] || '';
        if(firstLine.indexOf("has history") != -1){
            generateHistoryTable(d, outputFile);
        }
    });

    console.log(`Merged ${list.length} schema files into ${outputFile}`);
}

module.exports = {
    mergeSchemas
}
