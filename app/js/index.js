// Initialize Firebase
var config = {
    apiKey: "AIzaSyBx6L4UNMG5hDz3VVSvtmoYCOCf5x4yGTg",
    authDomain: "team-matching-tool.firebaseapp.com",
    databaseURL: "https://team-matching-tool.firebaseio.com",
    storageBucket: "team-matching-tool.appspot.com",
    messagingSenderId: "209177574012"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {

    var ref = database.ref();
    var dropDown = $("#student-class");

    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                dropDown.append('<option>' + json.name + '</option>');
            });
        });

    loadPreferences();
});

// creates a user on firebase when user clicks on the sign up button
$("#signup-submit").on("click", function () {
        var email = $("#email").val();
        var password = $("#password").val();
        createUser(email, password);
        
});
var createUser = function (email, password) {

    // adds user on firebase
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        console.log("create user");
        
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log("error code: " + errorCode);
        console.log("error message: " + errorMessage);
    
    });

    // submits forms and changes to the class page
    $("#professor-form").submit();
};


function loadPreferences() {
    var pref1 = $("#project-pref-1");
    var pref2 = $("#project-pref-2");
    var pref3 = $("#project-pref-3");
    pref1.empty();
    pref2.empty();
    pref3.empty();
    var className = $("#student-class").find("option:selected").text();

    console.log(className);
    var ref = database.ref("classes/" + className + "/projects");

    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                pref1.append('<option>' + json.name + '</option>');
                pref2.append('<option>' + json.name + '</option>');
                pref3.append('<option>' + json.name + '</option>');
            });
        });

}
