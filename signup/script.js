$('.btn').click(() => {
    let email = $('#emailField').val();
    let password = $('#passwordField').val();
    let first = $('#firstField').val();
    let last = $('#lastField').val();

    let confirmPassword = $('#confirmPasswordField').val();
    if(password === confirmPassword)
        if(email.split("@")[1] === "sbstudents.org" || email.split("@")[1] === "sbschools.org" || email.split("@")[1] === "bhagat.io")
            firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
                return user.updateProfile({
                    displayName: first + " " + last
                });
            });
        else
            alert("Please use your SBHS email address");
    else
        alert("Confirm Password must match Password");
});

firebase.auth().onAuthStateChanged(user => {
    if(user)
        location.href="../index.html"
});