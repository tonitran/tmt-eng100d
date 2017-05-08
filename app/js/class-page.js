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
    var vars = [],
        hash;
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

$(document).ready(function() {

    var studentTable = $("#student-table");
    var projTeams = $("#proj-teams")

    var classLabel = $("#class-title");
    var createProj = $("#create-project");

    var ref = database.ref("classes/" + className + "/students/");

    classLabel.text(className);
    createProj.attr('onclick', 'window.location.href="create-project.html?key=' + className + '"');

    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
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
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                var tableid = (json.name).replace(/\s+/g, '');

                projTeams.prepend(
                    '<p>' + json.name + '</p>' +
                    '<table id="' + tableid + '" class="table" ondrop = "dropItem(event)" ondragover = "canDrop(event)" >' +
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

    $('#deleteClass').click(function(){
        var ref = database.ref("classes/" + className);
        ref.remove();
        window.history.back();
    });
});

function initStudents() {
    var ref = database.ref("classes/" + className + "/students/");

    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                students.push(json);

            });
        });
}

function initProjects() {

    var ref = database.ref("classes/" + className + "/projects/");

    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                projects.push(json);
            });
        });
}

function populateTeamsTable(x) {
	if(x == 1)   var teams = createTeamsByPref();
	else if (x == 2) 
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
                    '<tr id = "' + student.pid + '" draggable = "true" ondragstart = "dragItem(event)" >' +
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

function createTeamsByPref() {
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
    var sortedStudent = []
    var doneStudent = []
    var teamName = []
    var added
    var index
    var counter = 0
        //PROGRAM STARTS HERE
    while (students.length > 0) {

        while (students.length != 0) {
            currStudent = students[0]

            for (j = 0; j < teams.length; j++) {
                if (teams[j].Name == currStudent.projectPref1) {
                    teams[j].Students.push(currStudent)
                    teamName[currStudent.name] = teams[j].Name
                        //		    	 console.log("adding " + currStudent.name + " " +  teams[j].Name)

                }
            }
            //    console.log("adding " + currStudent.name + teams[j].Name)
            students.splice(0, 1)
            sortedStudent.push(students[0])

        }
    }
    /*
    This rundom algorithm  will end if:
    1. No student in the "noTeam" team
    2. The algorithm runs 1000 times
    */
    while (true) {
        counter++
        console.log(counter)
        if (counter > 1000) break
        noTeam = []
        while (sortedStudent.length != 0) {
            //get the number of the student we have
            numStudent = sortedStudent.length

            added = false
                //randomly pick one student
            toPick = Math.floor(Math.random() * (numStudent + 1));
            currStudent = sortedStudent[toPick]
                //check the validity of the student's name
            if (currStudent != undefined) {
                for (j = 0; j < teams.length; j++) {
                    //get to the team where the student is assigned
                    if (teams[j].Name == teamName[currStudent.name]) {
                        //if the team is not full, then we don't need to remove the student from the team
                        if (teams[j].Students.length <= teams[j].Size) {
                            added = true
                            break
                        }
                        //if the team is overflow, then we need to remove the student from the team
                        else {
                            for (k = 0; k < teams.length; k++) {
                                //find the student's second preference and move the student to his second preference if that team isn't full.
                                if (teams[k].Name == currStudent.projectPref2 && teams[k].Students.length < teams[k].Size && added == false) {
                                    added = true
                                    index = teams[j].Students.indexOf(currStudent);
                                    if (index > -1) {
                                        teams[j].Students.splice(index, 1);
                                    }
                                    teams[k].Students.push(currStudent)
                                        //	teamName[currStudent.name] = teams[k].Name
                                }
                            }
                            //find the student's third preference and move the student to his third preference if that team isn't full.
                            for (k = 0; k < teams.length; k++) {
                                if (teams[k].Name == currStudent.projectPref3 && teams[k].Students.length < teams[k].Size && added == false) {
                                    added = true
                                    index = teams[j].Students.indexOf(currStudent);
                                    if (index > -1) {
                                        teams[j].Students.splice(index, 1);
                                    }
                                    teams[k].Students.push(currStudent)
                                        //	teamName[currStudent.name] = teams[k].Name
                                }
                            }
                        }
                    }
                }
                //done with the student
            }
            //remove the student from the list
            sortedStudent.splice(toPick, 1)

            //add this student to the other list
            doneStudent.push(currStudent)
        }
        while (doneStudent.length != 0) {
            //get the number of the student we have
            numStudent = doneStudent.length
                //randomly pick one student
            toPick = Math.floor(Math.random() * (numStudent + 1));
            currStudent = doneStudent[toPick]

            //check the validity of the student's name
            if (currStudent != undefined) {
                for (j = 0; j < teams.length; j++) {
                    //get to the team where the student is assigned
                    if (teams[j].Name == teamName[currStudent.name]) {
                        if (teams[j].Students.length > teams[j].Size) {
                            //remove the student if the team is still overflow
                            index = teams[j].Students.indexOf(currStudent);
                            if (index > -1) {
                                teams[j].Students.splice(index, 1);
                            }
                            //push the student to the "noTeam" team
                            noTeam.push(currStudent)
                        }
                    }
                }
            }
            //remove the student from the list
            doneStudent.splice(toPick, 1)
                //add this student to the other list
            sortedStudent.push(currStudent)
        }

        //end this loop if the "noTeam" team has no student
        if (noTeam.length == 0) break
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

function canDrop(e) {
    e.preventDefault();
}

function dragItem(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function dropItem(e) {
    var placer = e.target;
    e.preventDefault();
    var info = e.dataTransfer.getData("text");
    while (placer.tagName != "TABLE") {
        placer = placer.parentNode;
    }
    placer.appendChild(document.getElementById(info));
}
