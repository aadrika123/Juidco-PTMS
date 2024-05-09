// import fs  from "fs";
import * as readline from "readline";
import * as fs from "fs";
import * as process from "process";

// !ON WINDOWS SYSTEM CHANGE THE PATH NAMES ACCORDINGLY
const dao_foler =
  "/home/krish/Desktop/JuidcoHrms/backend/src/component/juidcoHrms/dao";
const controller_folder =
  "/home/krish/Desktop/JuidcoHrms/backend/src/component/juidcoHrms/controller";
const route_folder =
  "/home/krish/Desktop/JuidcoHrms/backend/src/component/juidcoHrms/route";

// ---------------------------------- TEMPLATE -----------------------------------------//
const controller_template_path =
  "/home/krish/Desktop/JuidcoHrms/backend/gen/templates/controller_template.ts";
let controller_template = fs.readFileSync(controller_template_path).toString();

// ---------------------------------- TEMPLATE -----------------------------------------//

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const toPascalCase = (s) => {
  s = s.replace("_", "-");
  return (s = s
    .replace(/\w+/g, function (w) {
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    })
    .replaceAll("-", ""));
};

const toCamelCase = (s) => {
  s = toPascalCase(s);
  return s.charAt(0).toLowerCase() + s.substring(1);
};

class FileGenerator {
  generate_file = (filename, template, className) => {
    const classNameInPascalCase = toPascalCase(className);
    template = template.replaceAll(/Controller/g, classNameInPascalCase);
    try {
      fs.writeFileSync(filename, template, { encoding: "utf8", flag: "w" });
    } catch (error) {
      throw Error(error);
    }
  };
}

rl.question("what is your name", (ans) => {
  // const dao_gen = new FileGenerator();
  const controller_gen = new FileGenerator();
  // dao_gen.generate_file(`/${dao_foler}/${ans}.ts`);
  controller_gen.generate_file(
    `/${controller_folder}/${ans}.ts`,
    controller_template,
    ans
  );
  rl.close();
});
