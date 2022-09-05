const Company = require('../models/companyModel')
const { v4: uuidv4 } = require('uuid')

const createCompany = async (company_name) => {
    try{
        const createUniqueCode = async () => {
            const code = uuidv4()
            const companyExists = await Company.findOne({ company_code: code })
            if(companyExists){
                createUniqueCode()
            }else{
                return code
            }
        }
        const company_code = await createUniqueCode()
        const company = await Company.create({
            company_name, company_code
        })
        if(company.company_code){
            return company
        }else createCompany(company_name)
    }catch(e){
        console.log(e)
    }
}

const getCompanies = async (req, res, next) => {
    try{
        const companies = await Company.find({})
        return companies
    }catch(e){
        console.log(e)
    }
}

const changeRefreshToken = async (req, res, next) => {
    try{
        const { company_code, refresh_token } = req.body
        const company = await Company.findOneAndUpdate({ company_code }, { refresh_token })
        if(company){
            res.status(200).json({message: 'Refresh Token Updated'})
        }else{
            res.status(400).json({message: 'Company Not Found'})
        }
    }catch(e){
        console.log(e)
    }
}

const getCompany = async (req, res, next) => {
    try{
        const { company_code } = req.body
        const company = await Company.findOne({ company_code })
        if(company){
            res.status(200).json({company})
        }else{
            res.status(400).json({message: 'Company Not Found'})
        }
    }catch(e){
        console.log(e)
    }
}

const changeDHLSetting = async (req, res, next) => {
    try{
        const { company_code, uses_dhl } = req.body
        const company = await Company.findOneAndUpdate({ company_code }, { uses_dhl })
        if(company){
            res.status(200).send(company)
        }else{
            res.status(400).json({message: 'Company Not Found'})
        }
    }catch(e){
        console.log(e)
    }
}

module.exports = { createCompany, getCompanies, changeRefreshToken, getCompany, changeDHLSetting }