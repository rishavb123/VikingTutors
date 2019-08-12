let selectedTopicPath = [""];
let navResults;
let numOfTopics = 0;

function name() {
    console.log(selectedTopicPath.map(s => getFromHierarchy(s, navResults.hierarchy, navResults.topics).name));
}
setInterval(name, 1000);

function onNavReady(querySnapshot, hierarchy, topics) {
    navResults = { querySnapshot, hierarchy, topics };

    updateUI(numOfTopics);
}

function updateUI(topicIndex) {
    let topicId = selectedTopicPath[topicIndex].split("/")[1] || "root";
    let nextTopics = getFromHierarchy(selectedTopicPath[topicIndex], navResults.hierarchy, navResults.topics).subtopics;
    if(Object.values(nextTopics).length > 0) {
        $('#topic-' + topicIndex).append(`<select class="form-control select_${topicIndex}" id=select_${topicIndex}_${topicId} selectedIndex=-1><option class="empty" id=option_${topicIndex}_${topicId} selected></option></select>`);
        for(let path in nextTopics) {
            let curtopicId = path.split("/")[1];
            $(`#select_${topicIndex}_` + topicId).append(`<option id=option_${topicIndex}_${curtopicId}>${getFromHierarchy(path, navResults.hierarchy, navResults.topics).name}</option>`);
        }
    }

    $(".select_" + topicIndex).change(function(event) {
        let e = event.target;
        selectedTopicPath[topicIndex] = "topics/" + e.options[e.selectedIndex].id.split("_")[2];
        $(e).nextAll('select').remove();
        if(!$(e.options[e.selectedIndex]).hasClass("empty"))
            updateUI(topicIndex);
    });

}

$('#addTopicButton').click(() => {
    numOfTopics++;
    selectedTopicPath.push("");
    $(".topic-container-container").append(`<div class="topic-container" id="topic-${numOfTopics}"></div>`);
    updateUI(numOfTopics);
});