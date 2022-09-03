var nodemailer = require('nodemailer');


const send = () => {
    const mailData = {
        from: 'do-not-reply-vidash@gmail.com',  // sender address
          to: 'mythicalmax@live.com',   // list of receivers
          subject: 'Sending Email using Node.js',
          text: 'That was easy!',
          html: `<b>Hey there! </b>
                 <br> This is our first message sent with Nodemailer<br/>`,
        }
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'do.not.reply.vidash@gmail.com',
            pass: 'ivzrqzsavfxsvvpk',
         },
    secure: true,
    });
    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

module.exports = { send }