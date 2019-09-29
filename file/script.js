function onNavReady(querySnapshot, hierarchy, topics) {
    const source = $("#gdfile-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    let params = getUrlParameters();

    db.collection("gdrivefiles").doc(params.f).get().then((doc) => {
        let fileData = doc.data();
        db.collection("teachers").doc(fileData.teacher).get().then(teacherDoc => {
            let teacher = teacherDoc.data();
            let data = {};
            data.name = fileData.name
            data.description = new Handlebars.SafeString(anchorme(fileData.description));
            data.url = fileData.url;
            data.teacher = teacher.honorific + teacher.name.last;
            const html = template(data);
            $("#gdfile-container").append(html);
        });
    });
}