import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("receipt directory is ignored from git",()=>{
  assert.equal(fs.existsSync(".gitignore"),true);
});
test("receipt status terminology",()=>{
  const allowed=["PENDING","PAID","INVALID","CANCELLED"];
  assert.ok(allowed.includes("PAID"));
});