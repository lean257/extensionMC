const { createHmac } = require('crypto');

function verifySignature(appID, userID, signedAt, givenHmac, signingKey) {
  const now = Math.floor(Date.now() / 1000);
  if (now - signedAt > 600) {
    throw new Error('expired signature');
  }
  const hmac = createHmac('sha256', signingKey);
  hmac.update(`install.${signedAt}.${appID}.${userID}`);
  console.log(hmac);
  const computedHmac = hmac.digest('hex');
  if (computedHmac !== givenHmac) {
    throw new Error('invalid signature');
  }
  return true;
}
exports.verifySignature = verifySignature;
