import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
  testPathIgnorePatterns: ['<rootDir>/src/environments/'],
});
