$(document).ready(function () {
	$signUpForm = $('#signUp');
	
	$signUpForm.submit(function (e) {
		e.preventDefault();
		
$.ajax({
      url    : $signUpForm.attr('action'),
      method : 'post',
      data   : $signUpForm.serialize()
    }).done(function (data) {
		$('.registerationForm').hide();
		var userName = data.userName;
		var password = data.password;
		var phoneNumber = data.phoneNumber;
		alert('Dear '+userName+', you have registered sucessfully, password : '+password+', phone number : '+phoneNumber);
    }).fail(function (xhr, err, status) {
		alert('failed :(');
    });		
	});
});