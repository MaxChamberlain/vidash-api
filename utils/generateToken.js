const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: "10h"
    })
}

const verify = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        next()
    }else{
        const authHeader = req.headers.authorization;
        if(req.url === '/users/login' || req.url === '/users/register'){
            next()
        }else if (authHeader) {
            const token = authHeader.split(' ')[1];
            try{
                jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                    if (err) {
                        console.log(err)
                        return res.sendStatus(403);
                    }
        
                    req.user = user;
                    next();
                });
            }catch(e){
                console.log(e)
            }
        } else {
            res.sendStatus(403);
        }
    }
};

module.exports = { generateToken, verify }