$('.btn').click(() => {
    let email = $('#emailField').val();
    let password = $('#passwordField').val();
    if(email.split("@")[1] === "sbstudents.org" || email.split("@")[1] === "sbschools.org" || email.split("@")[1] === "bhagat.io")
        firebase.auth().signInWithEmailAndPassword(email, password);
    else
        alert("Please use your SBHS email address");
});

firebase.auth().onAuthStateChanged(user => {
    if(user)
        location.href="../index.html"
});