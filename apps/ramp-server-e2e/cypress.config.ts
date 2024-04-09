import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run ramp-server:serve:development',
        production: 'nx run ramp-server:serve:production',
      },
      ciWebServerCommand: 'nx run ramp-server:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
