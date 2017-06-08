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
var className = decodeURIComponent(getUrlVars()["key"]);
var studentsInClass = [];
var projects = [];

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

$(document).ready(function() {

    var studentTable = $("#student-table");
    var projTeams = $("#proj-teams")
    var classLabel = $("#class-title");
    var createProj = $("#create-project");

    var ref = database.ref("classes/" + className + "/students/");
    console.log(ref);

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
                    '<td>' + '<input type = "button" value = "DELETE" id = "deleteStudent" onclick = "deleteStudent(\'' + json.pid + '\')">' + '</td>' +
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

    $('#deleteClass').click(function() {
        var ref = database.ref("classes/" + className);
        ref.remove();
        window.history.back();
    });


    $('#deleteClass').click(function() {
        var ref = database.ref("classes/" + className);
        ref.remove();
        window.history.back();
    });

    $('#save-teams-btn').click(function() {
        return; //FIXME Breaks the DB
        // Clear before overwrite
        for (let projItr = 0; projItr < projects.length; projItr++) {
            let projectRef = database.ref('classes/' + className + '/projects/' + projects[projItr].name + '/assignees/');
            projectRef.remove();
        }
        let projectNames = $('#proj-teams > p');
        let projectAssigneesTblList = $('#proj-teams > table');
        let numProjects = projectNames.length;
        for (let projectIndex = 0; projectIndex < numProjects; projectIndex++) {
            let projectName = projectNames[projectIndex].innerHTML;
            let projectRef = database.ref('classes/' + className + '/projects/' + projectName);
            let studentRows = $(projectAssigneesTblList[projectIndex]).find('tbody').find('tr');
            if (studentRows.length > 0) {
                for (let studentIndex = 0; studentIndex < studentRows.length; studentIndex++) {
                    let studentPID = $(studentRows[studentIndex]).find('td')[1].innerHTML;
                    database.ref('classes/' + className + '/projects/' + projectName + '/assignees/' + studentPID).set(true);
                }
            }
        }
    });

    $('#load-teams-btn').click(function() {
        let unassignedStudents = studentsInClass.slice();
        for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
            let projName = projects[projectIndex].name;
            let assigneeIDs = Object.keys(projects[projectIndex].assignees);
            let tableid = (projName).replace(/\s+/g, '');
            let table = $('#' + tableid);
            for (let assigneeIndex = 0; assigneeIndex < assigneeIDs.length; assigneeIndex++) {
                let id = assigneeIDs[assigneeIndex];
                let studentRef = database.ref('students/' + id);
                studentRef.once('value').then(function(snapshot) {
                    let student = snapshot.val();
                    table.append(
                        '<tr id = "' + student.pid + '" draggable = "true" ondragstart = "dragItem(event)" >' +
                        '<td>' + student.name + '</td>' +
                        '<td>' + student.pid + '</td>' +
                        '<td>' + student.major + '</td>' +
                        '<td>' + student.projectPref1 + '</td>' +
                        '<td>' + student.projectPref2 + '</td>' +
                        '<td>' + student.projectPref3 + '</td>' +
                        '</tr>');
                });
            }
        }
        //TODO Show unassignedStudents after loading.
    });

    $('#export-teams-btn').click(function() {
        let data = [];
        let allTeams = $("#proj-teams > table");
        let counter = 0;
        for (let i = 0; i < allTeams.length; i++) {
            let projectName = allTeams[i].id;
            let tHeadBody = allTeams[i].children;
            for (let j = 0; j < tHeadBody.length; j++) {
                if (tHeadBody[j].tagName == "TBODY") {
                    let allTr = tHeadBody[j].children;
                    for (let k = 0; k < allTr.length; k++) {
                        data[counter] = [];
                        let memName = allTr[k].children;
                        data[counter].push(memName[1].innerHTML);
                        data[counter].push(memName[0].innerHTML);
                        data[counter].push(document.getElementById('class-title').innerHTML);
                        data[counter].push(projectName);
                        counter++;
                    }
                }
            }

        }
        let csvStuff = "data:text/csv;charset=utf-8,";
        let dataStuff = "PID,Student Name,Class,Project\n";
        data.forEach(function(info) {
            dataStuff += info.join(",");
            dataStuff += "\n";
        });
        let finish = encodeURI(dataStuff);
        let hider = document.createElement('a');
        hider.href = csvStuff + finish;
        hider.target = '_blank';
        let name = prompt("Enter a name for your file", "");
        if (name != "" && name != null) {
            hider.download = name + '.csv';
            hider.click();
        }
        if (name == "") {
            window.alert("Not a valid name");
        }

    });
});


function deleteStudent(pid) {
    alert("Deleting Student with PID: " + pid + "!");
    var ref = database.ref("classes/" + className + "/students/" + pid);
    ref.remove();
    location.reload();

}

function initStudents() {
    var ref = database.ref("classes/" + className + "/students/");
    ref.once('value')
        .then(function(snapshot) {
            snapshot.forEach(function(project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                studentsInClass.push(json);
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
    if (x == 1) var teams = createTeamsByPref();
    else if (x == 2) var teams = createTeamsByMajors();
    console.log(teams);
    for (var i = 0; i < teams.length; i++) {
        var projName = teams[i].Name;
        var tableid = (projName).replace(/\s+/g, '');
        var students = teams[i].Students;
        var table = $('#' + tableid);
        for (var j = 0; j < studentsInClass.length; j++) {
            var student = studentsInClass[j];
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
    var doneTeams = []
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
    var j;
    var k;
    var toPick;
    var currStudent;
    var first;
    var second;
    var third;
    var numStudent;
    var currTeam;
    var noTeam = [];
    var tempStudent = [];
    var numStudents = studentsInClass.length;
    var sortedStudent = [];
    var doneStudent = [];
    var teamName = [];
    var added;
    var index;
    var counter = 0;
    //PROGRAM STARTS HERE
    while (studentsInClass.length > 0) {

        while (studentsInClass.length != 0) {
            currStudent = studentsInClass[0]
            for (j = 0; j < teams.length; j++) {
                if (teams[j].Name == currStudent.projectPref1) {
                    teams[j].Students.push(currStudent)
                    teamName[currStudent.name] = teams[j].Name
                    // console.log("adding " + currStudent.name + " " +  teams[j].Name)
                }
            }
            //    console.log("adding " + currStudent.name + teams[j].Name)
            sortedStudent.push(studentsInClass[0])
            studentsInClass.splice(0, 1)


        }

        // console.log("students number is : " + sortedStudent.length + " " + doneStudent.length + " " + students.length)
        while (sortedStudent.length != 0) {
            //get the number of the student we have
            numStudent = sortedStudent.length

            added = false
            //randomly pick one student
            toPick = Math.floor(Math.random() * (numStudent));
            currStudent = sortedStudent[toPick]
            //check the validity of the student's name

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
                                teamName[currStudent.name] = teams[k].Name
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
                                teamName[currStudent.name] = teams[k].Name
                            }
                        }
                    }
                }
                //done with the student
            }

            //add this student to the other list
            doneStudent.push(currStudent)
            //remove the student from the list
            sortedStudent.splice(toPick, 1)
        }

        //console.log("students number2 is : " + sortedStudent.length + " " + doneStudent.length + students.length)
        while (doneStudent.length != 0) {
            //get the number of the student we have
            numStudent = doneStudent.length;
            //randomly pick one student
            toPick = Math.floor(Math.random() * (numStudent));
            currStudent = doneStudent[toPick]
            //console.log("checking : " + currStudent.name)
            for (j = 0; j < teams.length; j++) {
                //get to the team where the student is assigned
                if (teams[j].Name == teamName[currStudent.name]) {
                    if (teams[j].Students.length > teams[j].Size) {
                        //console.log("deleting : " + currStudent.name + " from " + teams[j].Name)
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
            //remove the student from the list
            doneStudent.splice(toPick, 1)
            //add this student to the other list
            studentsInClass.push(currStudent)
        }
        //console.log("students number3 is : " + sortedStudent.length + " " + doneStudent.length + students.length)
        //end this loop if the "noTeam" team has no student

        if (noTeam.length == 0) {
            doneTeams = []
            doneNoTeam = []
            //should be hard copy here
            for (j = 0; j < teams.length; j++) {
                doneTeams.push(teams[j])
            }
            break
        }
        if (noTeam.length < minLeft) {
            doneTeams = []
            doneNoTeam = []
            minLeft = noTeam.length

            //should be hard copy here
            for (j = 0; j < teams.length; j++) {
                //console.log(teams[j].Name +  ":")
                var stu = teams[j].Students
                for (k = 0; k < stu.length; k++) {
                    //  console.log("	" + stu[k].name)
                }
                doneTeams.push(teams[j])
            }
            //console.log("No Team :")
            for (j = 0; j < noTeam.length; j++) {
                //console.log("	"+ noTeam[j].name)
                doneNoTeam.push(noTeam[j])
            }
        }
    }
    var leftovers = {
        Name: "No Assigned Team",
        Students: doneNoTeam
    }
    doneTeams.push(leftovers)

    /*
    for (j = 0; j < teams.length; j++) {
    console.log(teams[j].Name + ":")
    var stu = teams[j].Students
    for (i = 0; i < stu.length; i++) {
    console.log(stu[i].name)
    }

    }
    */
    return doneTeams

}

function createTeamsByMajors() {;

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
