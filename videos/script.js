function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();
    console.log(params);
    console.log(hierarchy);

    db.collection("videos").where("topics", "array-contains", params.t).get().then((querySnapshot) => {
        console.log(querySnapshot.size);
        querySnapshot.forEach((doc) => {
            getVideoData(doc.data().videoId, (data) => {
                data.embed = new Handlebars.SafeString(data.embed);
                data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />")));
                const html = template(data);
                $("#test").append($(html).attr("class", "video"));
            });
        });
    });
}