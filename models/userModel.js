const mongoose = require('mongoose')
const bcrypt = require ('bcryptjs')

const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email_address: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        canManage: {
            type: Boolean,
            required: true,
            default: false
        },
        company_code:{
            type: String,
            required: true,
        },
        theme_preference: {
            type: String,
            required: true,
            default: 'light'
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User