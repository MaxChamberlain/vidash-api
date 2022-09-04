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
                first_name, last_name, email_address, password, company_code: code
            })
    
            console.log('Returning User')
    
            if(user){
                res.status(201).json({
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email_address: user.email_address,
                    isAdmin: user.isAdmin,
                    canManage: user.canManage,
                    token: generateToken(user._id),
                    company_code: user.company_code,
                    company_name: user.company_name,
                    theme_preference: user.theme_preference,
                    canSeeDollarAmounts: user.canSeeDollarAmounts,
                    canExportData: user.canExportData,
                    canDrillDown: user.canDrillDown,
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

        const user = await User.findOne({ email_address })
    
        if(user && (await user.matchPassword(password))){
            res.status(201).json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email_address: user.email_address,
                isAdmin: user.isAdmin,
                canManage: user.canManage,
                token: generateToken(user._id),
                company_code: user.company_code,
                company_name: user.company_name,
                theme_preference: user.theme_preference,
                canSeeDollarAmounts: user.canSeeDollarAmounts,
                canExportData: user.canExportData,
                canDrillDown: user.canDrillDown,
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
          html: `<b>You have been invited ${req.body.sender && `by ${req.body.sender} `} to join a company on ViDash.</b>
                 <br> <a href='http://vidash.us/register?id=${req.body.company_code}'>Click to join</a> <br/>`,
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



module.exports = { registerUser, authUser, getUsersInCompany, getUserById, sendInvite, updateUser, deleteUser }