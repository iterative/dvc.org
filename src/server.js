// eslint-disable-next-line @typescript-eslint/no-var-requires
const server = require('@dvcorg/websites-server')

const app = server.app

// we can also extend to add further custom routes
app.get('/api/status', (req, res) => {
  res.send('ok')
})

// run the server
server.run()
