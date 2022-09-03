const { insertPicks } = require('../controllers/pickDataController')
const axios = require('axios');
const endpoint = {
    request: 'https://public-api.shiphero.com/graphql', 
    refresh: 'https://public-api.shiphero.com/auth/refresh'
    }

async function getPicks(refresh_token, company_code){
    try{
        const token = await refreshToken(refresh_token)
        const res = await axios({
            url: endpoint.request,
            method: 'post',
            headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-requested-with': 'XmlHttpRequest'
            },
            data: {query: `
            query {
                picks_per_day{
                    request_id
                    complexity
                    data(last: 10){
                        edges{
                            node{
                                user_first_name
                                user_last_name
                                order_number
                                sku
                                quantity
                                picked_quantity
                                created_at
                                id
                            }
                        }
                    }
                }
            }
            `}
        });
        const data = await res;
        data.data.data.picks_per_day.data.edges.forEach(e => {
            try{
                insertPicks({
                    company_code: company_code,
                    picks: e.node
                })
            }catch(e){
                console.error(e)
            }
        })
    }catch(e){
        console.error(e)
    }
}

async function refreshToken(refresh_token){
    const token = await axios({
        url: endpoint.refresh,
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            'x-requested-with': 'XmlHttpRequest'
        },
        data: {
            "refresh_token": refresh_token
        }
    })
    return token.data.access_token
}

module.exports = { getPicks }