// Skip Husky install in production and CI
if (
  process.env.NODE_ENV === 'production' ||
  process.env.CI === 'true' ||
  process.env.INIT_CWD === process.cwd()
) {
  // eslint-disable-next-line no-process-exit, n/no-process-exit
  process.exit(0)
}
const husky = (await import('husky')).default
console.log(husky())
