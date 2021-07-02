const CryptoJS = require('crypto-js');
const signingKey = require('./config').MC_SIGNING_KEY;

function verifySignature(signature_header, request_body, secret) {
  const split_header = signature_header.split(',');
  const time = split_header[0].split('=');
  const v1 = split_header[1].split('=');
  const signed_payload = time[1].toString() + '.' + request_body;
  const hmac = CryptoJS.HmacSHA256(signed_payload, secret).toString();
  return hmac === v1[1];
}

function verifyRequest(req) {
  return verifySignature(
    req.header('x-mc-signature'),
    req.rawBody,
    signingKey,
  );
}
exports.verifyRequest = verifyRequest;
