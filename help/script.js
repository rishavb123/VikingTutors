const source3 = $("#video-template-2")[0].innerHTML;
const template3 = Handlebars.compile(source3);

function onAuthStateChanged(user, domain) {
    
    if(domain === "sbstudents.org")
        location.href = root + "/index.html";
    else
        $(".navbar-nav").append(`<li class="nav-item"><a class="nav-link" href="${root}/upload/index.html">Upload</a></li>`);

        db.collection("videos").where("teacher", "==", "8qTD9qDBzB8KZO8IICE2").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
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
                        function toTitleCase(str) {
                            return str.replace(
                                /\w\S*/g,
                                function(txt) {
                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                }
                            );
                        }
                        data.id = videoData.videoId;
                        data.teacher = (teacher.honorific && teacher.name && teacher.name.last)? teacher.honorific + teacher.name.last : (teacher.name && teacher.name.first && teacher.name.last)? teacher.name.first + " " + teacher.name.last : toTitleCase(teacher.email.split('.')[0] + " " + teacher.email.split("@")[0].split('.')[1]);
                        data.vtId = doc.id;
                        const html = template3(data);
                        $("#tut-video-container").append(html);
                        let items = $('#tut-video-container').children().sort((a, b) => {
                            titleA = $(a).children('h1')[0].innerHTML; 
                            titleB = $(b).children('h1')[0].innerHTML; 
                            return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                        });
                        $('#tut-video-container').append(items);
                    });
            });
        });
    });
}

function openVideo(e) {
    location.href= "../watch/index.html?v=" + $(e.target.parentNode).attr('id');
}