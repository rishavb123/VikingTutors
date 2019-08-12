let selectedTopicPath = ["topics/root"];
let navResults;
let numOfTopics = 0;

function onNavReady(querySnapshot, hierarchy, topics) {
    navResults = { querySnapshot, hierarchy, topics };

    updateUI(numOfTopics);
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

$('#addTopicButton').click(() => {
    numOfTopics++;
    selectedTopicPath.push("");
    $(".topic-container-container").append(`<div class="topic-container" id="topic-${numOfTopics}"></div>`);
    updateUI(numOfTopics);
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