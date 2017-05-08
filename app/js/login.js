$(function() {

    $('#professor-form-link').click(function(e) {
		$("#professor-form").delay(100).fadeIn(100);
 		$("#student-form").fadeOut(100);
		$('#student-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#student-form-link').click(function(e) {
		$("#student-form").delay(100).fadeIn(100);
 		$("#professor-form").fadeOut(100);
		$('#professor-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
