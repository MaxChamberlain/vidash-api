const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { getPicksLocal } = require('../controllers/pickDataController');

const scheduleReports = async () => {
    const users = await getUsers()
    const timezones = [...new Set(users.pickspacks.map(user => user.timezone))]

    timezones.forEach((timezone, i) => {
        console.log(i + ': starting cron process for ', timezone)
        cron.schedule('0 17 * * *', getUsersAndSend, 
        {
            scheduled: true,
            timezone: timezone
        })
    })
}

const getUsers = async () => {
    const usersPickPack = await User.find({picking_packing_report: true})
    const usersPackage = await User.find({package_report: true})
    return {
        pickspacks: usersPickPack,
        packages: usersPackage
    }
}

const getUsersAndSend = async () => {
    const usersPickPack = await User.find({picking_packing_report: true})
    const usersPackage = await User.find({package_report: true})
    usersPickPack.forEach(user => {
        sendPickPackEmail(user)
    })
}

const sendPickPackEmail = async (user) => {
    const picks = await getPicksLocal({
        company_code: user.company_code, 
        startDate: new Date(new Date().setHours(0,0,0,0)).toISOString(), 
        endDate: new Date().toISOString()
    })
    const quantity_picked = picks.reduce((acc, pick) => {
        return acc + pick.quantity_picked
    }, 0)
    const orders_picked = [...new Set(picks.map(pick => pick.order_id))].length
    const mailData = {
        from: 'do-not-reply-vidash@gmail.com',  // sender address
        to: user.email_address,   // list of receivers
        subject: 'A Notification From ViDash',
        text: 'That was easy!',
        html: `<div style="position: absolute; padding: 40px; top: 0; left:0; right:0; bottom:0; display: flex; align-items: center; flex-direction: column;">
                    <div style="width: 100%; height: fit-content; padding: 5px 0; font-size: 40px; text-align: center; display: flex; justify-content: center; align-items: center">
                        <div>ViDash</div>
                        <img src='https://i.imgur.com/hXbLNtw.png' style="width: 50px; height: 50px; margin-left: 10px;"/>
                    </div>
                    <div style="width: 100%; padding: 20px; margin-top: 40px; font-size: 30px;">
                        <div>${user.first_name}, here is your scheduled Picking and Packing report for today.</div>
                        <br />
                        <div>
                            ${orders_picked} orders have been picked today, and <br />
                            ${quantity_picked} items.
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

module.exports = scheduleReports;