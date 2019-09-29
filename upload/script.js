let selectedTopicPath = ["topics/root"];
let selectedTopicPath2 = ["topics/root"];
let navResults;
let numOfTopics = 0;
let numOfTopics2 = 0;

function onNavReady(querySnapshot, hierarchy, topics) {
    navResults = { querySnapshot, hierarchy, topics };

    updateUI(numOfTopics);
    updateUI2(numOfTopics);
}

function updateUI(topicIndex) {
    let topicId = selectedTopicPath[topicIndex].split("/")[1] || "root";
    let curTopic = getFromHierarchy(selectedTopicPath[topicIndex], navResults.hierarchy, navResults.topics);
    let nextTopics = curTopic.subtopics;
    $('#topic-' + topicIndex).append(`<select class="form-control select_${topicIndex}" id=select_${topicIndex}_${topicId} selectedIndex=-1><option id=option_${topicIndex}_${topicId} selected></option></select>`);
    for(let path in nextTopics) {
        let curtopicId = path.split("/")[1];
        $(`#select_${topicIndex}_` + topicId).append(`<option id=option_${topicIndex}_${curtopicId}>${getFromHierarchy(path, navResults.hierarchy, navResults.topics).name}</option>`);
    }
    $(`#select_${topicIndex}_` + topicId).append(`<span id="newtopic_${topicIndex}"></span><option id=option_${topicIndex}_create>Create New Sub Topic of ${curTopic.name}</option>`);

    $(".select_" + topicIndex).change(function(event) {
        let e = event.target;
        if(e.selectedIndex === e.options.length - 1) {
            let name = prompt(`What is the name of the new sub topic of ${curTopic.name}`);
            if(name) {
                let newTopicId = db.collection("topics").doc().id;
                let obj = { name };
                if(selectedTopicPath[topicIndex] !== "topics/root")
                    obj.superTopic = db.doc(selectedTopicPath[topicIndex]);
                getFromHierarchy(selectedTopicPath[topicIndex], navResults.hierarchy, navResults.topics).subtopics[`topics/${newTopicId}`] = {
                    name,
                    subtopics: {}
                };
                navResults.topics[`topics/${newTopicId}`] = { name, superTopic: obj.superTopic? obj.superTopic.path : undefined };
                console.log(obj);
                db.collection("topics").doc(newTopicId).set(obj);
            } else {
                e.selectedIndex = 0;
            }
        }
        $(e).nextAll('select').remove();
        if(e.selectedIndex !== e.options.length - 1)
            selectedTopicPath[topicIndex] = "topics/" + e.options[e.selectedIndex].id.split("_")[2];
        else
            $(e).remove();
        if(e.selectedIndex !== 0)
            updateUI(topicIndex);
    });

}

function updateUI2(topicIndex) {
    let topicId = selectedTopicPath2[topicIndex].split("/")[1] || "root";
    let curTopic = getFromHierarchy(selectedTopicPath2[topicIndex], navResults.hierarchy, navResults.topics);
    let nextTopics = curTopic.subtopics;
    $('#topic2-' + topicIndex).append(`<select class="form-control select2_${topicIndex}" id=select2_${topicIndex}_${topicId} selectedIndex=-1><option id=option2_${topicIndex}_${topicId} selected></option></select>`);
    for(let path in nextTopics) {
        let curtopicId = path.split("/")[1];
        $(`#select2_${topicIndex}_` + topicId).append(`<option id=option2_${topicIndex}_${curtopicId}>${getFromHierarchy(path, navResults.hierarchy, navResults.topics).name}</option>`);
    }
    $(`#select2_${topicIndex}_` + topicId).append(`<span id="newtopic2_${topicIndex}"></span><option id=option2_${topicIndex}_create>Create New Sub Topic of ${curTopic.name}</option>`);

    $(".select2_" + topicIndex).change(function(event) {
        let e = event.target;
        if(e.selectedIndex === e.options.length - 1) {
            let name = prompt(`What is the name of the new sub topic of ${curTopic.name}`);
            if(name) {
                let newTopicId = db.collection("topics").doc().id;
                let obj = { name };
                if(selectedTopicPath2[topicIndex] !== "topics/root")
                    obj.superTopic = db.doc(selectedTopicPath2[topicIndex]);
                getFromHierarchy(selectedTopicPath2[topicIndex], navResults.hierarchy, navResults.topics).subtopics[`topics/${newTopicId}`] = {
                    name,
                    subtopics: {}
                };
                navResults.topics[`topics/${newTopicId}`] = { name, superTopic: obj.superTopic? obj.superTopic.path : undefined };
                console.log(obj);
                db.collection("topics").doc(newTopicId).set(obj);
            } else {
                e.selectedIndex = 0;
            }
        }
        $(e).nextAll('select').remove();
        if(e.selectedIndex !== e.options.length - 1)
            selectedTopicPath2[topicIndex] = "topics/" + e.options[e.selectedIndex].id.split("_")[2];
        else
            $(e).remove();
        if(e.selectedIndex !== 0)
            updateUI2(topicIndex);
    });

}

$('#addTopicButton').click(() => {
    numOfTopics++;
    selectedTopicPath.push("");
    $(".topic-container-container").append(`<div class="topic-container" id="topic-${numOfTopics}"></div>`);
    updateUI(numOfTopics);
});

$('#addTopicButton2').click(() => {
    numOfTopics2++;
    selectedTopicPath2.push("");
    $(".topic-container-container-2").append(`<div class="topic-container" id="topic2-${numOfTopics2}"></div>`);
    updateUI2(numOfTopics2);
});

$(".upload-button").click(() => {
    db.collection("teachers").where("uid", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
        db.collection("videos").doc().set({
            videoId: getUrlParametersFromUrl($('#linkInput').val()).v,
            teacher: querySnapshot.docs[0].id,
            topics: selectedTopicPath.map(s => s.split("/")[1]),
        }).then(() => location.reload());
    });
});

$(".upload-button-2").click(() => {
    db.collection("teachers").where("uid", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
        db.collection("gdrivefiles").doc().set({
            name: $("#nameInput").val(),
            description: $("#descriptionInput").val(),
            url: $($("#embedCodeInput").val()).attr("src"),
            teacher: querySnapshot.docs[0].id,
            topics: selectedTopicPath2.map(s => s.split("/")[1])
        }).then(() => location.reload());
    });
});

const source = $("#video-template")[0].innerHTML;
const template = Handlebars.compile(source);

function onAuthStateChanged(user, domain) {
    
    if(domain === "sbstudents.org")
        location.href = root + "/index.html";
    else
        $(".navbar-nav").append(`<li class="nav-item"><a class="nav-link" href="${root}/upload/index.html">Upload</a></li>`);
    db.collection("teachers").where("uid", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
    
        db.collection("videos").where("teacher", "==", querySnapshot.docs[0].id).get().then((querySnapshot) => {
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
                        data.teacher = (teacher.honorific && teacher.name && teacher.name.last)? teacher.honorific + teacher.name.last : toTitleCase(teacher.email.split('.')[0] + " " + teacher.email.split("@")[0].split('.')[1]);
                        data.vtId = doc.id;
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
    });
}

function openVideo(e) {
    location.href= "../watch/index.html?v=" + $(e.target.parentNode).attr('id');
}

function deleteVideo(e) {
    let vtid = $(e.target).attr('id');
    let videoName = $(e.target.parentNode).find("h1")[0].innerHTML;
    let response = prompt("Please type the video's name (" + videoName + ") to confirm that you would like to delete this video. This action cannot be undone.");
    if(response == videoName) {
        db.collection("videos").doc(vtid).delete().then(() => {
            $(e.target.parentNode).remove();
            alert("Video Deleted Successfully!")
        });
    } else {
        alert("Delete Cancelled!")
    }
}