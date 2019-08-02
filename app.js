
$(document).ready(() => {
    
    const source = document.getElementById("videoTemplate").innerHTML;
    const template = Handlebars.compile(source);

    db.collection("videos").get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            getVideoData(doc.data().videoId, (data) => {
                data.embed = new Handlebars.SafeString(data.embed);
                console.log(data);
                data.description = new Handlebars.SafeString(anchorme(data.description.replace(/\n/g,"<br />")));
                const html = template(data);
                $("#test").append($(html).attr("class", "video"));
            });
        });
    });

});


$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');
  
  
    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass('show');
    });
  
  
    return false;
  });