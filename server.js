const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const { getRenderResp } = require('./yelpResponse');

app.use(express.json());

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
    getRenderResp().then((data) => {
      res.send(data);
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
