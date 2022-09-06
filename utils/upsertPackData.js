const { insertPacks } = require('../controllers/packDataController');
const axios = require('axios');
const endpoint = {
    request: 'https://public-api.shiphero.com/graphql', 
    refresh: 'https://public-api.shiphero.com/auth/refresh'
    }

async function getPacks(refresh_token, company_code){
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
                packs_per_day{
                    request_id
                    complexity
                    data(last: 10){
                        edges{
                            node{
                                user_first_name
                                user_last_name
                                order_number
                                created_at
                                id
                                total_items
                                order_id
                            }
                        }
                    }
                }
            }
            `}
        });
        const data = await res;
        console.log('data ytyt', data.data.errors)
        data.data.data.packs_per_day.data.edges.forEach(e => {
            try{
                insertPacks({
                    company_code: company_code,
                    packs: e.node,
                    order_id: e.node.order_id,
                    refresh_token: refresh_token
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

module.exports = { getPacks }