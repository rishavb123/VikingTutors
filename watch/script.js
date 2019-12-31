function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();

    db.collection("videos").where("videoId", "==", params.v).get().then((querySnapshot) => {
        let doc = querySnapshot.docs[0];
        let videoData = doc.data();
        db.collection("teachers").doc(videoData.teacher).get().then(teacherDoc => {
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
                function toTitleCase(str) {
                    return str.replace(
                        /\w\S*/g,
                        function(txt) {
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                        }
                    );
                }
                data.teacher = data.teacher = (teacher.honorific && teacher.name && teacher.name.last)? teacher.honorific + teacher.name.last : (teacher.name && teacher.name.first && teacher.name.last)? teacher.name.first + " " + teacher.name.last : toTitleCase(teacher.email.split('.')[0] + " " + teacher.email.split("@")[0].split('.')[1]);;
                const html = template(data);
                $("#video-container").append(html);
            });
        });
    });
}

function openVideo(e) {
    console.log($(e.target.parentNode).attr('id'));
}