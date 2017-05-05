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

    var ref = database.ref("classes/");
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

function writeDataFirebase() {
    var fullName = $("#full-name").val();
    var studentPid = $("#pid").val();
    var className = $("#student-class").val();
    var studentMajor = $("#major").val();
    var projPref1 = $("#project-pref-1").find("option:selected").text();
    var projPref2 = $("#project-pref-2").find("option:selected").text();
    var projPref3 = $("#project-pref-3").find("option:selected").text();

    database.ref("classes/" + className + "/students/" + studentPid).set({
        name: fullName,
        pid: studentPid,
        major: studentMajor,
        projectPref1: projPref1,
        projectPref2: projPref2,
        projectPref3: projPref3
    });
}

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
