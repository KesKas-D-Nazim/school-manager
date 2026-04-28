import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import {teacherExcelColumns} from "./src/modules/admin/types"

async function isExcelMatches(filePath : string ) : Promise<boolean> {
        const buffer = await readFile(filePath);
        const woorkbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = woorkbook.SheetNames[0];
        const sheet = woorkbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
        console.log(data.slice(1)); 
        return true 
    }

     // console.log(await isExcelMatches("./example.xlsx"));
     