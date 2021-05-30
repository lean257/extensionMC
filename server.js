const express = require('express');
var path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { getRenderResp } = require('./yelpResponse');
const { verifySignature } = require('./verify');
const { signingKey } = require('./config').MC_SIGNING_KEY;
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/', (req, res) => {
  // check for signature key
  const appID = req.body.appId;
  const userID = req.header('x-mc-user-id');
  const sig = req.header('x-mc-signature');
  const signedAt = sig.split(',')[0].substring(2);
  const givenHmac = sig.split(',')[1].substring(3);
  // TODO: Need to see if this method of verification is correct
  // if (!verifySignature(appID, userID, signedAt, givenHmac, signingKey)) {
  //   res.send('Error from server: cannot verify signature');
  // }
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
