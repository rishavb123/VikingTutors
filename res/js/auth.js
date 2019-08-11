function onAuthStateChanged(user) {}

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbstudents.org" && domain !== "sbschools.org" && domain !== "bhagat.io")
            firebase.auth().signOut();
    }
    else
        location.href="login/index.html";
    onAuthStateChanged(user);
});