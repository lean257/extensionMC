const express = require('express');
var path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { getRenderResp } = require('./yelpResponse');

app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/', (req, res) => {
  if (req.header('x-mc-action') == 'controls') {
    res.json({
      controls: [
        {
          boolean: {
            name: 'show_rating',
            label: 'Show Rating',
            description: 'Showing business rating',
            default: true,
          },
        },
      ],
    });
  } else {
    // parse out the controls that get sent with render POST request
    const { controlValues } = req.body;
    getRenderResp(controlValues).then((data) => {
      res.send(data);
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
