$(document).ready(function () {

    //Firebase Initialisierung
    var config = {
    	    apiKey: "AIzaSyBvTg0_QrhEvQ9UeZPH8--E2JZ55KA_u_c",
    	    authDomain: "smart-city-ss2020.firebaseapp.com",
    	    databaseURL: "https://smart-city-ss2020.firebaseio.com",
    	    projectId: "smart-city-ss2020",
    	    storageBucket: "smart-city-ss2020.appspot.com",
    	    messagingSenderId: "957240233717"
    };
    firebase.initializeApp(config);
    $('#logout_button').hide();
    $('#calendar_button').hide();
    $('#administration_button').hide();
    $('#message_button').hide();
});

    function loginUser() {
        var email = $('#mail_signin').val();
        var password = $('#password_signin').val();

        if(email != undefined && email.length > 0 && password != undefined && password.length > 0){
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                    //Token zu Bürgerbüro senden -> Uid zurückbekommen -> Dann User validiert
                    alert("Token ist:" + idToken);

                    let xhr;
                    xhr = new XMLHttpRequest();
                    var url = "/api/user";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-type", "application/json");
                    var data = JSON.stringify({"token":idToken});
                    var userid = xhr.send(data);
                    alert("UserID ist:" + userid);

                    console.log(firebase.auth().currentUser);
                    $('#user_loggedin').html(firebase.auth().currentUser.email);
                    $('#logout_button').show();
                    $('#login_button').hide();
                    $('#mail_formfield').hide();
                    $('#password_formfield').hide();
                    $('#mail_signin').val("")
                    $('#password_signin').val("")
                    $('#calendar_button').show();
                    $('#administration_button').show();
                    $('#message_button').show();
                }).catch(function(error) {
                    console.log(error);
                });
            }, function(error) {
                if(error.code == "auth/invalid-email" || error.code == "auth/wrong-password" || error.code == "auth/user-not-found"){
                    alert("E-Mail oder Passwort falsch oder User existiert nicht");
                } else if(error.code == "auth/user-disabled"){
                    alert("Dieser Nutzer ist deaktiviert");
                } else {
                    alert(error);
                }
            });
        } else {
            alert("Bitte Mail und Passwort eingeben");
        }
    };

    function logoutUser() {
	firebase.auth().signOut().then(function() {
		//Logout erfolgreich
        $('#user_loggedin').html("");
      $('#logout_button').hide();
      $('#login_button').show();
      $('#mail_formfield').show();
      $('#password_formfield').show();
      $('#calendar_button').hide();
      $('#administration_button').hide();
      $('#message_button').hide();

	}, function(error) {
    $('#mail_signin').val("")
    $('#password_signin').val("")
		alert("Logout fehlgeschlagen");
	});
};



