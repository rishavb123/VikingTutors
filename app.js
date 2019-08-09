const db = firebase.firestore();

$(document).ready(() => {
    
    const source = $("#video-template")[0].innerHTML;
    const template = Handlebars.compile(source);

    db.collection("videos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            getVideoData(doc.data().videoId, (data) => {
                data.embed = new Handlebars.SafeString(data.embed);
                data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />")));
                const html = template(data);
                $("#test").append($(html).attr("class", "video"));
            });
        });
    });

});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        let domain = firebase.auth().currentUser.email.split("@")[1];
        if(domain !== "sbstudents.org" || domain !== "sbschools.org" || domain !== "bhagat.io")
            firebase.auth().signOut();
    }
    else
        location.href="login/index.html";
});

db.collection("topics").get().then((querySnapshot) => {
    let topics = {};
    querySnapshot.forEach((doc) => {
        let temp = doc.data();
        if(temp.superTopic)
            temp.superTopic = temp.superTopic.path;
        topics[doc.ref.path] = temp;
    });
    let hierarchy = {};
    const get = (path) => {
        if(topics[path].superTopic) {
            let superVal = get(topics[path].superTopic);
            return superVal? superVal.subtopics[path]: null;
        }
        return hierarchy[path];
    };
    const set = (path) => {
        if(get(path)) return;
        let val = {...topics[path]};
        val.subtopics = {};
        val.displayed = false;
        if(!val.superTopic)
            hierarchy[path] = val;
        else {
            let obj = get(val.superTopic);
            if(obj) {
                obj.subtopics[path] = val;
            } else {
                set(val.superTopic);
                set(path)
            }
        }
    };

    for(let path in topics) {
        set(path);
    }

    const source = $("#dropdown-item-template")[0].innerHTML;
    const dropDownItem = Handlebars.compile(source);

    const source2 = $("#dropdown-submenu-template")[0].innerHTML;
    const dropDownSubMenu = Handlebars.compile(source2);

    const display = (menuId, obj) => {
        for(let path in obj) {
            let val = get(path);
            if(Object.keys(val.subtopics).length == 0) {
                $("#" + menuId).append(dropDownItem(val));
            } else {
                const id = path.replace("s/", "-");
                $("#" + menuId).append(dropDownSubMenu({
                    name: val.name,
                    id
                }));
                display(id, val.subtopics);
            }
        }
    };

    display('topic-root', hierarchy);
    $(".dropdown-toggle").dropdown();
    $('.dropdown-toggle').dropdownHover();
});