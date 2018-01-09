console.log('Running tests...');

let fs = require('fs');

let text = fs.readFileSync('./config.json');

console.log(text.toString());

var config = JSON.parse(text.toString());

for (let i in config)
{
    console.log(i);
}
