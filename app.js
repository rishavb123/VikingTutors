$(document).ready(() => {

    db.collection("videos").get().then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            console.log(doc.id + " =>", await getVideoData(doc.data().videoId))
        });
    });

});

async function getVideoData(videoId) {
    const request = gapi.client.youtube.video.list({
        part: "snippet",
        maxResults: 1,
        id: videoId
    }); 
    const results = await request.execute();
    let videoData = results.items[0].snippet;
    videoData.embed = $("<iframe />").src = "https://www.youtube.com/embed/" + videoId;
    return videoData;
}