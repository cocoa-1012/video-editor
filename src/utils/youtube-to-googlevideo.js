// import * as types from '../constants';
const youtuToGoogleVideo = async (url) => {
    // youtube, convert to googlevideo
    
    const corsURL = `${url}`;
    // console.log('corsURL', corsURL);
    try {
        let html = await (await fetch(corsURL)).text();
        let matches = html.match(
            /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+meta|<\/script|\n)/
        );
        let json = JSON.parse(matches[1]);
        let formats = json.streamingData.formats;
        // const ff = formats.filter((f) => f.quality.includes("720"));
        // console.log('formats', formats);
        // console.log('formats[0]', formats[0]);
        // console.log('ff', ff);

        let [format] = formats.filter((f) => f.quality.includes("720"));
        if (format === undefined) format = formats[0];
        // console.log('format', format);

        // console.log(format.url);
        // console.log(`${format.width}x${format.height}`);

        return format;
    } catch (e) {
        console.log(e);
    }
};

youtuToGoogleVideo('https://www.youtube.com/watch?v=o92_d0ztu1w');