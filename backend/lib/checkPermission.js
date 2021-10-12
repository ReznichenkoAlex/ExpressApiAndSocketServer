const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'

const checkPermission = (req, res, next) => {
    let method 
    let section 
    const {payload} = jwt.verify(req.headers.authorization, JWT_SECRET)
    switch(req.baseUrl) {
        case '/api/users':
            section = 'settings'
            break
        case '/api/news':
            section = 'news'
            break
    }
    switch (req.method) {
        case 'POST':
            method = 'C'
            break
        case 'GET':
            method = 'R'
            break
        case 'PATCH':
            method = 'U'
            break
        case 'DELETE':
            method = 'D'
            break
    }
    const isAllow = payload.permission[section][method]
    if (isAllow) {
        return next()
    }
    return res.status(400).json({ message: 'Недостаточно прав'})
}

module.exports = checkPermission
