# Express Server

Example Usage on other project:

Create a server file eg: `server.js`

```js
const server = require('@dvcorg/websites-server')

const app = server.app

// we can also extend to add further custom routes
app.get('/hello', (req, res) => {
  res.send('hello')
})

// run the server
server.run()
```
