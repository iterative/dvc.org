/* eslint max-len:0 */

const mock = {
  issues: [
    {
      title:
        'ssh/sftp: detect that we are not in a physical root and print a meaninful error...',
      url: 'https://github.com/iterative/dvc/issues/2936',
      comments: 1,
      date: 1576072266986
    },
    {
      title: 'pipeline show: use pager instead of rendering ourselves',
      url: 'https://github.com/iterative/dvc/issues/2937',
      comments: 0,
      date: 1576072266986
    },
    {
      title:
        'tests: disabling analytics through `config --global` breaks tests',
      url: 'https://github.com/iterative/dvc/issues/2938',
      comments: 1,
      date: 1576072266986
    }
  ]
}

export default (_, res) => {
  res.status(200).json(mock)
}
