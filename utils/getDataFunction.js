const { getCompanies } = require('../controllers/companyController')
const { getPicks } = require('./upsertPickData')
const { getPacks } = require('./upsertPackData')

const startConnector = async () => {
    console.log('Starting Connector')
    let companies = await getCompanies()
    let companyTokens = companies.map(company => {
        return {
            company_code: company.company_code,
            refresh_token: company.refresh_token
        }
    })
    console.log('Getting companies')
    setInterval(async () => {
        companies = await getCompanies()
        companyTokens = companies.map(company => {
            return {
                company_code: company.company_code,
                refresh_token: company.refresh_token
            }
        })
    }, 36000)

    console.log('Starting Pick Updater')
    setInterval(() => 
    companyTokens.forEach(company => {
        if(company.refresh_token){
            getPicks(company.refresh_token, company.company_code)
        }
    }), 1000)

    console.log('Starting Pack Updater')
    setInterval(() => 
    companyTokens.forEach(company => {
        if(company.refresh_token){
            getPacks(company.refresh_token, company.company_code)
        }
    }), 2000)


}

module.exports = startConnector