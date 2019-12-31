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
            function toTitleCase(str) {
                return str.replace(
                    /\w\S*/g,
                    function(txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    }
                );
            }
            data.teacher = data.teacher = (teacher.honorific && teacher.name && teacher.name.last)? teacher.honorific + teacher.name.last : (teacher.name && teacher.name.first && teacher.name.last)? teacher.name.first + " " + teacher.name.last : toTitleCase(teacher.email.split('.')[0] + " " + teacher.email.split("@")[0].split('.')[1]);;
            const html = template(data);
            $("#gdfile-container").append(html);
        });
    });
}