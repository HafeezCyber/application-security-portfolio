"use strict";

const { execFile } = require("node:child_process");

const HOSTNAME_PATTERN =
  /^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/;

/*
 * REMEDIATED EXAMPLE
 *
 * Validate the hostname and pass arguments directly
 * to an executable without invoking a shell.
 */

function lookupHost(hostname, callback) {
  if (
    typeof hostname !== "string" ||
    !HOSTNAME_PATTERN.test(hostname) ||
    hostname.split(".").some(
      (label) =>
        label.length === 0 ||
        label.length > 63 ||
        label.startsWith("-") ||
        label.endsWith("-")
    )
  ) {
    throw new TypeError("Invalid hostname");
  }

  execFile(
    "nslookup",
    [hostname],
    { shell: false, timeout: 5000 },
    callback
  );
}

module.exports = { lookupHost };
