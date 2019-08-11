const db = firebase.firestore();

function onNavReady(querySnapshot, hierarchy, topics) {}

db.collection("topics").get().then((querySnapshot) => {
    
    [hierarchy, topics] = createHierarchy(querySnapshot);

    const source = $("#dropdown-item-template")[0].innerHTML;
    const dropDownItem = Handlebars.compile(source);

    const source2 = $("#dropdown-submenu-template")[0].innerHTML;
    const dropDownSubMenu = Handlebars.compile(source2);

    const display = (menuId, obj) => {
        for(let path in obj) {
            let val = getFromHierarchy(path, hierarchy, topics);
            if(Object.keys(val.subtopics).length == 0) {
                $("#" + menuId).append(dropDownItem({
                    name: val.name,
                    id: val.id,
                    topic: path.split("/")[1]
                }));
            } else {
                const id = path.replace("s/", "-");
                $("#" + menuId).append(dropDownSubMenu({
                    name: val.name,
                    id,
                    topic: path.split("/")[1]
                }));
                display(id, val.subtopics);
            }
        }
    };

    display('topic-root', hierarchy);
    $(".dropdown-toggle").dropdown();
    $('.dropdown-toggle').dropdownHover();

    onNavReady(querySnapshot, hierarchy, topics);

});

function onAuthStateChanged(user, domain) {
    console.log("Nav: auth changed " + domain );
}