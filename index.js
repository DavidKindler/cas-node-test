var app = require('express')();
var session = require('express-session');
var CASAuthentication = require('./cas-auth');
const port = 8080




// Set up an Express session, which is required for CASAuthentication.
app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url     : 'https://uat.nxp.com/security',
    service_url : 'http://localhost:8080'
});

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html')

    res.write('<h2>Headers</h2>')
    res.write('<pre>'+JSON.stringify(req.headers, null, 2)+'</pre>')
    res.write('<h2>cookies</h2>')
    res.write('<pre>'+JSON.stringify(req.cookies, null,2)+'</pre>')
    res.write('<h2>Body</h2>')
    res.write('<pre>'+JSON.stringify(req.body, null,2)+'</pre>')
    res.write('<h2>OriginalUrl</h2>')
    res.write('<pre>'+JSON.stringify(req.originalUrl, null,2)+'</pre>')
    res.write('<h2>session</h2>')
    res.write('<pre>'+JSON.stringify(req.session, null,2)+'</pre>')
    res.end()

})


// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get( '/app', cas.bounce, function ( req, res ) {
    // res.send( '<html><body>Hello!</body></html>' );

    res.set('Content-Type', 'text/html')

    res.write('<h2>Headers</h2>')
    res.write('<pre>'+JSON.stringify(req.headers, null, 2)+'</pre>')
    res.write('<h2>cookies</h2>')
    res.write('<pre>'+JSON.stringify(req.cookies, null,2)+'</pre>')
    res.write('<h2>Body</h2>')
    res.write('<pre>'+JSON.stringify(req.body, null,2)+'</pre>')
    res.write('<h2>OriginalUrl</h2>')
    res.write('<pre>'+JSON.stringify(req.originalUrl, null,2)+'</pre>')
    res.write('<h2>session</h2>')
    res.write('<pre>'+JSON.stringify(req.session, null,2)+'</pre>')
    res.end()


});

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get( '/api', cas.block, function ( req, res ) {
    res.json( { success: true } );
});

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
app.get( '/api/user', cas.block, function ( req, res ) {
    res.json( { cas_user: req.session[ cas.session_name ] } );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get( '/authenticate', cas.bounce_redirect );

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get( '/logout', cas.logout );

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
