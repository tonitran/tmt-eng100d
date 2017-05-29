firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		 document.getElementById("logout").style.visibility="visible";
	  } else {
		  document.getElementById("logout").style.visibility="hidden";
	  }
	});

// logs user out
function logout() {
	firebase.auth().signOut().then(function() {
		//document.getElementById("logout").style.visibility="hidden";

		  // Sign-out successful.
		}, function(error) {
		  // An error happened.
		});
}


function about() {
    alert('This tool was developed by a UCSD students in the class ENG 100D.');
};


function contact() {
    alert('Email Gauri Iyer at gaiyer@ucsd.edu for any questions.');
};