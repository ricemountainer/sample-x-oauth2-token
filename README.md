# Overview

This is a sample repository so that we can obtain `access_token` and `refresh_token` on X (Formerly "Twitter").

# How to obtain X API OAuth2 Token

You can grab X API OAuth2 Tokens that can be used to call X API following these steps:

1. Go to [X (Formally Twitter) Developer site](https://developer.x.com/), create an app, then copy `CLIENT_ID` and `CLIENT_SECRET`
2. Enter `http://localhost:4000/callback` as Redirect URL.
3. Run `echo -n [CLIENT_ID]:[CLIENT_SECRET] | base64` and then save the result. It will be used later.
4. Make `.env` file and then configure `CLIENT_ID`, `CLIENT_SECRET` and `CLIENT_SECRET_BASE64` values. Please refer the [`.env.sample`](./.env.sample)
5. Run `node sample-web.js`.
6. Open a browser and go to `https://x.com/i/oauth2/authorize?response_type=code&client_id=[client id]&redirect_uri=http://localhost:4000/callback&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=abcd&code_challenge=abcd&code_challenge_method=plain` . Then you'll be redirected to the URL you specified on step2. You can specify any string in `state` and `code` parameters as some sting. But at least `code` parameter is needed to be same as the `code_verifier` parameter in [`sample-web.js`](./sample-web.js). Now I specify that as `abcd` in the code. If you don't change the value, you should specify `code` parameter as `abcd`. 
5. `sample-web.js` shows the response of `https://api.x.com/2/oauth2/token`. (It's also output by `console.log`.) The sample is `{"token_type":"bearer","expires_in":7200,"access_token":"xxx...","scope":"tweet.write users.read tweet.read offline.access","refresh_token":"yyy..."}`.Now you can grab `access_token` and it can be used for calling Twitter API V2 with `Authorization: Bearer {access_token}` header.

NOTE:  
- The `access_token` will be expired in 7200 seconds, you should issue new token by calling `https://api.x.com/2/oauth2/token` with `'{"refresh_token": <refresh_token> , "grant_type":"refresh_token"}'` parameter and `'{"Authorization": <cliend id:client secret encoded by base64>}'` header.  
- If you don't specify `offline.access` on step 6., `refresh_token` won't be issued.
- It's unclear whether `access_token` will be expired or not. Some docs say `access_token` doesn't have an explict lifetime e.g.  
  > "By default, the access token you create through the Authorization Code Flow with PKCE will only stay valid for two hours unless you’ve used the `offline.access` scope." ([Doc](https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code))  
  > "Access tokens are not explicitly expired. An access token will be invalidated if a user explicitly revokes an application in the their X account settings, or if X suspends an application." ([Doc](https://docs.x.com/resources/fundamentals/authentication/faq#how-long-does-an-access-token-last))  

  But I see `"expires_in":7200`  in the response of `https://api.x.com/2/oauth2/token`, and in fact that `x.api.com` responses 400 error using the token which takes 7200 sec after generating. At least for now, I think a periodically refresh task is needed if we need to use X API with OAuth2 Token.

## A simple web app to grab authorization code

Authorization code will expire in 30 seconds. Because of this, we need to request OAuth2 token right after Authorization code is issued. In order to do that, you can use `sample-web.js` to obtain OAuth2 token. The code requests OAuth2 token using authorization code which is queried in HTTP request. Before you run the app, you should modify `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, and `TWITTER_CLIENT_ID_AND_SECRET_BASE64` on your env. Please also refer to following things:

- Modify `<code verifier>` as your code verifier. If you specified `plain` as `code_challenge` when requesting authorization code, you can paste same value of `code_challenge`
- Modify `<cliend id:client secret - base64>`. You need to run `echo -n "<client id>:<cliend secret> | base64"` to make the value.("<>" is not necessary)

## Ref

https://docs.x.com/resources/fundamentals/authentication/oauth-2-0/authorization-code