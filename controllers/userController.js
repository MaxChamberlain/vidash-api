const User = require('../models/userModel')
const { generateToken } = require('../utils/generateToken')
const { createCompany } = require('../controllers/companyController')
var nodemailer = require('nodemailer');

const registerUser = async (req, res, next) => {
    try{
        const { first_name, last_name, email_address, password, company_name, company_code } = req.body

        console.log('Checking if user exists')

        const userExists = await User.findOne({ email_address })
    
        if(userExists){
            res.status(400).json({message: 'User Already Exists'})
        }else{
            let code
            if(company_code === 'new'){
                console.log('Creating Company')
                const company = await createCompany(company_name)
                code = company.company_code
            }else{
                code = company_code
            }

            console.log('Creating User')

            const user = await User.create({
                first_name, last_name, email_address: email_address.toLowerCase(), password, company_code: code
            })
    
            console.log('Returning User')
    
            if(user){
                res.status(201).json({
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email_address: user.email_address.toLowerCase(),
                    isAdmin: user.isAdmin,
                    canManage: user.canManage,
                    token: generateToken(user._id),
                    company_code: user.company_code,
                    company_name: user.company_name,
                    theme_preference: user.theme_preference,
                    canSeeDollarAmounts: user.canSeeDollarAmounts,
                    canExportData: user.canExportData,
                    canDrillDown: user.canDrillDown,
                    picking_packing_report: user.picking_packing_report,
                    package_report: user.package_report,
                    timezone: user.timezone,
                })
            }else{
                const err = new Error('An Error Has Occurred. (Error Code: Brimstone)')
                res.status(400)
                next(err)
            }
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Solicit)'})
    }
}

const authUser = async (req, res, next) => {
    try{
        const { email_address, password } = req.body

        const user = await User.findOne({ email_address: email_address.toLowerCase() })
    
        if(user && (await user.matchPassword(password))){
            res.status(201).json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email_address: user.email_address.toLowerCase(),
                isAdmin: user.isAdmin,
                canManage: user.canManage,
                token: generateToken(user._id),
                company_code: user.company_code,
                company_name: user.company_name,
                theme_preference: user.theme_preference,
                canSeeDollarAmounts: user.canSeeDollarAmounts,
                canExportData: user.canExportData,
                canDrillDown: user.canDrillDown,
                picking_packing_report: user.picking_packing_report,
                package_report: user.package_report,
                timezone: user.timezone,
            })
        }else{
            res.status(400).json({text: 'Invalid Email or Password'})
        }
    }catch(e){
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Kangaroo)'})
    }
}

const getUsersInCompany = async (req, res, next) => {
    try{
        const { company_code } = req.body
        const users = await User.find({ company_code })
        if(users){
            res.status(200).json(users)
        }else{
            console.log(company_code)
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const getUserById = async (req, res, next) => {
    try{
        const { _id } = req.body
        // make _id into mongodb $oid
        const user = await User.findOne({ _id })
        if(user){
            res.status(200).json(user)
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const sendInvite = async (req, res, next) => {
    const { email } = req.body
    const mailData = {
        from: 'do-not-reply-vidash@gmail.com',  // sender address
          to: email,   // list of receivers
          subject: 'A Notification From ViDash',
          text: 'That was easy!',
          html: `<div style="position: absolute; padding: 40px; top: 0; left:0; right:0; bottom:0; display: flex; align-items: center; flex-direction: column;">
                    <div style="width: 100%; height: fit-content; padding: 5px 0; font-size: 40px; text-align: center; display: flex; justify-content: center; align-items: center">
                        <div>ViDash</div>
                        <img src='https://i.imgur.com/hXbLNtw.png' style="width: 50px; height: 50px; margin-left: 10px;"/>
                    </div>
                    <div style="width: 100%; padding: 20px; margin-top: 40px; font-size: 30px;">
                        <div>You have been invited ${req.body.sender && `by ${req.body.sender} `} to join a company on ViDash.</div>
                        <a href='http://vidash.us/register?id=${req.body.company_code}'>
                            <div style="padding: 20px; background-color: #ffbb00; text-decoration: none; color: black; text-align: center; border-radius: 10px; margin-top: 30px;">
                                Click to join
                            </div>
                        </a>
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

const requestChangePassword = async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({ email_address: email.toLowerCase() })

    if(user){
        const mailData = {
            from: 'do-not-reply-vidash@gmail.com',  // sender address
            to: email,   // list of receivers
            subject: 'A Notification From ViDash',
            text: 'That was easy!',
            html: `<div style="position: absolute; padding: 40px; top: 0; left:0; right:0; bottom:0; display: flex; align-items: center; flex-direction: column;">
                        <div style="width: 100%; height: fit-content; padding: 5px 0; font-size: 40px; text-align: center; display: flex; justify-content: center; align-items: center">
                            <div>ViDash</div>
                            <img src='https://i.imgur.com/hXbLNtw.png' style="width: 50px; height: 50px; margin-left: 10px;"/>
                        </div>
                        <div style="width: 100%; padding: 20px; margin-top: 40px; font-size: 30px;">
                            <div>You have been requested to reset your ViDash password.</div>
                            <a href='http://vidash.us/reset?id=${user._id}'>
                                <div style="padding: 20px; background-color: #ffbb00; text-decoration: none; color: black; text-align: center; border-radius: 10px; margin-top: 30px;">
                                    Reset Password
                                </div>
                            </a>
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
}

const resetPassword = async (req, res, next) => {
    const { _id, password, oldPass } = req.body
    let user = await User.findOne({ _id })
    if(user && (await user.matchPassword(oldPass))){
        user.password = password
        await user.save()
        res.status(200).json({text: 'Password Reset Successfully'})
    }else{
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}


const updateUser = async (req, res, next) =>{
    try{
        const { _id, args } = req.body

        const user = await User.updateOne({ _id }, args, { new: true })

        if(user){
            res.status(200).json(user)
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const deleteUser = async (req, res, next) =>{
    try{
        const { _id } = req.body

        const user = await User.deleteOne({ _id })

        if(user){
            res.status(200).json(user)
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const changePickingPackingReport = async (req, res, next) =>{
    try{
        const { _id, value } = req.body
        
        const user = await User.findOneAndUpdate({ _id }, { picking_packing_report: value })

        if(user){
            res.status(200).json(user)
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
                                <div>You have ${value ? 'enabled' : 'disabled'} end of day Picking and Packing KPI reports.</div>
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
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const changePackageReport = async (req, res, next) =>{
    try{
        const { _id, value } = req.body

        const user = await User.findOneAndUpdate({ _id }, { package_report: value })

        if(user){
            res.status(200).json(user)
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
                                <div>You have ${value ? 'enabled' : 'disabled'} end of day Package reports.</div>
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
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}

const changeTimeZone = async (req, res, next) =>{
    try{
        const { _id, timezone } = req.body

        const user = await User.findOneAndUpdate({ _id }, { timezone })

        if(user){
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
                                <div>You have changed your timezone to ${timezone}</div>
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
            res.status(200).json(user)
        }else{
            res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
        }
    }catch(e){
        console.log(e)
        res.status(400).json({text: 'An Error Has Occurred. (Error Code: Pigeon)'})
    }
}




module.exports = { registerUser, authUser, getUsersInCompany, getUserById, sendInvite, updateUser, deleteUser, requestChangePassword, resetPassword, changePickingPackingReport, changePackageReport, changeTimeZone }