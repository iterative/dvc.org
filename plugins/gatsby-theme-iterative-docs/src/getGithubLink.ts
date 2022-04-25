import { githubRepo } from './constants'
export const getGithubLink = (sourcePath: string): string =>
  `https://github.com/${githubRepo}/blob/master/content${sourcePath}`
