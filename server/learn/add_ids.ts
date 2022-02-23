import { readdirSync, readFileSync, writeFileSync } from "fs";
import {nanoid} from "nanoid";
import path from "path";

const dir = __dirname + "/../../src/data/learn";

readdirSync(dir).forEach(fileName => {
  const filePath = path.join(dir, fileName);
  const file = readFileSync(filePath, 'utf-8');
  const withId = file.replace(/fen: /g, () => 'id: "'+nanoid(10) + '",\n      fen: ');
  writeFileSync(filePath, withId, 'utf-8');
})
