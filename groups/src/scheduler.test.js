import test from "node:test";
import assert from "node:assert/strict";

process.env.GROUP_TIMEZONE = "Asia/Jakarta";
process.env.GROUP_CLOSE_HOUR = "23";
process.env.GROUP_OPEN_HOUR = "5";

test("schedule configuration uses WIB", async () => {
  const { scheduleConfig } = await import("./scheduler.js");
  const config = scheduleConfig();
  assert.equal(config.timezone, "Asia/Jakarta");
  assert.equal(config.close, "23:00");
  assert.equal(config.open, "05:00");
});
