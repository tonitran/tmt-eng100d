$(function() {

	// when user clicks on professor label, it will display the professor UI and remove student form UI
    $('#professor-form-link').click(function(e) {
		$("#professor-form").delay(100).fadeIn(100);
 		$("#student-form").fadeOut(100);
		$('#student-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	// when user clicks on student label, it will display the student UI and remove professor form UI 
	$('#student-form-link').click(function(e) {
		$("#student-form").delay(100).fadeIn(100);
 		$("#professor-form").fadeOut(100);
		$('#professor-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
