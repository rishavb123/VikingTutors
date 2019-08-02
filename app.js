
$(document).ready(() => {
    
    const source = document.getElementById("videoTemplate").innerHTML;
    const template = Handlebars.compile(source);

    db.collection("videos").get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            getVideoData(doc.data().videoId, (data) => {
                data.embed = new Handlebars.SafeString(data.embed);
                data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />")));
                const html = template(data);
                $("#test").append($(html).attr("class", "video"));
            });
        });
    });

});