new Rellax(".rellax");

$(document).ready(function() {
    $(".about-title").css("height", $(".about-text").height());
});
$(window).resize(function() {
    $(".about-title").css("height", $(".about-text").height());
});

if('ontouchstart' in window)
    $('header').addClass('mobile-header');

firebase.auth().onAuthStateChanged((user) => {
    if(user)
        $('#heading-buttons').remove();
});

function onNavReady(snapshot, hierarchy, topics) {
    const source = $("#topic-box-template")[0].innerHTML;
    const topicBox = Handlebars.compile(source);
    for(let path in hierarchy) {
        $("#topicBoxes").append(topicBox({
            name: hierarchy[path].name,
            topic: path.split("/")[1]
        }));
    }
}