const express = require('express');
const app = express();
const port = process.env['PORT'] || 4000;
const axios = require('axios');
const dotenv = require('dotenv').config();

app.get('/callback' , async (req,res)=>{
    let msg = `hello /callback;req=${JSON.stringify(req.query)}`;
    try {
        if (req.query.code) {
            const authorizationCode = req.query.code;
            console.log('call /2/oauth2/token; code=' + authorizationCode);
            const data = new URLSearchParams();
            data.append('code', authorizationCode);
            data.append('grant_type', 'authorization_code');
            data.append('client_id', process.env['TWITTER_CLIENT_ID']);
            data.append('redirect_uri', 'http://localhost:4000/callback');
            data.append('code_verifier', 'abcd');
            const result = await fetch('https://api.x.com/2/oauth2/token', {
                method: 'POST',
                headers: {
                    'Authorization' : `Basic ${process.env['TWITTER_CLIENT_ID_AND_SECRET_BASE64']}`,
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body: data.toString(),
            });
            const json = await result.json();

            console.log(new Date());
            console.log(`result=${JSON.stringify(json)}`);
            msg = JSON.stringify(json);

        }
    } catch(error) {
        console.log(`error happened; error=${JSON.stringify(error)}`);
    }
    res.send(msg);
});

app.listen(port, (err)=>{
    if(err) {
        console.log(`error happened during app#listen`);
        throw err;
    }
    console.log(`server listened by port ${port} ...`);
});