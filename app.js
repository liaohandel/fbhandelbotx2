let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

//fbhandelbot token
const FACEBOOK_ACCESS_TOKEN = 'EAABZBZCU6TOrEBANROeonJnmX485dvNd73mk9IodLvST1CNiEsBVWiCwIYxplZBe8D1RAYySgvFty56GqjZBzh5KZAjHVU3rJz3j3EiyZBGZC9t7Yo7YE8udtiDKF4w4Vpsfzw3OmfB3yIlEgWtM62B0eIjCZCEAmeyh2P58ZCfU4BgZDZD'

//const FACEBOOK_ACCESS_TOKEN = 'EAAEDA93cGNwBAP6tDcpjZBC8S8WpgQSVZAdNORI3HKzEQYCMKj5hum8ta3Cmc8ljy0bK2bsxZCQ0lrN1MLYBm2ZBGS57kA2IZAoh'
const PORT = process.env.PORT || 3000
//const VERIFY_TOKEN = 'Your_Verify_Token'
const VERIFY_TOKEN = 'handelbot0921'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// Facebook Webhook
app.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Invalid verify token')
    }
})

// handler receiving messages
app.post('/', function (req, res) {
    let events = req.body.entry[0].messaging
    for (i = 0; i < events.length; i++) {
        let event = events[i]
        if (event.message) {
            if (event.message.text) {
                sendMessage(event.sender.id, { text: event.message.text })
            }
        }
    }
    res.sendStatus(200)
})

// generic function sending messages
function sendMessage(recipientId, message) {
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
