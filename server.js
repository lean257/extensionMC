const express = require('express');
var path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { getRenderResp } = require('./yelpResponse');
const { getControlsResponse } = require('./controlRes');
const { verifyRequest } = require('./verify');

// use raw body for hmac
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/controls', (req, res) => {
  // verify signature
  // if (!verifyRequest(req)) {
  //   res.status(401).json({ status: 401, message: 'Unauthorized Signature' });
  //   return;
  // }
  getControlsResponse()
    .then((data) => res.send(data))
    .catch((error) => {
      console.log('control error', error);
      res.status(400).json({
        message: 'Something is wrong with the controls. oops',
        action: {
          link: 'https://example.com/authorize',
          text: 'Authorize',
        },
        retryable: false,
      });
    });
});

app.post('/render', (req, res) => {
  // verify signature
  // if (!verifyRequest(req)) {
  //   res.status(401).json({ status: 401, message: 'Unauthorized Signature' });
  //   return;
  // }
  // parse out the controls that get sent with render POST request
  const { controlValues } = req.body;
  if (!controlValues) {
    res.status(400).json({
      message: 'We are not getting back the correct controls',
    });
  }
  getRenderResp(controlValues)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
      if (error.status > 400) {
        res.status(400).json({
          message: 'Something is wrong with our extension',
          action: {
            link: 'https://example.com/authorize',
            text: 'Authorize',
          },
          retryable: false,
        });
      }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
