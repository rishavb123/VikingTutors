function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#livestream-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let noStreams = true;

    if(["vikingtutors.org", "bhagat.io", "sbschools.org"].includes(firebase.auth().currentUser.email.split("@")[1])) {
        $('.main').prepend($('.teacher-stuff')[0].innerHTML);
    }

    db.collection("streams").get().then((querySnapshots) => {
        querySnapshots.forEach((doc) => {
            let d = doc.data()
            $('.livestreams-container').append(template(d));
            noStreams = false;
        })
    }).then(() => {
        if(noStreams) 
            $('.livestreams-container').append("<p style='font-size: 200%'>Sorry there are currently no streams</p>");
    });

    
    $(".upload-button").click(() => {
        console.log("dsfds")
        db.collection("streams").doc().set({
            url: $('#linkInput').val(),
            name: $('#nameInput').val(),
            description: $('#descriptionInput').val()
        }).then(() => location.reload());
    });
    
    $(".delete-button").click(() => {
        let d = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        if(prompt("Confirm you are want to delete " + $('#nameInput2').val() + " from the streams by copying typing " + d) == d)
            db.collection("streams").where("name", "==", $('#nameInput2').val()).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete().then(() => location.reload());
                });
            });
    });
}