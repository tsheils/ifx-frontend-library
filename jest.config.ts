import { getJestProjects } from '@nx/jest';
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
export default {
  projects: getJestProjects(),
};
