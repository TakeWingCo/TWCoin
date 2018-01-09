console.log('Running tests...');
var fs = require('fs');
var text = fs.readFileSync('./config.json');
console.log(text.toString());
var config = JSON.parse(text.toString());
for (var i in config) {
    console.log(i);
}
//# sourceMappingURL=app.js.map