function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();

    db.collection("videos").where("videoId", "==", params.v).get().then((querySnapshot) => {
        let doc = querySnapshot.docs[0];
        let videoData = doc.data();
        db.collection("videos").doc(videoData.teacher).get().then(teacherDoc => {
            let teacher = teacherDoc.data();
            getVideoData(videoData.videoId, (data) => {
                data.embed = new Handlebars.SafeString(data.embed);
                data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />"), {
                    attributes: [{
                        name: "class",
                        value: "anchorme-link"
                    }]
                }));
                data.id = videoData.videoId;
                data.teacher = teacher.honorific + teacher.name.last;
                const html = template(data);
                $("#video-container").append(html);
            });
        });
    });
}

function openVideo(e) {
    console.log($(e.target.parentNode).attr('id'));
}