import * as types from '../constants';
import * as commonmark from "commonmark";
import { readM3u8File } from './m3u8';

let time_link_pattern = /<a href="\d\d:\d\d:\d\d,\d\d\d">\d*<\/a>/g;
let html_tag_pattern = /<[\s\S]*?>/g;

export const truncateString = (str, num) => {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

export const getFixedNumber = (number, digits) =>
    Math.round(number * 10 ** digits) / 10 ** digits;

export const getYoutubeId = (uri = "") => {
    if (uri.includes("https://youtu")) {
        const arr_uri = uri.split("/");
        const last_uri = arr_uri[arr_uri.length - 1];
        if (last_uri.includes("watch")) {
            return last_uri.split("=")[last_uri.split("=").length - 1];
        }
        return last_uri;
    } else if (uri.includes("video/")) {
        return false;
    }
    return uri;
};


const getTimeValue = (str) => {
    //00:00:00,000
    return (
        str.substring(0, 2) * 3600 +
        str.substring(3, 5) * 60 +
        str.substring(6, 8) * 1 +
        str.substring(9) * 0.001
    );
};


export const getThumbUrl = (videourl, videotype) => {
    let thumburl = '', filename;
    switch (videotype) {
        case 'mp4':
            filename = videourl.substring(videourl.lastIndexOf('/') + 1);
            thumburl = videourl.replace(filename, `thumbnail.jpg`);
            break;
        case 'm3u8':
            filename = videourl.substring(videourl.lastIndexOf('/') + 1);
            thumburl = videourl.replace(filename, `thumbnail.jpg`);
            break;
        case 'youtube':
            break;
        default:
            // bunny
            // attach play_720p.mp4
            const _videourl = videourl.replace(/\/$/, '');
            thumburl = `${_videourl}/thumbnail.jpg`;
    }
    return thumburl;
};

export const getVideoUrl = (commonmark_text) => {
    let icon_pattern = /<link(\s*?)rel(\s*?)=(\s*?)("|')icon("|') href(\s*?)=(\s*?)("|')(.*?)("|')(.*?)>/;

    let author_pattern = /<meta(\s*?)name(\s*?)=(\s*?)("|')author("|') content(\s*?)=(\s*?)("|')(.*?)("|')(.*?)>/;
    let description_pattern = /<meta(\s*?)name(\s*?)=(\s*?)("|')description("|') content(\s*?)=(\s*?)("|')(.*?)("|')(.*?)>/;
    let language_pattern = /<meta(\s*?)http-equiv(\s*?)=(\s*?)("|')content-language("|') content(\s*?)=(\s*?)("|')(.*?)("|')(.*?)>/;

    let content_pattern = /content(\s*?)=(\s*?)("|')(.*?)("|')/;
    let url_pattern = /<link(\s*?)rel(\s*?)=(\s*?)("|')contents("|')(.*?)href(\s*?)=(\s*?)("|')(.*?)("|')(.*?)>/;
    let href_pattern = /href(\s*?)=(\s*?)("|')(.*?)("|')/;
    let type_pattern = /type(\s*?)=(\s*?)("|')(.*?)("|')/;

    let reader = new commonmark.Parser({ smart: true });
    let writer = new commonmark.HtmlRenderer();
    let parsed = reader.parse(commonmark_text); // parsed is a 'Node' tree

    // transform parsed if you like...
    let html_script = writer.render(parsed);

    let walker = parsed.walker();
    let event, node;
    let project_titles = [], is_odd_h1 = true, is_odd_h2 = true, author = '', description = '', meta_language = 'en', chapters = 0, icon = '';

    while ((event = walker.next())) {
        node = event.node;
        let str = writer.render(node);
        // console.log('node.type', node.type)
        if (node.type === "heading" && node.level === 1) {
            is_odd_h1 = !is_odd_h1;
            if (is_odd_h1) {
                project_titles.push(
                    str
                        .replace(time_link_pattern, "")
                        .replace(html_tag_pattern, "")
                        .replace(/<h1>/g, "")
                        .replace(/<\/h1>/g, "")
                        .replace(/\n/g, "")
                );
            }
        }
        if (node.type === "heading" && node.level === 2) {
            chapters++;
            is_odd_h2 = !is_odd_h2;
            if (is_odd_h2) {
                let chapter = str.replace(time_link_pattern, "").replace(html_tag_pattern, "");
                project_titles.push(
                    chapter
                        .replace(/<h2>/g, "")
                        .replace(/<\/h2>/g, "")
                        .replace(/\n/g, "")
                );
            }
        }
    }
    chapters /= 2;

    // get icon info
    let icons = html_script.match(icon_pattern);
    if (icons !== null && icons.length > 0) {
        const hrefs = icons[0].match(href_pattern);
        if (hrefs !== null && hrefs.length > 0) {
            icon = hrefs[0].replace('href', '').replace(/("|')/g, '').replace('=', '').replace(/^\s+|\s+$/gm, '');
        }
    }


    let authors = html_script.match(author_pattern);
    if (authors !== null && authors.length > 0) {
        const contents = authors[0].match(content_pattern);
        if (contents !== null && contents.length > 0) {
            author = contents[0]
                .replace(html_tag_pattern, "")
                .replace('content', '').replace(/("|')/g, '').replace('=', '').replace(/^\s+|\s+$/gm, '');
        }
    }

    let descriptions = html_script.match(description_pattern);
    if (descriptions !== null && descriptions.length > 0) {
        const contents = descriptions[0].match(content_pattern);
        if (contents !== null && contents.length > 0) {
            description = contents[0]
                .replace(html_tag_pattern, "")
                .replace('content', '').replace(/("|')/g, '').replace('=', '').replace(/^\s+|\s+$/gm, '');
        }
    }

    let languages = html_script.match(language_pattern);
    if (languages !== null && languages.length > 0) {
        const contents = languages[0].match(content_pattern);
        if (contents !== null && contents.length > 0) {
            meta_language = contents[0].replace('content', '').replace(/("|')/g, '').replace('=', '').replace(/^\s+|\s+$/gm, '');
            meta_language = meta_language.toLowerCase();
        }
    }

    let links = html_script.match(url_pattern);

    if (links !== null && links.length > 0) {
        const hrefs = links[0].match(href_pattern);
        if (hrefs !== null && hrefs.length > 0) {
            const href_url = hrefs[0].replace('href', '').replace(/("|')/g, '').replace('=', '').replace(/^\s+|\s+$/gm, '');
            const types = links[0].match(type_pattern);
            let type_string = 'bunny';
            if (types && types.length > 0)
                type_string = types[0].replace(/\s+/gm, '').replace(/type=("|')/, '').replace(/("|')/, '');

            return [href_url, type_string, project_titles, author, description, meta_language, chapters, icon];
        }
    }
    return ['', '', project_titles, author, description, meta_language, chapters, icon];
};

const changeEndtimeBasedonNextStarttime = (arr, start_time) => {
    let arrIndex = arr.length - 1;
    while (arrIndex >= 0) {
        if (arr[arrIndex].type === 'img' && arrIndex + 1 <= arr.length - 1) {
            arr[arrIndex].end = arr[arrIndex + 1].start;
        } else
            arr[arrIndex].end = start_time;
        if (arr[arrIndex].type === "title" || arr[arrIndex].type === "chapter") break;
        arrIndex--;
    }
    return arr;
}

let time_pattern = /\d\d:\d\d:\d\d,\d\d\d/g;

const pushArr = (arr, text, slide, level, chapter_id, parent) => {
    let img_pattern = /<img src="(.*?)" alt="(.*?)" \/>/;
    text = text
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");

    const temp_str_arr = text.match(time_pattern);
    if (
        temp_str_arr !== null &&
        temp_str_arr.length > 0 &&
        slide !== types.SLIDETYPES.PRESENTERONLY &&
        slide !== types.SLIDETYPES.TITLEONLY) {
        if (level === 0) level = 1;
        const idx = arr.length;

        const imgs = text.match(img_pattern);
        if (imgs !== null && imgs.length > 0) {
            arr.push({
                chapter_id,
                index: idx,
                parent: parent,
                type: "img",
                level: level,
                text: imgs[2],
                url: imgs[1],
                start: getTimeValue(temp_str_arr[0]),
                end: types.INITIAL_ENDTIME,
                bottom: 0,
            });

            let imgElement = document.createElement('img');
            imgElement.crossOrigin = 'anonymous';
            imgElement.id = `img-${idx}`;
            imgElement.className = 'embeddedImg';
            imgElement.src = imgs[1];
            document.body.append(imgElement);
        }
        else
            arr.push({
                chapter_id,
                index: idx,
                parent: parent,
                type: "text",
                level: level,
                text: text.replace(time_link_pattern, ""),
                start: getTimeValue(temp_str_arr[0]),
                end: types.INITIAL_ENDTIME,
                bottom: 0,
            });
    }
    return arr;
}

export const parseText = async (style_text, commonmark_text, project_title) => {
    let slide_pattern = /<code>(.*?)<\/code>/g;
    let del_pattern_all = /<del> <a href="(.*?)">\d*<\/a>(.*?)<\/del> <a href="(.*?)">\d*<\/a>/g;
    let del_pattern_start = /<del> <a href="(.*?)">\d*<\/a>(.*?)/g;
    let del_pattern_end = /(.*?)<\/del> <a href="(.*?)">\d*<\/a>/g;
    // let ptag_pattern = /<p>[\s\S]*?<\/p>/g;
    let p__tag_pattern = /<p>—(.*?)<\/p>/g;

    // remove <!--...--> from neurovideo.md file
    let comment_pattern = /<!--[\s\S]*?-->/gm;
    commonmark_text = commonmark_text.replace(comment_pattern, '');

    // remove <ins>...</ins> from neurovideo.md file
    let ins_pattern = /<ins>[\s\S]*?<\/ins>[\s]*?\n/gm;
    commonmark_text = commonmark_text.replace(ins_pattern, '');

    let reader = new commonmark.Parser({ smart: true });
    let writer = new commonmark.HtmlRenderer();
    let parsed = reader.parse(commonmark_text); // parsed is a 'Node' tree

    // transform parsed if you like...
    let html_script = writer.render(parsed);

    let walker = parsed.walker();
    let event, node;

    let is_odd_item = true,
        is_odd_h2 = true, is_hr = false, is_odd_h3 = true, is_odd_h4 = true;

    let arr = [], dels = [];
    let parent = 0;
    let isLeft = false;
    let current_md_title = "";
    let slide = '',
        is_del_tag = false;
    let chapter_id = 0, chapter_start_time = 0;
    let is_animation = false;
    let start_time = 0;
    while ((event = walker.next())) {
        node = event.node;
        let str = writer.render(node);
        if (!is_del_tag && node.type === "html_inline" && node.literal === '<del>') {
            is_del_tag = true;

            event = walker.next()
            event = walker.next()
            node = event.node;
            let str = writer.render(node);

            const temp_str_arr = str.match(time_pattern);
            if (temp_str_arr !== null && temp_str_arr.length > 0) {
                start_time = getTimeValue(temp_str_arr[0]);

                dels.push({
                    start: start_time,
                    end: types.INITIAL_ENDTIME,
                });
            }
        }

        if (!is_del_tag) {
            const ptags = str.match(p__tag_pattern)

            if (node.type === "heading" && node.level === 2) {
                // chapter
                const text = str.replace(/<h2>/g, "").replace(/<\/h2>/g, "");
                const temp_str_arr = text.match(time_pattern);
                if (temp_str_arr !== null && temp_str_arr.length > 0) {
                    start_time = getTimeValue(temp_str_arr[0]);
                }
                is_odd_h2 = !is_odd_h2;
                if (is_odd_h2) {
                    is_animation = false;
                    chapter_start_time = start_time;
                    if (!is_hr)
                        arr = changeEndtimeBasedonNextStarttime(arr, start_time)

                    let chapter = text.replace(time_link_pattern, "");
                    chapter_id++;
                    arr.push({
                        chapter_id,
                        index: arr.length,
                        type: "chapter",
                        parent: 0,
                        isLeft: false,
                        slide: slide,
                        text: chapter,
                        start: start_time,
                        end: types.INITIAL_ENDTIME,
                        bottom: 0,
                    });
                    is_hr = false;
                }
            } else if (!is_hr && node.type === "paragraph" && ptags !== null && ptags.length > 0) {
                const temp_str_arr = str.match(time_pattern);
                if (temp_str_arr !== null && temp_str_arr.length > 0) {
                    start_time = getTimeValue(temp_str_arr[0]);
                    arr = changeEndtimeBasedonNextStarttime(arr, start_time)
                }
                is_hr = true;
            } else if (!is_hr && node.type === "heading" && node.level === 3) {
                // scene title
                const text = str.replace(/<h3>/g, "").replace(/<\/h3>/g, "");
                const temp_str_arr = text.match(time_pattern);
                const slide_str_arr = text.match(slide_pattern);
                if (temp_str_arr !== null && temp_str_arr.length > 0) {
                    is_odd_h3 = !is_odd_h3;
                    if (is_odd_h3) {
                        start_time = getTimeValue(temp_str_arr[0]);
                        const tmp = start_time;
                        let _sumDels = dels.filter(item => item.end <= tmp).reduce((prev, curr) => { return prev + curr.end - curr.start }, 0);
                        const _pseudoCurrentTime = tmp - _sumDels;
                        if (_pseudoCurrentTime > chapter_start_time + types.INTERVAL * 5 / 1000)
                            is_animation = true;

                        arr = changeEndtimeBasedonNextStarttime(arr, start_time)

                        let title = text.replace(slide_pattern, "").replace(time_link_pattern, "");
                        slide = types.SLIDETYPES.PRESENTERTEXT;

                        try { slide = slide_str_arr[0].replace("<code>", "").replace("</code>", ""); } catch { }
                        isLeft = !isLeft;
                        if (
                            slide === types.SLIDETYPES.PRESENTERTEXT
                            &&
                            (
                                current_md_title !== "" && current_md_title === title
                            )
                        ) {
                            is_animation = false;
                            isLeft = !isLeft;
                        }

                        if (slide === types.SLIDETYPES.PRESENTER_LEFT_TEXT_RIGHT) {
                            slide = types.SLIDETYPES.PRESENTERTEXT;
                            isLeft = true;
                        }
                        if (slide === types.SLIDETYPES.PRESENTER_RIGHT_TEXT_LEFT) {
                            slide = types.SLIDETYPES.PRESENTERTEXT;
                            isLeft = false;
                        }

                        if (slide === types.SLIDETYPES.PRESENTERONLY)
                            title = '';


                        // const prev = arr.filter(item => item.type === 'title');

                        // const prev_slide = prev.length > 0 ? prev[prev.length - 1].slide : '';
                        // const prev_title = prev.length > 0 ? prev[prev.length - 1].text : '';

                        // if (prev_slide !== '' && (prev_slide !== slide || prev_title !== title))

                        arr.push({
                            chapter_id,
                            is_animation: is_animation,
                            index: arr.length,
                            type: "title",
                            parent: 0,
                            isLeft: isLeft,
                            slide: slide,
                            text: title,
                            start: start_time,
                            end: types.INITIAL_ENDTIME,
                            bottom: 0,
                        });
                        parent = arr.length - 1;
                        current_md_title = title;
                        is_animation = true;
                    }
                }
            } else if (!is_hr && node.type === "heading" && node.level === 4) {
                // subtitles
                const text = str.replace(/<h4>/g, "").replace(/<\/h4>/g, "");
                const temp_str_arr = text.match(time_pattern);
                if (temp_str_arr !== null && temp_str_arr.length > 0) {
                    is_odd_h4 = !is_odd_h4;
                    if (is_odd_h4) {
                        start_time = getTimeValue(temp_str_arr[0]);
                        let subtitle = text.replace(slide_pattern, "").replace(time_link_pattern, "");
                        arr.push({
                            chapter_id,
                            level: 0,
                            index: arr.length,
                            type: "subtitle",
                            parent: parent,
                            text: subtitle,
                            start: start_time,
                            end: types.INITIAL_ENDTIME,
                            bottom: 0,
                        });
                    }
                }
            } else if (!is_hr && node.type === "list") {
                // scene texts
                if (node.parent.type !== "item") {
                    is_odd_item = !is_odd_item;
                    if (is_odd_item) {
                        str = str
                            .replace(/<ul>/g, "")
                            .replace(/<\/ul>/g, "")
                            .replace(/\n/g, "");

                        str = str.replace(del_pattern_all, "");
                        str = str.replace(del_pattern_start, "");
                        str = str.replace(del_pattern_end, "");

                        let ind = 0,
                            level = 0;

                        while (ind < str.length) {
                            let s1 = str.indexOf("<li>", ind),
                                s2 = str.indexOf("</li>", ind);
                            if (s1 === -1) s1 = types.INITIAL_ENDTIME;
                            if (s2 === -1) s2 = types.INITIAL_ENDTIME;

                            if (s1 < s2) {
                                if (s1 !== ind) {
                                    let text = str.substring(ind, s1);
                                    arr = pushArr(arr, text, slide, level, chapter_id, parent);
                                }
                                ind = s1 + 4;
                                level++;
                            } else {
                                if (s2 !== ind) {
                                    let text = str.substring(ind, s2);
                                    arr = pushArr(arr, text, slide, level, chapter_id, parent);
                                }
                                ind = s2 + 5;
                                level--;
                            }
                        }
                    }
                }
            }
        }
        if (is_del_tag && node.type === "html_inline" && node.literal === '</del>') {
            is_del_tag = false;

            event = walker.next()
            event = walker.next()
            node = event.node;
            let str = writer.render(node);

            const temp_str_arr = str.match(time_pattern);
            if (
                temp_str_arr !== null &&
                temp_str_arr.length > 0
            ) {
                const endTime = getTimeValue(temp_str_arr[0]);

                dels[dels.length - 1].end = endTime;
            }
        }
    }

    // console.log('arr', arr);
    // console.log('dels', dels);

    // --- download notes
    let re_html_script = html_script;
    // console.log('html_script', html_script);

    // remove PRESENTER-ONLY
    let presenter_only_pattern = /<h3>(.*?)<code>PRESENTER-ONLY<\/code>(.*?)<\/h3>\n<ul[^>]*?>[\s\S]*?<\/ul>(?=(\n<h1>|\n<h2>|\n<h3>|\n<!--))/gi;
    re_html_script = re_html_script.replace(presenter_only_pattern, '');

    presenter_only_pattern = /<h3>(.*?)<code>PRESENTER-ONLY<\/code>(.*?)<\/h3>/gi;
    re_html_script = re_html_script.replace(presenter_only_pattern, '');

    const code_link_pattern = /(<code>(.*?)<\/code>)|(<a[^>]*?>\d*?<\/a>)/gi;
    re_html_script = re_html_script.replace(code_link_pattern, '');

    // <hr> is parsed to <p><a>timestamp</a></p> in case of having a timestamp like '--- [9]'    
    let p__tag_to_h2_pattern = /<p>—(.*?)<\/p>[\s\S]*?<h2>/gm;
    re_html_script = re_html_script.replace(p__tag_to_h2_pattern, '<h2>');
    re_html_script = re_html_script.replace(p__tag_pattern, '');

    re_html_script = re_html_script.replace(/<p>/g, '').replace(/<\/p>/g, '');

    // ~~ strikethrough
    let new_str = '', start_ind = 0;
    while (1) {
        const indexOf = start_ind + re_html_script.substring(start_ind).search(/~~[\s\S]*?~~/gm);
        if (indexOf > start_ind) {
            const ind1 = indexOf + 2 + re_html_script.substring(indexOf + 2).search(/~~/gm);
            new_str += re_html_script.substring(start_ind, indexOf) + '<strike>' + re_html_script.substring(indexOf + 2, ind1) + '</strike>';
            start_ind = ind1 + 2;
        } else {
            new_str += re_html_script.substring(start_ind);
            break;
        }
    }
    re_html_script = new_str;

    // add style text and title to head part
    const head_pattern = /<\/head>/ig;
    const head_end_position = html_script.search(head_pattern);
    const head_part_str = `<!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />\n`;
    if (head_end_position > 0) {
        re_html_script = `${head_part_str}\n\t<title>${project_title}</title>\n\t<style>\n${style_text}\n</style>\n${re_html_script.slice(head_end_position)}`;
    }

    if (head_pattern.test(re_html_script) === true) {
        re_html_script = re_html_script.slice(0, head_pattern.lastIndex) + `<body>\n\t<div id="content">\n` + re_html_script.slice(head_pattern.lastIndex);
    }
    return [arr, dels, re_html_script];
}

export const getPlaylists = async (videourl, videotype) => {
    // "mp4", "m3u8", "youtube", or "bunny"
    let m3u8_res, playlists = [];
    switch (videotype) {
        case 'mp4':
            break;
        case 'm3u8':
            m3u8_res = await readM3u8File(videourl);
            videourl = m3u8_res[0];
            playlists = m3u8_res[3];
            return [m3u8_res[0], m3u8_res[3]];
        case 'youtube':
            break;
        default:
            // bunny
            // attach play_720p.mp4
            const _videourl = videourl.replace(/\/$/, '');
            m3u8_res = await readM3u8File(`${_videourl}/playlist.m3u8`);
            videourl = m3u8_res[1];
            playlists = m3u8_res[3].filter(item => item.attributes.RESOLUTION.height < types.LIMIT_RESOLUTION_MP4);
            break;
    }
    return [videourl, playlists];
}

// checking existence of file synchronously.
export function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    return xhr.status !== 404;
}
