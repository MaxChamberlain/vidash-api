const axios = require('axios');
const endpoint = {
    request: 'https://public-api.shiphero.com/graphql', 
    refresh: 'https://public-api.shiphero.com/auth/refresh'
}
const { insertPackages } = require('../controllers/packageDataController');

async function getPackage(order_id, refresh_token, company_code){
    try{
        const token = await refreshToken(refresh_token)
        const res = await axios({
            url:  endpoint.request,
            method: 'post',
            headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-requested-with': 'XmlHttpRequest'
            },
            data: {query: `
            query{
                shipments(order_id: "${order_id}"){
                      complexity
                      data(last: 1){
                          edges{
                              node{
                                  id
                                  order_id
                                  warehouse_id
                                  order{
                                      order_number
                                      total_tax
                                      total_discounts
                                      total_price
                                    shipping_lines{
                                          price
                                      }
                                  }
                                  address{
                                      name
                                      address1
                                      address2
                                      city
                                      state
                                      country
                                      zip
                                  }
                                  created_date
                                  shipping_labels{
                                      created_date
                                      account_id
                                      shipment_id
                                      order_id
                                      box_id
                                      box_name
                                      status
                                      tracking_number
                                      order_number
                                      order_account_id
                                      carrier
                                      shipping_name
                                      shipping_method
                                      cost
                                      box_code
                                      device_id
                                      delivered
                                      picked_up
                                      refunded
                                      needs_refund
                                      profile
                                      partner_fulfillment_id
                                      full_size_to_print
                                      packing_slip
                                      warehouse
                                      warehouse_id
                                      insurance_amount
                                      carrier_account_id
                                      source
                                      created_date
                                      tracking_url
                                      source
                                  }
                              }
                          }
                      }
                  }
              }
            `}
        });
        const data = await res;
        try{
            insertPackages({
                company_code: company_code,
                packages: data.data.data.shipments.data.edges[0].node
            })
        }catch(e){
            console.error(e)
        }
        
    }catch(e){
        console.error(e)
    }
}

async function refreshToken(inputToken){
    const token = await axios({
        url: endpoint.refresh,
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            'x-requested-with': 'XmlHttpRequest'
        },
        data: {
            "refresh_token": inputToken
        }
    })
    return token.data.access_token
}

module.exports = { getPackage }