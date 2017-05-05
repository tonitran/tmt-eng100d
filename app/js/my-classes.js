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

$(document).ready(function () {
    var ref = database.ref("classes/");
    var studentTable = $("#my-classes");
    var index = 0;
    ref.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (project) {
                var json = JSON.parse(JSON.stringify(project.val()));
                //studentTable.append('<a href="class-page.html?key='+ json.name + '" class="class collection-item center-align z">' + json.name + '</a>');
                var btnHTML = '' +
                    '<div class="dropdown">' +
                    '    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                    '    ' + json.name +
                    '        <span class="caret"></span>' +
                    '    </button>' +
                    '    <ul class="dropdown-menu" aria-labelledby="dropdownMenu">' +
                    '        <li><a href="class-page.html?key=' + json.name + '">View</a></li>' +
                    '        <li><a data-toggle="modal" data-target="#myModal" id="deleteClass' + index + '">Delete</a></li>' +
                    '    </ul>' +
                    '</div>';
                studentTable.append(btnHTML);
                $('#deleteClass' + index).data('classPath','classes/' + json.name);
                $('#deleteClass' + index).click(function(){
                    var toDelete = $(this).data('classPath');
                    console.log(toDelete);
                    var ref = database.ref(toDelete);
                    ref.remove();
                    location.reload();
                });
                index = index + 1;
            });
        });
});
