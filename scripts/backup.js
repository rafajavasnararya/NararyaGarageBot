import {backup} from "../database/src/backup.js";
const result=backup();
if(result)console.log("Backup created:",result);
else console.log("Database file does not exist.");