import { Parser } from 'm3u8-parser';

export const readM3u8File = async (url) => {
    try {
        let html = await (await fetch(url)).text();
        const filename = url.substring(url.lastIndexOf('/') + 1);
        const parser = new Parser();
        parser.push(html);
        parser.end();

        const parsed_manifest = parser.manifest;
        let pls = parsed_manifest.playlists;
        pls.sort(function (x, y) {
            if (x.attributes.RESOLUTION.height > y.attributes.RESOLUTION.height) {
                return -1;
            }
            if (x.attributes.RESOLUTION.height < y.attributes.RESOLUTION.height) {
                return 1;
            }
            return 0;
        });

        const pl = pls[0];
        const _video_url = url.replace(filename, pl.uri);
        const bunnyUrl = url.replace(filename, `play_${pl.attributes.RESOLUTION.height}p.mp4`);

        return [_video_url, bunnyUrl, pl.attributes.RESOLUTION.height, parsed_manifest.playlists];
    } catch (e) {
        console.log(e);
    }
};