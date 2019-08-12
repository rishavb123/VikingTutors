$('.resend-btn').click(() => {
    firebase.auth().currentUser.sendEmailVerification().then(() => alert("Resent Verification Email!"));
});

let x = 0;
let y = 0;

let dx = 1;
let dy = 1;
let moving = true;
$('.toggle').click(() => { moving = !moving });
$('.reset').click(() => { x = 0; y = 0; dx = 1; dy = 1; });
setInterval(() => {
    if(moving) {
        x += dx;
        y += dy;
        dy++;
    }

    $('.resend-btn').css("left", x + 'vw');
    $('.resend-btn').css("top", (y > 95? 95: y) + 'vh');

    if(x >= 90)
        dx = -1;
    else if(x <= 0)
        dx = 1;
    if(y >= 95)
        dy = -Math.round(0.8 * Math.abs(dy));
    else if(y <= 0)
        dy = 1;

}, 100);