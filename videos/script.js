function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();

    let selectedTopics = [];
    let searchTopic = getFromHierarchy("topics/" + params.t, hierarchy, topics);
    const select = (topic, path) => {
        selectedTopics.push(path.split("/")[1]);
        for(let subPath in topic.subtopics) {
            select(topic.subtopics[subPath], subPath);
        }
    }
    select(searchTopic, "topics/" + params.t);
    Promise.all(selectedTopics.map(topic => db.collection("videos").where("topics", "array-contains", topic).get())).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                getVideoData(doc.data().videoId, (data) => {
                    data.embed = new Handlebars.SafeString(data.embed);
                    data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />")));
                    const html = template(data);
                    $("#video-container").append($(html).attr("class", "video"));
                });
            });
        });
    });
}