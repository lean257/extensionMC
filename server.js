const express = require('express');
var path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { getRenderResp } = require('./yelpResponse');
const { verifySignature } = require('./verify');
const signingKey = require('./config').MC_SIGNING_KEY;
// use raw body for hmac
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/', (req, res) => {
  // verify signature
  const sig = req.header('x-mc-signature');
  const signedAt = sig.split(',')[0].substring(2);
  const givenHmac = sig.split(',')[1].substring(3);
  if (!verifySignature(signedAt, givenHmac, signingKey, req.rawBody)) {
    res.send('Error from server: cannot verify signature');
  }
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
