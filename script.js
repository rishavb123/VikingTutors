new Rellax(".rellax");

$(document).ready(function() {
    $(".about-title").css("height", $(".about-text").height());
});
$(window).resize(function() {
    $(".about-title").css("height", $(".about-text").height());
});