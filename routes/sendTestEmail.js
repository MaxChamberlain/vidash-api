const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { getPicksLocal } = require('../controllers/pickDataController');
const express = require('express');
const router = express.Router();

const sendPickPackEmail = async (req, res, next) => {
    const user = await User.find({_id: req.body._id})
    const picks = await getPicksLocal({
        company_code: user[0].company_code, 
        startDate: new Date(new Date().setHours(0,0,0,0)).toISOString(), 
        endDate: new Date().toISOString()
    })
    const quantity_picked = picks.reduce((acc, pick) => {
        return acc + pick.picked_quantity
    }, 0)
    const orders_picked = [...new Set(picks.map(pick => pick.order_number))].length
    const pickers = [...new Set(picks.map(pick => `${pick.user_first_name} ${pick.user_last_name}`))]
    console.log(pickers)
    let pickerData = []
    const picksByPicker = pickers.forEach(picker => {
        const filteredPicks = picks.filter(pick => `${pick.user_first_name} ${pick.user_last_name}` === picker)
        pickerData.push(filteredPicks.reduce((a, b) => {
            let temp = a
            temp.picked_quantity += b.picked_quantity
            temp.orders_picked.push(b.order_number)
            return a
        }, {picked_quantity: 0, orders_picked: [], picker: picker}))
    })
    const mailData = {
        from: 'do-not-reply-vidash@gmail.com',  // sender address
        to: user[0].email_address,   // list of receivers
        subject: 'A Notification From ViDash',
        text: 'That was easy!',
        html: `<div style="position: absolute; padding: 40px; top: 0; left:0; right:0; bottom:0; display: block; align-items: center; flex-direction: column;">
                    <div style="width: 100%; height: fit-content; padding: 5px 0; font-size: 40px; text-align: center; display: flex; justify-content: center; align-items: center">
                        <div>ViDash</div>
                        <img src='https://i.imgur.com/hXbLNtw.png' style="width: 50px; height: 50px; margin-left: 10px;"/>
                    </div>
                    <div style="width: 100%; padding: 20px; margin-top: 40px; font-size: 30px;">
                        <div>${user[0].first_name}, here is your scheduled Picking and Packing report for today.</div>
                        <br />
                        <div>
                            There was a total of ${quantity_picked} items picked today across ${orders_picked} orders.
                            <br />
                            The best picker in terms of items was ${pickerData.sort((a, b) => b.picked_quantity - a.picked_quantity)[0].picker}, with
                            ${pickerData.sort((a, b) => b.picked_quantity - a.picked_quantity)[0].picked_quantity} items picked across ${pickerData.sort((a, b) => b.picked_quantity - a.picked_quantity)[0].orders_picked.length} orders.
                        </div>
                    </div>
                </div>`,
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

router.post('/picks', sendPickPackEmail)

module.exports = router;