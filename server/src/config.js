const fs = require('fs');

const readFilePromise = path => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return reject(err);
    return resolve(data);
  });
});

const secretPath = process.env.DM_SECRET;

/**
 * A promise containing the buffer of the secret
 * @type {Promise<String>}
 */
const secretPromise = readFilePromise(secretPath);

const certPath = process.env.DM_CERT;

/**
 * A promise containing the buffer of the certificate
 * @type {Promise<String>}
 */
const certPromise = readFilePromise(certPath);

/**
 * The port that the application listens on
 * @type {Number}
 */
const port = process.env.DM_PORT || 8080;

module.exports = {
  secretPromise,
  certPromise,
  port,
};
