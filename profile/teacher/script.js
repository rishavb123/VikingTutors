const honorifics = Array.prototype.slice.call(document.getElementsByTagName("option"), 0).map(tag => tag.innerHTML);
let docId = "";
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbschools.org" && domain !== "bhagat.io")
            if(domain !== "sbstudents.org")
                firebase.auth().signOut();
            else
                location.href="../student/index.html";
        else
            onAuthStateChanged(user, domain);
        $('#emailInput').val(user.email);
        db.collection("teachers").where("uid", "==", user.uid).get().then((querySnapshot) => {
            let data = querySnapshot.docs[0].data();
            docId = querySnapshot.docs[0].id;
            document.getElementById("titleInput").selectedIndex = honorifics.indexOf(data.honorific == null? "None ": data.honorific);
            $("#firstNameInput").val(data.name.first);
            $("#lastNameInput").val(data.name.last);
        });
    }
    else
        location.href="../../login/index.html";
});

$('.save-button').click(() => {
    let data = {
        name: {
            first: $('#firstNameInput').val(),
            last: $("#lastNameInput").val()
        },
        honorific: honorifics[document.getElementById("titleInput").selectedIndex] == "None "? null:honorifics[document.getElementById("titleInput").selectedIndex]
    };
    Promise.all([
        db.collection("teachers").doc(docId).update(data),
        firebase.auth().currentUser.updateProfile({
            displayName: data.honorific + data.name.last
        })
    ]).then(() => alert("Saved!"));
});
