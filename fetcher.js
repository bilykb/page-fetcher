const source = process.argv[2];
const destination = process.argv[3];
// sets the necessary info from the command line to two variables
const request = require('request');
const fs = require('fs');
const constants = require('constants');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const fetcher = function(source, destination, cb) {
  request(source, (error, response, body) => {
    if (response) {
      console.log(`We have a response from ${source}`);
      cb(body, destination);
    // a separate function which writes the content to a file
    } else {
      console.log(`Error: Check if the URL is valid\n${error}`);
      rl.close();
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

const decisionOnFile = (body, destination) => {
  fs.access(destination, constants.F_OK, (err) => {
    // throws an error if the file does not exist
    if (err) {
      if (err.code === "ENOENT") {
        writer(body, destination);
        rl.close();
        return
      }
      console.log(err);
    }
      console.log(`${destination} currently exists.`)
      rl.question("Do you want to overwrite this file? Y N ", answer => {
        if (answer === "Y" || answer === "y") {
          console.log(`Overwritting ${destination}...`);
          writer(body, destination);
          rl.close();
        } else {
          rl.close();
          return false;
        }
      });
  });
};


fetcher(source, destination, decisionOnFile);



//----------
// const request = require('request');
// const fs = require('fs');

// const url = process.argv[2];
// const filePath = process.argv[3];

// const downloader = (targetUrl) => {
//   request(targetUrl, (error, response, body) => {
//     if (error) {
//       console.log(`The following error has occured: `, error);
//     };
//     if (response.statusCode !== 200) {
//       console.log(`Something went wrong; Status code: ${response.statusCode}`);
//     };
//     fs.writeFile(filePath, body, (error) => {
//       if (error) {
//         console.log(`Bad path; please try again. Error details:  ${error}`);
//       } else {
//         const stats = fs.statSync(filePath);
//         console.log(`Sucessfully downloaded! Saved ${stats.size} bytes to ${filePath}`);
//         //ALTERNATIVELY, call body.length for size
//       }
//     })
//   })
// }

// downloader(url);