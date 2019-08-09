const honorifics = ['Mr. ', 'Mrs. ', 'Ms. ', 'Dr. ', 'Miss ', 'Sir ', 'Lord ', 'Lady '];
let docId = "";
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbschools.org" && domain !== "bhagat.io")
            if(domain !== "sbstudents.org")
                firebase.auth().signOut();
            else
                location.href="../student/index.html";
        $('#emailInput').val(user.email);
        db.collection("teachers").where("uid", "==", user.uid).get().then((querySnapshot) => {
            let data = querySnapshot.docs[0].data();
            docId = querySnapshot.docs[0].id;
            document.getElementById("titleInput").selectedIndex = honorifics.indexOf(data.honorific);
            $("#firstNameInput").val(data.name.first);
            $("#lastNameInput").val(data.name.last);
        });
        console.log(user.displayName);
    }
    else
        location.href="../../login/index.html";
});

$('.save-button').click(() => {
    console.log("Clicked!");
    let data = {
        name: {
            first: $('#firstNameInput').val(),
            last: $("#lastNameInput").val()
        },
        honorific: honorifics[document.getElementById("titleInput").selectedIndex]
    };
    db.collection("teachers").doc(docId).update(data);
    firebase.auth().currentUser.updateProfile({
        displayName: data.honorific + data.name.last
    });
});
