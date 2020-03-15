const db = firebase.firestore();

const isTouchDevice = 'ontouchstart' in document.documentElement;

if(!isTouchDevice) {
    $('#navbarDropdown').attr('data-toggle', 'dropdown');
    $('#navbarDropdown2').attr('data-toggle', 'dropdown');
}

function searchTeachers() {
    if($('#search_field').val().length == 0)
        alert("Search Field Is Empty");
    else
        location.href = "https://vikingtutors.org/videos/index.html?teacher=" + $('#search_field').val();
}

function onNavReady(querySnapshot, hierarchy, topics) {}

db.collection("topics").get().then((querySnapshot) => {
    
    [hierarchy, topics] = createHierarchy(querySnapshot);

    const source11 = $("#dropdown-item-template")[0].innerHTML;
    const dropDownItem = Handlebars.compile(source11);

    const source12 = $(isTouchDevice? "#dropdown-submenu-template-mobile": "#dropdown-submenu-template")[0].innerHTML;
    const dropDownSubMenu = Handlebars.compile(source12);

    const source21 = $("#dropdown-item-template-2")[0].innerHTML;
    const dropDownItem2 = Handlebars.compile(source21);

    const source22 = $(isTouchDevice? "#dropdown-submenu-template-mobile-2": "#dropdown-submenu-template-2")[0].innerHTML;
    const dropDownSubMenu2 = Handlebars.compile(source22);

    const display = (menuId, obj) => {
        for(let path in obj) {
            let val = getFromHierarchy(path, hierarchy, topics);
            if(Object.keys(val.subtopics).length == 0) {
                $("#" + menuId).append(dropDownItem({
                    name: val.name,
                    id: val.id,
                    topic: path.split("/")[1]
                }));
                let items = $("#" + menuId).children().sort((a, b) => {
                    titleA = $(a).children('.dropdown-item')[0].innerHTML; 
                    titleB = $(b).children('.dropdown-item')[0].innerHTML; 
                    return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                });
                $("#" + menuId).append(items);
            } else {
                const id = path.replace("s/", "-");
                $("#" + menuId).append(dropDownSubMenu({
                    name: val.name,
                    id,
                    topic: path.split("/")[1],
                    open: isTouchDevice? "show": ""
                }));
                let items = $("#" + menuId).children().sort((a, b) => {
                    titleA = $(a).children('.dropdown-item')[0].innerHTML; 
                    titleB = $(b).children('.dropdown-item')[0].innerHTML; 
                    return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                });
                $("#" + menuId).append(items);
                display(id, val.subtopics);
            }
        }
    };

    const display2 = (menuId, obj) => {
        menuId += '-2';
        for(let path in obj) {
            let val = getFromHierarchy(path, hierarchy, topics);
            if(Object.keys(val.subtopics).length == 0) {
                $("#" + menuId).append(dropDownItem2({
                    name: val.name,
                    id: val.id + "-2",
                    topic: path.split("/")[1]
                }));
                let items = $("#" + menuId).children().sort((a, b) => {
                    titleA = $(a).children('.dropdown-item')[0].innerHTML; 
                    titleB = $(b).children('.dropdown-item')[0].innerHTML; 
                    return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                });
                $("#" + menuId).append(items);
            } else {
                const id = path.replace("s/", "-");
                $("#" + menuId).append(dropDownSubMenu2({
                    name: val.name,
                    id: id + "-2",
                    topic: path.split("/")[1],
                    open: isTouchDevice? "show": ""
                }));
                let items = $("#" + menuId).children().sort((a, b) => {
                    titleA = $(a).children('.dropdown-item')[0].innerHTML; 
                    titleB = $(b).children('.dropdown-item')[0].innerHTML; 
                    return titleA < titleB? -1 : titleA > titleB? 1 : 0;
                });
                $("#" + menuId).append(items);
                display2(id, val.subtopics);
            }
        }
    };

    display('topic-root', hierarchy);
    display2('topic-root', hierarchy);
    $(".dropdown-toggle").dropdown();
    $('.dropdown-toggle').dropdownHover();

    if(isTouchDevice) {
        $('.toggle').click((e) => {
            $('#' + e.target.id.split("_")[1]).toggleClass("show");
        });
    }

    onNavReady(querySnapshot, hierarchy, topics);

});

function onAuthStateChanged(user, domain) {
    if(domain === "bhagat.io" || domain === "sbschools.org")
        $(".navbar-nav").append(`<li class="nav-item"><a class="nav-link" href="${root}/upload/index.html">Upload</a></li>`);
}