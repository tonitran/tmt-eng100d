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

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var className = decodeURIComponent(getUrlVars()["key"]);
var students = [];
var projects = [];

$(document).ready(function () {

    var studentTable = $("#student-table");
    var projTeams = $("#proj-teams");

    var classLabel = $("#class-title");
    var createProj = $("#create-project");

    var ref = database.ref("classes/" + className + "/students/");

    classLabel.text(className);
    createProj.attr('onclick', 'window.location.href="create-project.html?key=' + className + '"');

    ref.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                studentTable.append(
                        '<tr>' +
                        '<td>' + json.name + '</td>' +
                        '<td>' + json.pid + '</td>' +
                        '<td>' + json.major + '</td>' +
                        '<td>' + json.projectPref1 + '</td>' +
                        '<td>' + json.projectPref2 + '</td>' +
                        '<td>' + json.projectPref3 + '</td>' +
                        '</tr>');
            });
        });

    ref = database.ref("classes/" + className + "/projects/");
    ref.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                var tableid = (json.name).replace(/\s+/g, '');

                projTeams.prepend(
                        '<p>' + json.name + '</p>' +
                        '<table id="' + tableid + '" class="table">' +
                        '<thead>' +
                        '<tr>' +
                        '<th>Name</th>' +
                        '<th>PID</th>' +
                        '<th>Major</th>' +
                        '<th>Project Preference 1</th>' +
                        '<th>Project Preference 2</th>' +
                        '<th>Project Preference 3</th>' +
                        '</tr>' +
                        '</thead>' +
                        '</table>' +
                        '<br>'
                        );
            });
        });

    initStudents();
    initProjects();

    // Register click listeners

    // $('#editClass').click(function(){
    //     console.log("TODO: Edit class name");
    // });

    $('#deleteClass').click(function(){
        var ref = database.ref("classes/" + className);
        ref.remove();
        window.history.back();
    });


});

function initStudents() {
    var ref = database.ref("classes/" + className + "/students/");

    ref.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                students.push(json);

            });
        });
}

function initProjects() {

    var ref = database.ref("classes/" + className + "/projects/");

    ref.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                projects.push(json);
            });
        });
}

function populateTeamsTable() {
    var teams = createTeams();

    console.log(teams);

    for (var i = 0; i < teams.length; i++) {
        var projName = teams[i].Name;
        var tableid = (projName).replace(/\s+/g, '');
        var students = teams[i].Students;

        var table = $('#' + tableid);

        for (var j = 0; j < students.length; j++) {
            var student = students[j];

            if (student != null) {
                table.append(
                        '<tr>' +
                        '<td>' + student.name + '</td>' +
                        '<td>' + student.pid + '</td>' +
                        '<td>' + student.major + '</td>' +
                        '<td>' + student.projectPref1 + '</td>' +
                        '<td>' + student.projectPref2 + '</td>' +
                        '<td>' + student.projectPref3 + '</td>' +
                        '</tr>');
            }
        }
    }

}

function createTeams() {
    var teams = []
        var studentproj = []
        // add a Students parameter to each project which will hold which students are in the project
        for (i = 0; i < projects.length; i++) {
            var toAdd = {
                Name: projects[i].name,
                Size: projects[i].size,
                Students: []
            }
            teams.push(toAdd)
        }

    //"teams" is our output, where it holds all the projects and the students assigned to them
    var j
        var k
        var toPick
        var currStudent
        var first
        var second
        var third
        var numStudent
        var currTeam
        var noTeam = []
        var tempStudent = []
        var numStudents = students.length

        //PROGRAM STARTS HERE
        while (students.length > 0) {
            numStudent = students.length
                toPick = Math.floor(Math.random() * (numStudent + 1));
            currStudent = students[toPick]
                if (currStudent != null) {
                    //console.log(currStudent.name)
                    for (j = 0; j < teams.length; j++) {
                        if (teams[j].Name == currStudent.projectPref1) {
                            first = teams[j]
                        }
                        if (teams[j].Name == currStudent.projectPref2) {
                            second = teams[j]
                        }
                        if (teams[j].Name == currStudent.projectPref3) {
                            third = teams[j]
                        }
                    }
                    /*
                       console.log("first choice is: " + first.Name)
                       console.log("second choice is: " + second.Name)
                       console.log("third choice is: " + third.Name)
                       */

                    if (first.Students.length < first.Size) {
                        //   console.log("first choice open")
                        var temp = first.Students
                            temp.push(currStudent)
                            first.Students = temp
                            for (k = 0; k < teams.length; k++) {
                                if (teams[k].Name == first.Name) {
                                    teams[k].Students = first.Students
                                }
                            }
                    }
                    else {
                        if (second.Students.length < second.Size) {
                            //      console.log("first not open but second open")
                            var temp = second.Students
                                temp.push(currStudent)
                                second.Students = temp
                                for (k = 0; k < teams.length; k++) {
                                    if (teams[k].Name == second.Name) {
                                        teams[k].Students = second.Students
                                    }
                                }
                        }
                        else {
                            if (third.Students.length < third.Size) {
                                //         console.log("first and second not open but third is")
                                var temp = third.Students
                                    temp.push(currStudent)
                                    third.Students = temp
                                    for (k = 0; k < teams.length; k++) {
                                        if (teams[k].Name == third.Name) {
                                            teams[k].Students = third.Students
                                        }
                                    }
                            }
                            else {
                                noTeam.push(currStudent)
                            }
                        }
                    }

                }
            students.splice(toPick, 1)
        }

    var leftovers = {
        Name: "No Assigned Team",
        Students: noTeam
    }
    teams.push(leftovers)

        /*
           for (j = 0; j < teams.length; j++) {
           console.log(teams[j].Name + ":")
           var stu = teams[j].Students
           for (i = 0; i < stu.length; i++) {
           console.log(stu[i].name)
           }

           }
           */
        return teams

}
