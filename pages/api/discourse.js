/* eslint max-len:0 */

const mock = {
  topics: [
    {
      url: 'https://blog.dvc.org/1',
      title:
        'Dvc get doesn’t work with absolute paths, but everything else seems to',
      date: 1576072266986,
      comments: 4
    },
    {
      url: 'https://blog.dvc.org/2',
      title:
        'How do i remove files which are no longer tracked by dvc from dvc remote ssh storage',
      date: 1576072266986,
      comments: 10
    },
    {
      url: 'https://blog.dvc.org/3',
      title: 'Best practice for hyperparameters sweep',
      date: 1576072266986,
      comments: 2
    }
  ]
}

export default (_, res) => {
  res.status(200).json(mock)
}
