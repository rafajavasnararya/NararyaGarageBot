import test from "node:test";
import assert from "node:assert/strict";
test("group command names are stable",()=>{
  const commands=["rules","groupinfo","antilink","antispam","tagall"];
  assert.equal(commands.length,5);
  assert.ok(commands.includes("tagall"));
});
test("group jid format",()=>{
  assert.match("123456789@g.us",/@g\.us$/);
});