// eslint-disable-next-line @typescript-eslint/no-var-requires
const server = require('@dvcorg/websites-server')

const app = server.app

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      frameSrc: ['https://embed.testimonial.to'],
      mediaSrc: ['https://static.iterative.ai']
    }
  }
}

// we can also extend to add further custom routes
app.get('/api/status', (req, res) => {
  res.send('ok')
})

// run the server
server.run({
  helmetOptions
})
