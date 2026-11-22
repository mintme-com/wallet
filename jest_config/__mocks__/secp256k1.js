'use strict';

// Jest 22 cannot parse secp256k1 4.x. Adapt its Uint8Array arguments to the
// Buffer-based 3.x API already used by the legacy application.
const secp256k1 = require('../../node_modules/secp256k1');

module.exports = Object.keys(secp256k1).reduce((api, name) => {
  const value = secp256k1[name];
  api[name] =
    typeof value === 'function'
      ? (...args) =>
          value(
            ...args.map(arg =>
              arg instanceof Uint8Array && !Buffer.isBuffer(arg) ? Buffer.from(arg) : arg
            )
          )
      : value;
  return api;
}, {});
