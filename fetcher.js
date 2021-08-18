const source = process.argv[2];
const destination = process.argv[3];
// sets the necessary info from the command line to two variables
const request = require('request');
const fs = require('fs');


const fetcher = function(source, destination, cb) {
  request(source, (error, response, body) => {
    if (response) {
      console.log("We have a response");
      cb(body, destination);
    // a separate function which writes the content to a file
    } else {
      console.log("Check if the URL is valid");
    }
  });
};

const writer = (body, destination) => {
  fs.writeFile(destination, body, function(err) {
    if (err) {
      throw err;
    } else {
      const byteSize = fs.statSync(destination).size;
      // finds the byte size of the created file
      console.log(`Downloaded and saved: ${byteSize} bytes.`);
    }
  });
};

fetcher(source, destination, writer);