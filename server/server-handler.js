let Twit = require('twit');
let config = require('./config')

let express = require('express');
let cors = require('cors');

let app = express();
app.use(cors());

let T = new Twit(config);

app.listen(3000, function () {
    console.log('Server is listening on port 3000')
});

app.get('/', function (req, res) {
    res.json({
        "message": "hey there! this is just the default response, try our other end points"
    });
})

app.get('/twitter:data', function (req, res) {
    let response_obj;
    if (req.param.data !== '') {
        let user_request = JSON.parse(req.params.data);
        let params = {
            screen_name: user_request['screen_name'],
            count: 100
        }
        getTwitterFollowers(params, function (response) {
            res.send(response);
        });
    }
});

function getTwitterFollowers(params, callback) {
    let twitResponse = {};
    T.get('followers/list', params, function (err, data, response) {
        if (!data) {
            callback(err);
        }
        twitResponse = data;
        callback(twitResponse);
    });
}