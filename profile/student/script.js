let docId = "";

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbstudents.org")
            if(domain !== "sbschools.org" && domain !== "bhagat.io"  || domain !== "vikingtutors.org")
                firebase.auth().signOut();
            else
                location.href="../teacher/index.html";
        else
            onAuthStateChanged(user, domain);
        $('#emailInput').val(user.email);
        db.collection("students").where("uid", "==", user.uid).get().then((querySnapshot) => {
            let data = querySnapshot.docs[0].data();
            docId = querySnapshot.docs[0].id;
            $("#firstNameInput").val(data.name.first);
            $("#lastNameInput").val(data.name.last);
        });
        console.log(user.displayName);
    }
    else
        location.href="../../login/index.html";
});

$('.save-button').click(() => {
    let data = {
        name: {
            first: $('#firstNameInput').val(),
            last: $("#lastNameInput").val()
        }
    };
    Promise.all([
        db.collection("students").doc(docId).update(data),
        firebase.auth().currentUser.updateProfile({
            displayName: data.name.first + " " + data.name.last
        })
    ]).then(() => alert("Saved!"));
});
