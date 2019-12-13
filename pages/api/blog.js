const mock = {
  posts: [
    {
      url: 'https://blog.dvc.org/1',
      title: 'October ’19 DVC❤️Heartbeat',
      date: 1576072266986,
      comments: 4
    },
    {
      url: 'https://blog.dvc.org/2',
      title: 'DVC.org for Hacktoberfest 2019',
      date: 1576072266986,
      comments: 10
    },
    {
      url: 'https://blog.dvc.org/3',
      title: 'September ’19 DVC❤️Heartbeat',
      date: 1576072266986,
      comments: 2
    }
  ]
}

export default (_, res) => {
  res.status(200).json(mock)
}
