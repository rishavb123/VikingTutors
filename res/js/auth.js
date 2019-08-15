let mustBeEmailVerified = true;
let mustBeSignedIn = true;

function onAuthStateChanged(user, domain) {}

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbstudents.org" && domain !== "sbschools.org" && domain !== "bhagat.io")
            firebase.auth().signOut();
        else {
            if(!user.emailVerified && mustBeEmailVerified)
                location.href = root + "/verify/index.html";
            else
                onAuthStateChanged(user, domain);
        }
    }
    else if(mustBeSignedIn)
        location.href= root + "/login/index.html";
});