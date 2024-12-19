const express = require('express');
const fs   = require('fs');
const jwt  = require('jsonwebtoken');

var privateKEY  = fs.readFileSync('./private.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.key', 'utf8');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const payload = await jwt.verify(token, publicKEY, {
            expiresIn:  "12h",
            algorithm:  ["RS256"]
        });
        res.json({
            data: payload
        });
    }catch (err) {
        console.log(err)
    }
});

app.post('/', async (req, res) => {
    const user = req.body;
    try {
        const token = await jwt.sign(user, privateKEY, {
            expiresIn: '12h',
            algorithm: "RS256"
        });
        res.json({
            token: `bearer ${token}`
        });
    }catch (err) {
        console.log(err)
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});