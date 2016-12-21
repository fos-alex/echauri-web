var nodemailer = require('nodemailer');
var express = require('express');
var ses = require('nodemailer-ses-transport');

var app = express();
var router = express.Router();
app.use('/send-email', router);
router.get('/', handleSendEmail); // handle the route at yourdomain.com/sayHello

app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
});

console.log('Connecting to ses');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAJSPBGMEGVWBE6PKQ',
    secretAccessKey: 'MMCImyJqTaGPEIoznJ5dCKKSCT8w6qhr5Nn9oTJr',
    "region": "us-east-1"
}));

function handleSendEmail(req, res) {


    var text = 'Hello world from';

    var mailOptions = {
        from: 'info@echaurivinos.com.ar', // sender address
        to: 'fos.alex@gmail.com', // list of receivers
        subject: 'Email Example', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    console.log('Sending email');
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        }
    });
}