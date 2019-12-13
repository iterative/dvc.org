const mock = {
  registered: 10342,
  messages_per_month: 25409,
  online: 82
}

export default (_, res) => {
  res.status(200).json(mock)
}
