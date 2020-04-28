export default {
  name: 'Glossary',
  desc:
    'This document is aimed to provide definitions for relevant DVC ' +
    'concepts and terminologies that are frequently used.',
  contents: [
    {
      name: 'Workspace',
      match: ['workspace'],
      desc: `
Directory containing all your project files, for example raw datasets, source
code, ML models, etc. It will conatain your DVC project.
      `
    },
    {
      name: 'DVC Project',
      match: [
        'DVC project',
        'DVC projects',
        'project',
        'projects',
        'DVC repository',
        'DVC repositories'
      ],
      desc: `
Initialized by running \`dvc init\` in the **workspace** (typically in a Git
repository). It will contain the
[\`.dvc/\` directory](/doc/user-guide/dvc-files-and-directories) and
[DVC-files](/doc/user-guide/dvc-file-format) created with commands such as
\`dvc add\` or \`dvc run\`.
      `
    },
    {
      name: 'DVC Cache',
      match: ['DVC cache', 'cache', 'caches', 'cached'],
      desc: `
The DVC cache is a hidden storage (by default located in the \`.dvc/cache\`
directory) for files that are under DVC control, and their different versions.
For more details, please refer to this [document]
(/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).
      `
    },
    {
      name: 'Data Artifact',
      match: ['data artifact', 'data artifacts'],
      desc: `
Any data file or directory, as well as intermediate or final result that is
tracked by DVC, for example by using \`dvc add\`. See
[Versioning Data and Models](/doc/use-cases/versioning-data-and-model-files).
      `
    },
    {
      name: 'Dependency',
      match: ['dependency', 'dependencies'],
      desc: `
A file or directory (possibly tracked by DVC) recorded in the \`deps\` section
of a DVC-file (stage file). See \`dvc run\`. Stages are invalidated when any of
their dependencies change.
      `
    },
    {
      name: 'Output',
      match: ['output', 'outputs'],
      desc: `
A file or directory tracked by DVC, recorded in the \`outs\` section of a
DVC-file. Outputs are usually the result of stages. See \`dvc add\`,
\`dvc run\`, \`dvc import\`, et al. A.k.a. _data artifact_
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
      name: 'External Dependency',
      match: ['external dependency', 'external dependencies'],
      desc: `
A DVC-file dependency with origin in an external source, for example HTTP, SSH,
Amazon S3, Google Cloud Storage remote locations, or even other DVC
repositories. See [External Dependencies]
(/doc/user-guide/external-dependencies).
      `
    }
  ]
}
