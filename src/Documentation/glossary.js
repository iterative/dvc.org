export default {
  name: 'Glossary',
  desc:
    'This guide is aimed to familiarize the users with definitions to ' +
    'relevant DVC concepts and terminologies which are frequently used.',
  contents: [
    {
      name: 'Workspace',
      match: ['workspace'],
      desc: `
Directory containing all your project files. For example raw datasets, source
code, ML models, etc. A workspace becomes a **DVC project** when
[\`dvc init\`](/doc/commands-reference/init) is run, and
[DVC-files](/doc/user-guide/dvc-file-format) or stage files are created in it.

Note that [external outputs](/doc/user-guide/external-outputs) also form part
of your expanded workspace, technically.
      `
    },
    {
      name: 'DVC Project',
      match: ['DVC project', 'project', 'projects'],
      desc: `
Initialized by running \`dvc init\` in the **workspace**. It will contain the
[\`.dvc/\` directory](/doc/user-guide/dvc-files-and-directories) and
[DVC-files](/doc/user-guide/dvc-file-format) created with commands such as
\`dvc add\` or \`dvc run\`. It's typically also a Git repository.
      `
    },
    {
      name: 'DVC Cache',
      match: ['DVC cache', 'cache', 'cache directory', 'cached'],
      desc: `
The DVC cache is a hidden storage (by default located in the \`.dvc/cache\`
directory) for files that are under DVC control, and their different versions.
For more details, please refer to this
[document](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).
      `
    },
    {
      name: 'Data Artifact',
      match: ['data artifact', 'data artifacts'],
      desc: `
Any data file or directory, as well as intermediate or final result (such as
extracted features or a ML model file) that is under DVC control. Refer to
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning)
for more details.
      `
    },
    {
      name: 'Import Stage',
      match: ['import stage', 'import stages'],
      desc: `
Stage (DVC-file) created with the \`dvc import\` or \`dvc import-url\`
commands. They represent files or directories from external sources.
      `
    },
    {
      name: 'Output',
      match: ['output', 'outputs'],
      desc: `
A file or a directory that is under DVC control. See \`dvc add\` \`dvc run\`,
\`dvc import\`, \`dvc import-url\` commands.
      `
    },
    {
      name: 'External Dependency',
      match: ['external dependency', 'external dependencies'],
      desc: `
A DVC-file dependency with origin in an external source, for example HTTP, SSH,
Amazon S3, Google Cloud Storage remote locations, or even other DVC repositories.
See [External Dependencies](/doc/user-guide/external-dependencies).
      `
    }
  ]
}
