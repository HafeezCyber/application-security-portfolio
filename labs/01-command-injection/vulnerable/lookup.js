"use strict";

const { exec } = require("node:child_process");

/*
 * INTENTIONALLY VULNERABLE — EDUCATIONAL USE ONLY
 *
 * The hostname parameter is untrusted.
 * Interpolating it into a shell command can allow
 * command injection.
 *
 * This function is not invoked by the lab.
 */

function lookupHost(hostname, callback) {
  const command = `nslookup ${hostname}`;
  exec(command, callback);
}

module.exports = { lookupHost };
