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


// adds user to firebase if signup botton is clicked
function signup() {

    var email = $("#email").val();
    var password = $("#password").val();

    // adds user to firebase and catches errors
    // will not enter function if user is succesfully called
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        // displays a pop up alert when an error occurs
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else if(errorCode == 'auth/email-already-in-use') {
            alert('The email is already in use.');
        } else if(errorCode == 'auth/invalid-email'){
            alert('The email is invalid.');
        } 
    });
}

// if the user is logged in, change to the classes page.
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
     document.location.href = "src/my-classes.html";
  }
});

// logs user into their account
function login() {

    var email = $("#email").val();
    var password = $("#password").val();
    
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        // displays a pop up alert when an error occurs
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else if(errorCode == 'auth/email-already-in-use') {
            alert('The email is already in use.');
        } else if(errorCode == 'auth/invalid-email'){
            alert('The email is invalid.');
        } 
    });
}

function register() {

    var name = $("#full-name").val();
    var pid = $("#pid").val();
    var studClass = $("#student-class :selected").text(); 
    var major = $("#major").val();
    var pref1 = $("#project-pref-1").val();
    var pref2 = $("#project-pref-2").val();
    var pref3 = $("#project-pref-3").val();

    database.ref('students/' + name).set({
        FullName: name,
        PID: pid,
        Class: studClass,
        Major: major,
        Preference1: pref1,
        Preference2: pref2,
        Preference3: pref3
    });
     window.location.reload();

}

$(document).ready(function() {

    var ref = database.ref('classes');
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

function loadPreferences() {
    var pref1 = $("#project-pref-1");
    var pref2 = $("#project-pref-2");
    var pref3 = $("#project-pref-3");
    pref1.empty();
    pref2.empty();
    pref3.empty();
    var className = $("#student-class").find("option:selected").text();

    //debug
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
