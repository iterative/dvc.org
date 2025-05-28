# Gatsby Theme: Iterative

This Gatsby theme is what [Iterative, inc.](https://iterative.ai) uses to power
all of our Gatsby websites! It contains all of our shared utility code, as well
as our full docs engine. This project is still evolving, and while it's
currently very specific to iterative.ai websites we hope to make it usable for
others in the future.

## Usage

### Options

- disable: boolean

  Default: Boolean(process.env.SKIP_DOCS)

  Stops this theme from making pages. Could be used as a conditional for test
  and development purposes.

- defaultTemplate: string

  Default: require.resolve('./src/templates/doc.tsx')

  Will be passed to the `getTemplate` function to use as a default template, the
  default function simply returns this if `template` isn't specified.

- getTemplate: function

  Default:

  ```ts
  const defaultGetTemplate = (template, defaultTemplate) =>
    template
      ? require.resolve(path.resolve('src', 'templates', template + '.tsx'))
      : defaultTemplate
  ```

  This function will be given the `template` field specified in the page's
  frontmatter, as well as the `defaultTemplate` specified by the option above.
  It is expected to return the absolute path to a React component to be given to
  Gatsby's `createPage` action.

- remark: boolean

  Default: true

  if true, this theme will add its own instance of `gatsby-transformer-remark`.

- filesystem: boolean

  Default: true

  if true, this theme will add its own instance of `gatsby-source-filesystem`.

- glossaryPath: string

  Default: path.resolve('content', 'docs', 'user-guide', 'basic-concepts')

- simpleLinkerTerms: { matches: string, url: string }[]

  Default: undefined

  These terms will be passed to `plugins/gatsby-remark-dvc-linker`, which will
  scan code blocks for ones with content matching `matches`, and then link it to
  that entry's `url`.

- postCssPlugins: Plugin[]

  Default:

  ```js
  const postCssPlugins = [
    require('tailwindcss/nesting')(require('postcss-nested')),
    autoprefixer,
    require('tailwindcss')
  ]
  ```

  If specified, this array will completely replace plugins this theme passes to
  PostCSS. This is mostly an escape hatch for if styles are broken with the
  default plugins. Check out
  [the theme's `gatsby-config`](https://github.com/iterative/gatsby-theme-iterative/blob/main/packages/gatsby-theme-iterative/gatsby-config.js)
  to see the default plugins, as not having them in this option will very likely
  break core functionality.

- docsInstanceName: string

  Default: 'iterative-docs'

  The `name` that will be passed to the `gatsby-source-filesystem` instance for
  docs pages. The resulting `sourceInstanceName` will be used to identify files
  that will be processed as docs pages.

- docsPath: string

  Default: path.resolve('content', 'docs')

- glossaryInstanceName: string

  Default: 'iterative-glossary'

  The `name` that will be passed to the `gatsby-source-filesystem` instance for
  glossary entries. The resulting `sourceInstanceName` will be used to identify
  files that will be processed as glossary pages.

- argsLinkerPath: string

  Default: ['command-reference', `ref`, 'cli-reference']

  The path that `plugins/gatsby-remark-args-linker` will operate on, connecting
  arguments listed in the summary with their summaries deeper in the page.

- docsPrefix: string

  Default: 'doc'

  This is the prefix that the docs pages will render to, including the index
  page at the exact path.

- sentry: boolean

  Default: true

  If true, this theme will instantiate `@sentry/gatsby` with a default
  configuration. This configuration can be imported from `sentry-config.js` and
  overridden by creating a
  [Sentry configuration file](https://docs.sentry.io/platforms/javascript/guides/gatsby/#sentry-configuration-file)
  in your project's root.

### Examples

Check out the example project in this project's monorepo, particularly
[`gatsby-config.js`](https://github.com/iterative/gatsby-theme-iterative/blob/main/packages/example/gatsby-config.js).

### Linking the local theme

If you want to test the changes to the theme locally without publishing, you can
run `yarn add @dvcorg/gatsby-theme-iterative@[/path/to/theme]` in your project,
or simply update the package.json file and change the version to
`[/path/to/theme]`, and then run `yarn develop` as normal. This will use the
local version of the theme instead of the published version.

Note: Get the absolute theme path from `packages/gatsby-theme-iterative`
directory. You can use `pwd` command to get the absolute path.
