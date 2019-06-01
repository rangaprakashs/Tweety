Tweety Dashboard

A Twitter API request/Response Dashboard.
Clone/ download this repo.

Install NPM and Node,
Run the npm install, 
It should auto download the dependencies.
run the server

    npm run dev
 you would get a listening to port 3000.
 
 fire up the index.html and enter your twitter handle.

npm run dev

Dependencies

    Bootstrap - The web framework used
    NPM - Dependency Management    
    TWIT - Node JS Twitter API 
    
   You'll need the Twitter API Key. 
   In this format
   
    const config = {
    consumer_key: 'xxxxxxxxxxxxxxxxxxxx',
    consumer_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    access_token: 'xxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    access_token_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
    }

Save the above in server/config.js

ping the API using frontend. 

