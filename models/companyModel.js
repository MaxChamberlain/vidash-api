const mongoose = require('mongoose')

const companySchema = mongoose.Schema(
    {
        company_name: {
            type: String,
            required: true
        },
        company_code: {
            type: String,
            required: true,
            unique: true
        },
        refresh_token: {
            type: String,
            required: false,
            unique: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
)

companySchema.pre('save', async function(next){
    if(!this.isModified('refresh_token')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.refresh_token = await bcrypt.hash(this.refresh_token, salt)
})

companySchema.methods.matchPassword = async function(enteredToken){
    return await bcrypt.compare(enteredToken, this.refresh_token)
}

const Company = mongoose.model('Company', companySchema, 'companies')

module.exports = Company