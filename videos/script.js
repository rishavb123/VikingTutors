function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();
    if(params.t && params.t == 'dmuOe4mxyGviPkmOzeql') location.href="../streams/index.html"

    let noVids = true;

    if(params.teacher) {
        let names = params.teacher.split(" ");
        let teachers = [];
        db.collection("teachers").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                for(let name of names) {
                    name = name.toLowerCase();
                    if(data.email.split("@")[0].toLowerCase().includes(name.toLowerCase()) || (data.name && (data.name.first.toLowerCase().includes(name.toLowerCase()) || data.name.last.toLowerCase().includes(name.toLowerCase()))))
                        teachers.push(doc.id);
                }
            });
        }).then(() => {
            Promise.all(teachers.map(teacher => db.collection("videos").where("teacher", "==", teacher).get())).then((querySnapshots) => {
                querySnapshots.forEach((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        noVids = false;
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
                                const html = template(data);
                                $("#video-container").append(html);
                                let items = $('#video-container').children().sort((a, b) => {
                                    titleA = $(a).children('h1')[0].innerHTML; 
                                    titleB = $(b).children('h1')[0].innerHTML; 
                                    return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                                });
                                $('#video-container').append(items);
                            });
                        });
                    });
                });
            }).then(() => {
                if(noVids) 
                    $('#video-container').append("<p style='font-size: 200%'>Sorry there are currently no videos on this topic</p>");
            });
        });
    } else {
        let selectedTopics = [];
        if(params.t) {
            let searchTopic = getFromHierarchy("topics/" + params.t, hierarchy, topics);
            const select = (topic, path) => {
                selectedTopics.push(path.split("/")[1]);
                for(let subPath in topic.subtopics) {
                    select(topic.subtopics[subPath], subPath);
                }
            }
            select(searchTopic, "topics/" + params.t);
        } else 
            selectedTopics = Object.keys(topics).map(path => path.split("/")[1]);
        Promise.all(selectedTopics.map(topic => db.collection("videos").where("topics", "array-contains", topic).get())).then((querySnapshots) => {
            querySnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    noVids = false;
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
                            const html = template(data);
                            $("#video-container").append(html);
                            let items = $('#video-container').children().sort((a, b) => {
                                titleA = $(a).children('h1')[0].innerHTML; 
                                titleB = $(b).children('h1')[0].innerHTML; 
                                return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                            });
                            $('#video-container').append(items);
                        });
                    });
                });
            });
        }).then(() => {
            if(noVids) 
                $('#video-container').append("<p style='font-size: 200%'>Sorry there are currently no videos on this topic</p>");
        });
    }
}

function openVideo(e) {
    location.href= "../watch/index.html?v=" + $(e.target.parentNode).attr('id');
}