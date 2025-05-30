const express = require('express');
const app = express();
const port = process.env.PORT || 2000; // changed to 2000

app.get('/', (req, res) => {
  res.send('Hello World from Node.js!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
