import fs from "node:fs";
import path from "node:path";

const ignored = new Set(["node_modules", ".git", "data", "receipts"]);
const extensions = new Set([".js", ".ts", ".py", ".css", ".cpp", ".h", ".sql", ".sh", ".json"]);
let files = 0;
let lines = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) {
      files++;
      lines += fs.readFileSync(full, "utf8").split(/\r?\n/).length;
    }
  }
}
walk(process.cwd());
console.log(JSON.stringify({ sourceFiles: files, totalLines: lines }, null, 2));
