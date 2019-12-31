function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#gdfile-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();

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
    let noFiles = true;
    Promise.all(selectedTopics.map(topic => db.collection("gdrivefiles").where("topics", "array-contains", topic).get())).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                noFiles = false;
                let fileData = doc.data();
                db.collection("teachers").doc(fileData.teacher).get().then(teacherDoc => {
                    let teacher = teacherDoc.data();
                    let data = {};
                    data.name = fileData.name;
                    data.id = doc.id;
                    data.url = new Handlebars.SafeString(fileData.url);
                    data.description = new Handlebars.SafeString(anchorme(fileData.description));
                    function toTitleCase(str) {
                        return str.replace(
                            /\w\S*/g,
                            function(txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }
                        );
                    }
                    data.teacher = (teacher.honorific && teacher.name && teacher.name.last)? teacher.honorific + teacher.name.last : (teacher.name && teacher.name.first && teacher.name.last)? teacher.name.first + " " + teacher.name.last : toTitleCase(teacher.email.split('.')[0] + " " + teacher.email.split("@")[0].split('.')[1]);
                    const html = template(data);
                    $("#gdfile-container").append(html);
                    let items = $('#gdfile-container').children().sort((a, b) => {
                        titleA = $(a).children('h1')[0].innerHTML; 
                        titleB = $(b).children('h1')[0].innerHTML; 
                        return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                    });
                    $('#gdfile-container').append(items);
                });
            });
        });
        if(noFiles) 
            $('#gdfile-container').append("<p style='font-size: 200%'>Sorry there are currently no Google Drive Files on this topic</p>");
    });
}

function openFile(e) {
    location.href= "../file/index.html?f=" + $(e.target.parentNode.parentNode).attr('id');
}