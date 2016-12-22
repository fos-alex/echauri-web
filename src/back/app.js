var nodemailer = require('nodemailer');
var express = require('express');
var ses = require('nodemailer-ses-transport');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use('/api', router);
router.post('/send-email', handleSendEmail); // handle the route at yourdomain.com/sayHello

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
    if (!req.body) return res.sendStatus(400);

    var text = `Contacto de: <b>${req.body.name  || ''}</b>
    Teléfono: ${req.body.phone || ''}

    ${req.body.message}`;

    var mailOptions = {
        from: 'info@echaurivinos.com.ar', // sender address
        to: 'info@echaurivinos.com.ar', // list of receivers
        subject: `Contacto de ${req.body.name || ''} desde echaurivinos.com.ar`, // Subject line
        replyTo: req.body.email,
        text: text//, // plaintext body
    };

    console.log('Sending email from ' + req.body.email);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('echaurivinos.com.ar');
        }
    });
}