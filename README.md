<h1>About this project</h1>

<h2>Basic on tokens</h2>

<p>This repository contains a simple, yet useful basic implementation of authentication using Angular 5 
to handle the use of access tokens and refresh tokens. Access tokens are set in the header of the HTTP 
request in order to, as its name suggest, access a resource which the role associated with this token is 
given authorizaiton. In other hand, refresh tokens are used to obtain a new access token whenever an access 
token expires, they are also set in the header of HTTP requests.</p>

<h2>Token Handling Flow</h2>

<p>The basic flow of the token handling offerred by the code in this repository is given as follows:</p>

<ul>
  <li>
    <p>When an user logs in, both an access token and a refresh token are received as response. The log in 
    action requires the <b>client name</b>, the <b>client password</b>, the <b>username or equivalent</b> and
    the <b>user password</b>. The client name and client password are used so that the API knows who is
    trying to get access to its resources, which is our Angular front-end application. The username (which 
    could be an e-mail or anything else that will be queried to determine an user) and its password are 
    the user's who is using the client. As soon as we are given both tokens in the response, they are stored locally so that they are in the 
    context of the browser session, which will be discarded when it is closed.</p>
  </li>
  <li>
    <p>With both tokens in hand, we are able to access our protected API's resources, that is possible 
    because the interceptor implemented in <i>InterceptService</i> catches the requests we are about to 
    send, adds authorization token to its header and then sends it to the server.</p>
  </li>
  <li>
    <p>Okay, so what about the refresh token? When our token expires, we are unable to get authorization to 
    access our API, our requests will return us a response with error code 401, which means <i>not authorized</i>. 
    What we are also doing in our interceptor is the error handling for this situation. Whenever this event happens, 
    we get a new token by sending a request if the refresh token in the header asking for a new one, then the 
    new token is added to the header of the request that failed and it is sent again with the valid token with 
    no error being exposed to the final user.</p>
  </li>
</ul>
