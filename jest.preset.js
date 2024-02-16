const nxPreset = require('@nx/jest/preset').default;



module.exports = {
  ...nxPreset,
  async setup() {
    await super.setup();
    console.log("setup")
    global.TextEncoder = require("util").TextEncoder;
    global.TextDecoder = require("util").TextDecoder;
  }
};
