function getVideoData(videoId, callback) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&&maxResults=1&&id=${videoId}&&key=${API_KEY}`;
    $.get(url).then((results) => {
        let videoData = results.items[0].snippet;
        videoData.embed = `<iframe frameborder="0" src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>`;
        callback(videoData);
    });
}

async function getVideoDataAsync(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&&maxResults=1&&id=${videoId}&&key=${API_KEY}`;
    const results = await $.get(url);
    let videoData = results.items[0].snippet;
    videoData.embed = `<iframe frameborder="0" src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>`;
    return videoData;
}