export default {
  name: 'Glossary',
  desc:
    'This guide is aimed to familiarize the users with definitions to ' +
    'relevant DVC concepts and terminologies which are frequently used.',
  contents: [
    {
      name: 'Workspace directory',
      match: ['workspace'],
      desc:
        'The **workspace** contains all of your DVC **project** files and ' +
        "directories. It's typically also a Git **repository**. See also " +
        '[`dvc init`](/doc/commands-reference/init).'
    },
    {
      name: 'DVC cache',
      match: ['cache'],
      desc:
        'DVC cache is a hidden storage which is found at `.dvc/cache`. This ' +
        'storage is used to manage different versions of files which are ' +
        'under DVC control. For more information on cache, please refer to ' +
        'the this [guide](/doc/commands-reference/config#cache).'
    }
  ]
}
