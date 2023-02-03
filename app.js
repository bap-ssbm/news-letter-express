const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const https = require("https");
const { get } = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {  //this get function is to send the signup.html file to the root directory.
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) { //this post is the method we specified in the html to get the email, fname and lname from <form>

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    //using req.body.(name of tag input) to get the inputs user inputted

    var data = {

        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: fName,
            LNAME: lName
        }
    };
    //we have to send data over to mailchimp in this way as an object
    //those on the left before the colon are the object's properties that are required to send to mailchimp.
    //we just set those equal to the info we recieved from the user as a constant above.


    const jsonData = JSON.stringify(data);
    // we have to turn this into a string to send to mailchimp.

    const url = "https://us13.api.mailchimp.com/3.0/lists/96e9dc8578/members"; 
    //us13 is the server required for mailchimp, the 96e9dc8578 is the member id

    const options = {
        method: "POST",
        auth: "ken.oshimoto@gmail.com:a82fe4365a231a034ffdb89a5a82333a-us13"
    }; //we made options into an object to send to mailchimp, which requires the method, and auth which includes username and the appid

    const request = https.request(url, options, function (response){    //we have to save our request as a constant to be able to send it over to mailchimp
    //and why we use request is because we send a request to the url to get back the response from mailchimp

        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data){    //using on puts an event listener on response and it waits for "data" to be sent
            console.log(JSON.parse(data));  //you actually dont have to write anything here lol, but i guess its good practice to console log the data yhou recieve from the site to confirm that its working
        })
    });

    request.write(jsonData); //here we are sending the data variable we created aka the object that contains user email, fname and lname.
    request.end(); 
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("server started on port 3000");
})



