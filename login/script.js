$('#signInBtn').click(() => {
    let email = $('#emailField').val();
    let password = $('#passwordField').val();
    if(email.split("@")[1] === "sbstudents.org" || email.split("@")[1] === "sbschools.org" || email.split("@")[1] === "bhagat.io" || email.split("@")[1] === "vikingtutors.org")
        firebase.auth().signInWithEmailAndPassword(email, password).catch((err) => alert(err.code.split("/")[1].replace(/-/g, " ")[0].toUpperCase() + err.code.split("/")[1].replace(/-/g, " ").substring(1)));
    else
        alert("Please use your SBHS email address");
});

firebase.auth().onAuthStateChanged(user => {
    if(user)
        location.href="../index.html"
});