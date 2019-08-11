let selectedTopicPath = "";
let navResults;

// <select class="form-control" id="topicInput">
//     <option>Mr. </option>
//     <option>Mrs. </option>
//     <option>Ms. </option>
//     <option>Dr. </option>
//     <option>Miss </option>
// </select>

function name() {
    console.log(getFromHierarchy(selectedTopicPath, navResults.hierarchy, navResults.topics).name);
}
setInterval(name, 1000);

function onNavReady(querySnapshot, hierarchy, topics) {
    navResults = { querySnapshot, hierarchy, topics };


    updateUI();
}

function updateUI() {
    let topicId = selectedTopicPath.split("/")[1] || "root";
    let nextTopics = getFromHierarchy(selectedTopicPath, navResults.hierarchy, navResults.topics).subtopics;
    if(Object.values(nextTopics).length > 0) {
        $('#topic-group').append(`<select class="form-control" id=select_${topicId} selectedIndex=-1><option class="empty" id=option_${topicId} selected></option></select>`);
        for(let path in nextTopics) {
            let curtopicId = path.split("/")[1];
            $('#select_' + topicId).append(`<option id=option_${curtopicId}>${getFromHierarchy(path, navResults.hierarchy, navResults.topics).name}</option>`);
        }
    }

    $("select").change(function(event) {
        let e = event.target;
        selectedTopicPath = "topics/" + e.options[e.selectedIndex].id.split("_")[1];
        $(e).nextAll('select').remove();
        if(!$(e.options[e.selectedIndex]).hasClass("empty"))
            updateUI();
    });

}