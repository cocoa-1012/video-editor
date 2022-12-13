// import { performance } from 'perf_hooks';
import * as types from '../constants';
import { fabric } from "fabric";
import { AddTextBreaks } from './add-text-breaks';
import { handleScene } from './handle-scene';

import { gsap, Linear } from 'gsap/all';


const rotateScene = (is_thumbnail, is_animation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles, is_right, is_videoend) => {

    let _img = document.getElementById('animationImg')

    if (_img !== null) {
        _img.onload = function () {
            _img.style.width = `${playerw}px`;
            _img.style.height = `${playerw * 9 / 16}px`;
            _img.style.display = 'block';

            // console.timeEnd("_img_load");
            // console.time("animation");
            if (is_videoend) {
                // console.log('videoend   ---');
                gsap.set('#animationImg', {
                    css: {
                        rotationY: 0,
                        transformOrigin: `50% 50% -${playerw / 2}`
                    }
                });
                gsap.set(".canvas-container", {
                    css: {
                        opacity: 0,
                    }
                });

                gsap.to('#animationImg', {

                    // z: 0.1,
                    // rotationZ: 0.01,
                    // force3D: true,

                    duration: types.ROTATE_ANIMATION_DURATION,
                    rotationY: is_right ? -90 : 90,
                    onComplete: function () {
                        _img.src = '';
                        _img.style.display = 'none';
                        _img.style.width = 0;
                        _img.style.height = 0;

                        rotated = true;

                        gsap.set(".canvas-container", {
                            css: {
                                backgroundColor: 'white',
                                opacity: 1,
                            }
                        });
                    }
                });
            } else {
                gsap.set('#animationImg', {
                    css: {
                        rotationY: 0,
                        transformOrigin: `50% 50% -${playerw / 2}`
                    }
                });

                gsap.set(".canvas-container", {
                    css: {
                        rotationY: is_right ? 90 : -90,
                        transformOrigin: `50% 50% -${playerw / 2}`
                    }
                });

                gsap.to('#animationImg', {
                    // z: 0.1,
                    // rotationZ: 0.01,
                    // force3D: true,

                    ease: Linear.easeNone,
                    rotationY: is_right ? - 90 : 90,
                    duration: types.ROTATE_ANIMATION_DURATION,
                    onStart: function () {
                        _loadMdText(is_thumbnail, false, false, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles);
                    },
                    onComplete: function () {
                        // console.timeEnd("animation");
                        _img.src = '';
                        _img.style.display = 'none';
                        _img.style.width = 0;
                        _img.style.height = 0;

                        rotated = true;
                    },
                });

                gsap.to(".canvas-container", {

                    // z: 0.1,
                    // rotationZ: 0.01,
                    // force3D: true,
                    // delay: 0.1,

                    ease: Linear.easeNone,
                    rotationY: 0,
                    duration: types.ROTATE_ANIMATION_DURATION,
                });
            }
        }
        // console.time("_img_load");
        let sCanvas = document.getElementById('sCanvas');
        _img.src = sCanvas.toDataURL('image/webp', 0.2);
    }
}
export const removeObjectsFromCanvas = (fab_canvas, arr_script, currentTime, isAllRemoved) => {
    fab_canvas.getObjects().forEach((obj) => {
        if (
            obj.id.indexOf("animation-") > -1 ||
            obj.id.indexOf("title-") > -1 ||
            obj.id.indexOf("text-") > -1 ||
            obj.id.indexOf("tri-") > -1
        ) {

            if (isAllRemoved)
                fab_canvas.remove(obj);
            else {
                const ind = obj.id.substring(obj.id.indexOf("-") + 1) * 1;
                const line = arr_script[ind];
                if (
                    (line.start < currentTime && line.end <= currentTime) ||
                    (line.start > currentTime && line.end >= currentTime)
                )
                    fab_canvas.remove(obj);
            }
        }
    });
}

const ConvertHexToString = (str) => {
    return unescape(str.replace(/\\/g, "%"));
}

var getTextHeight = function (font, fontsize) {
    var text = document.createElement('span');
    text.textContent = "Hg";
    text.style.fontSize = `${fontsize}px`;
    text.style.fontFamily = font;

    var block = document.createElement('div');
    block.style.display = 'inline-block';
    block.style.width = '1px';
    block.style.height = '0';

    var div = document.createElement('div');
    div.append(text, block);

    var body = document.body;
    body.append(div);

    try {
        var result = {};
        block.style.verticalAlign = 'baseline';
        result.ascent = block.offsetTop - text.offsetTop;

        block.style.verticalAlign = 'bottom';
        result.height = block.offsetTop - text.offsetTop;
        result.descent = result.height - result.ascent;
    } finally {
        div.remove();
    }
    return result.height;
};

const adjustFontSize = (arr_script, i, titlesize, contentsize, fab_md_scene, styles, title_height = 0) => {
    let parent_index = arr_script[i].parent;
    let texts;
    if (title_height === 0) {
        [texts] =
            AddTextBreaks(
                arr_script[i].text,
                fab_md_scene.get("width") * 0.95,
                titlesize,
                styles,
            );
        const _textheight = getTextHeight(styles.fontfamily, titlesize); //(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
        title_height = types.DIMENSIONS.H2 + _textheight * texts.length;
        if (i === arr_script.length - 1)
            return [titlesize, contentsize];
        parent_index = arr_script[i].index;
    }
    let max_i = i + 1, max_length = 0;
    arr_script.forEach((item, i) => {
        if (item.parent === parent_index) {
            if (item.text.length > max_length) {
                max_length = item.text.length;
                max_i = i;
            }
        }
    })
    const line = arr_script[max_i]

    let first_content_height = 0;
    if (line.type === 'text') {
        const indentText = contentsize * (line.level + 0.325);
        [texts] = AddTextBreaks(
            line.text,
            fab_md_scene.get("width") - contentsize * 2 - indentText,
            contentsize,
            styles
        );
        const _textheight = getTextHeight(styles.fontfamily, contentsize); //(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)

        first_content_height = types.DIMENSIONS.H1 * (types.DIMENSIONS.HEIGHT_GAP_RATE - line.level * 0.17) +
            _textheight * texts.length;
    }
    if (title_height + first_content_height > fab_md_scene.get("height")) {
        const ratio = Math.sqrt((fab_md_scene.get("height") - types.DIMENSIONS.H2 * 5) / (title_height + first_content_height));
        return [titlesize * ratio, contentsize * ratio]
    }
    return [titlesize, contentsize];
}

const checkSpecialTags = (t_font_style, t_font_weight, t_linethrough, words, ii, cnt, texts, last_text_length) => {
    if (words.substring(ii, ii + 4) === '<em>') {
        t_font_style = 'italic';
        ii += 4;
    }
    if (words.substring(ii, ii + 8) === '<strong>') {
        t_font_weight = 'bold';
        ii += 8;
    }
    if (words.substring(ii, ii + 2) === '~~') {
        t_linethrough = !t_linethrough;
        ii += 2;
    }
    if (words.substring(ii, ii + 9) === '</strong>') {
        t_font_weight = '';
        ii += 9;
    }
    if (words.substring(ii, ii + 5) === '</em>') {
        t_font_style = '';
        ii += 5;
    }

    // console.log('texts.substring(last_text_length + ii)', last_text_length, ii, texts.substring(last_text_length + ii))
    let link_url = '', link_text = '';

    // if (texts.substring(last_text_length + ii, last_text_length + ii + 3) === ' as') {
    //     link_url = ''
    // }


    if (texts.substring(last_text_length + ii, last_text_length + ii + 3) === '<a ') {
        let general_link_pattern = /<a( |\n)href="(.*?)">([\s\S]*?)<\/a>/;
        const links = texts.substring(last_text_length + ii).match(general_link_pattern);
        if (links !== null && links.length > 0) {
            link_text = links[3];
            link_url = links[2];
            ii += links[0].length;
            if (links[0].indexOf('\n') < 0) {
                ii--;
            }
        }
    }

    return [t_font_style, t_font_weight, t_linethrough, ii, link_text, link_url];
}

const getJII = (lines, curr_text_length, j) => {
    let _sum = 0;
    while (j <= lines.length) {
        _sum = lines.slice(0, j).reduce((prev, curr) => { return prev + (curr.length) + 1 }, 0);
        if (_sum > curr_text_length) break;
        j++;
    }
    if (j > lines.length) j = lines.length;
    return [j - 1, lines[j - 1].length - (_sum - curr_text_length)];
}

const createLinkButton = (fab_canvas, word, link_text, link_url, config_text, initial_left, initial_top, spancolor, player_bg_color, font_style, font_weight, linethrough, isAnim = false, _delay = 0, is_timeline = true) => {
    let first_fill = "rgba(255,255,255,0)", last_fill = spancolor, last_backgroundColor = player_bg_color;
    if (link_text !== '') {
        word = link_text.replace(/\s$/, '') + ` ` + ConvertHexToString(`\\u2197`) + ` `; //⮵`;
        last_fill = player_bg_color;
        last_backgroundColor = spancolor;
    }

    let words = word.split('\n');
    let textobj = null, textobjs = [];
    const _duration = 5 / 12;

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let top_pos = textobj === null ? initial_top : textobj.get("top") + textobj.get("height");
        let left_pos = textobj === null ? initial_left : config_text.left;

        if (isAnim && !is_timeline) left_pos -= types.DIFFERENCE_LEFT;
        // console.log('word', word, isAnim, first_fill, last_fill);
        textobj = new fabric.Text(word, {
            ...config_text,
            evented: types.FABRIC_OBJECT_SELECTABLE,
            left: left_pos,
            top: top_pos,
            scaleX: link_text !== '' ? 1 : isAnim ? 5 : 1,
            scaleY: link_text !== '' ? 1 : isAnim ? 5 : 1,
            fill: link_text !== '' ? last_fill : isAnim ? first_fill : last_fill,
            backgroundColor: isAnim ? 'transparent' : link_text === '' ? 'transparent' : last_backgroundColor,
            fontStyle: font_style,
            fontWeight: font_weight,
            linethrough: linethrough
        });

        if (word === '') continue;
        if (isAnim) {
            gsap.to(textobj, {
                ease: Linear.easeNone,
                scaleX: 1,
                scaleY: 1,
                fill: last_fill,
                backgroundColor: 'transparent',
                left: isAnim && !is_timeline ? left_pos + types.DIFFERENCE_LEFT : left_pos,
                top: top_pos,
                delay: _delay, // (cnt + curr_text_length + ani_chars - text_length) / text_length,
                duration: _duration,
                onComplete: function () {
                }
            });
        }
        is_timeline = true;
        textobjs.push(textobj);
    }

    if (link_text !== '') {
        const to = setTimeout(() => {
            textobjs.map(obj => {
                obj.on('mouseup', function () {
                    window.open(link_url, '_blank');
                })
                obj.set('backgroundColor', last_backgroundColor);
                obj.set('fill', last_fill);
                obj.set('evented', true);
                return obj;
            })
            clearTimeout(to);
        }, (_duration) * 1000);
    }
    return textobjs;
}

// let textanimated = true;
const _loadMdText = (is_thumbnail, presenter_refresh, is_animation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles) => {
    let titlesize = types.FONTSIZES.TITLE * fontpercent / 100;
    let contentsize = types.FONTSIZES.CONTENT * fontpercent / 100;
    removeObjectsFromCanvas(fab_canvas, arr_script, currentTime, presenter_refresh);

    const canvas_ = document.createElement("canvas");
    let context = canvas_.getContext("2d");
    let isExistTimestamp = false;

    let font_style = '', font_weight = '', linethrough = false;
    arr_script.filter(line =>
        line.slide !== types.SLIDETYPES.VIDEOEND &&
        (line.type === 'title' || line.type === 'subtitle' || line.type === 'text' || line.type === 'img') &&
        currentTime < line.end &&
        currentTime >= line.start
    ).forEach((line) => {
        isExistTimestamp = true;
        const i = line.index;
        const isTitle = line.type === "title";
        const isSubTitle = line.type === "subtitle";
        const isText = line.type === "text";
        const isImg = line.type === "img";

        let id = '';
        if (isTitle) id = "title-" + i;
        else if (isSubTitle) {
            id = "subtitle-" + i;
        }
        else if (isText) id = "text-" + i;
        else if (isImg) id = "img-" + i;

        if (fab_canvas.getObjects().filter((obj) => obj.id === id).length === 0) {
            let is_past_text = true;
            if (currentTime <= line.start + 1)
                is_past_text = false;
            let config_text, texts = [], text_widths = [];
            let initial_top = 0;

            if (isTitle) {
                handleScene(is_thumbnail, currentTime, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerscale, videowidth, videoheight, line.slide, line.isLeft);
                // console.log('handleScene', is_thumbnail, line.slide, types.FABRIC_HIDDEN_OBJ_COUNT);
                // console.log('fab_canvas.getObjects()', fab_canvas.getObjects())

                fab_canvas.getObjects().forEach((obj) => {
                    obj.id.indexOf("img-") > -1 && fab_canvas.remove(obj);
                    obj.id.indexOf("text-") > -1 && fab_canvas.remove(obj);
                    obj.id.indexOf("tri-") > -1 && fab_canvas.remove(obj);
                });

                if (line.slide !== types.SLIDETYPES.PRESENTERONLY) {
                    [titlesize, contentsize] = adjustFontSize(arr_script, i, titlesize, contentsize, fab_md_scene, styles, 0);
                    [texts, text_widths] =
                        AddTextBreaks(
                            line.text,
                            fab_md_scene.get("width") * 0.95,
                            titlesize,
                            styles,
                        );
                }
                else {
                    texts = [' '];
                    text_widths = [1];
                }

                initial_top = (types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + types.DIMENSIONS.H2);
                if (line.slide === types.SLIDETYPES.TITLEONLY) {
                    const _textheight = getTextHeight(styles.fontfamily, titlesize);
                    initial_top = fab_md_scene.get("top") + (fab_md_scene.get("height") - _textheight * texts.length * 0.9) / 2;
                }

                config_text =
                {
                    id: id,
                    selectable: types.FABRIC_OBJECT_SELECTABLE,
                    evented: types.FABRIC_OBJECT_SELECTABLE,
                    left: fab_md_scene.get("left"), // + fab_md_scene.get("width") / 2,
                    top: initial_top,
                    fill: styles.title_color,
                    originX: "left",
                    originY: "top",
                    width: fab_md_scene.get("width") * 0.95,
                    textAlign: "center",
                    fontSize: titlesize,
                    fontFamily: styles.fontfamily,
                }
                line.fontsize = titlesize;
            } else if (isSubTitle || isText) {
                //subtitle or list(text)
                fab_canvas.getObjects().forEach((obj) => {
                    obj.id.indexOf("img-") > -1 && fab_canvas.remove(obj);
                });

                let past_idx = i - 1;
                for (let l = i - 1; l >= 0; l--) {
                    if (arr_script[l].type === 'title' || arr_script[l].type === 'subtitle' || arr_script[l].type === 'text') {
                        past_idx = l;
                        break;
                    }
                }
                let lastBottom = arr_script[past_idx].bottom;

                initial_top = lastBottom + types.DIMENSIONS.H1 * (types.DIMENSIONS.HEIGHT_GAP_RATE - line.level * 0.17);

                if (arr_script[past_idx].type === 'title') {
                    [titlesize, contentsize] = adjustFontSize(arr_script, i, titlesize, contentsize, fab_md_scene, styles, initial_top);
                    line.fontsize = contentsize;
                } else {
                    contentsize = arr_script[past_idx].fontsize;
                    line.fontsize = contentsize;
                }

                const indentText = contentsize * (line.level + 0.325);
                [texts, text_widths] =
                    AddTextBreaks(
                        line.text,
                        fab_md_scene.get("width") - contentsize * 2 - indentText,
                        contentsize,
                        styles
                    );


                const _textheight = getTextHeight(styles.fontfamily, contentsize); //(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)

                // console.log('initial_top', initial_top, fontHeight, texts.length, fab_md_scene.get("top"), fab_md_scene.get("height"));
                if (initial_top + _textheight * texts.length > fab_md_scene.get("top") + fab_md_scene.get("height")) {
                    initial_top = (types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + types.DIMENSIONS.H2);
                    fab_md_scene.moveTo(fab_canvas.getObjects().length);

                    fab_canvas._objects.filter(obj => obj.id === `title-${line.parent}`).forEach(obj => {
                        obj.moveTo(fab_canvas.getObjects().length);
                        initial_top = arr_script[line.parent].bottom + 10;
                    })
                }

                let fill_color;
                if (isText) fill_color = styles.content_color;
                if (isSubTitle) fill_color = styles.title_color;
                config_text =
                {
                    id: id,
                    selectable: types.FABRIC_OBJECT_SELECTABLE,
                    evented: types.FABRIC_OBJECT_SELECTABLE,
                    left: fab_md_scene.get("left") + indentText,
                    fill: fill_color,
                    originX: "left",
                    originY: "top",
                    // width: fab_md_scene.get("width") - contentsize * 2 - indentText,
                    textAlign: "left",
                    fontSize: contentsize,
                    fontFamily: styles.fontfamily,
                    scaleX: 3,
                    scaleY: 3,
                }
                if (isText) {
                    const config_tri = {
                        id: "tri-" + i,
                        selectable: types.FABRIC_OBJECT_SELECTABLE,
                        evented: types.FABRIC_OBJECT_SELECTABLE,
                        left: fab_md_scene.get("left") + contentsize * .3 + contentsize * (line.level - 1),
                        top: initial_top,
                        angle: 0,
                        width: contentsize * 0.65,
                        originX: "left",
                        originY: "top",
                        fontSize: contentsize,
                        fill: styles.bullet_color,
                        content: styles.bullet_content,
                    };
                    fab_canvas.add(new fabric.Text(ConvertHexToString(`\\u${styles.bullet_content}`), config_tri));
                }
            } else if (isImg) {
                // img
                const imgtag = document.getElementById(id);
                const _scalew = fab_md_scene.get("width") / imgtag.width;
                const _scaleh = fab_md_scene.get("height") / imgtag.height;
                let _scale;
                if (_scalew > _scaleh) _scale = _scaleh;
                else _scale = _scalew;

                let _fab_md_scence = fabric.util.object.clone(fab_md_scene);
                _fab_md_scence.set("id", id);

                let _fab_img = new fabric.Image(imgtag, {
                    id,
                    selectable: types.FABRIC_OBJECT_SELECTABLE,
                    evented: types.FABRIC_OBJECT_SELECTABLE,
                    left: fab_md_scene.get("left") + fab_md_scene.get("width") / 2,
                    top: fab_md_scene.get("top") + fab_md_scene.get("height") / 2,
                    originX: 'center',
                    originY: 'center',

                    scaleX: _scale,
                    scaleY: _scale,

                    width: imgtag.width,
                    height: imgtag.height,
                    opacity: 0.75,
                });
                gsap.to(_fab_img, {
                    ease: Linear.easeNone,
                    duration: 0.5,
                    opacity: 1,
                });
                fab_canvas.add(_fab_md_scence, _fab_img);
            }
            if ((isTitle || isSubTitle || isText) && currentTime !== 0) {
                // if (textanimated) {
                let textobj = null;
                let curr_text_length = 0, last_text_length = 0;
                // console.log('config_text', config_text);
                let lines = texts;

                if (isTitle && line.slide === types.SLIDETYPES.PRESENTERONLY) {
                    texts = [' '];
                    lines = [' '];
                }
                let strs = texts.join('\n');
                let text_length = strs.length;

                let ani_chars = types.ANIMATION_CHARACTERS;

                if (ani_chars > text_length)
                    ani_chars = text_length;

                // let is_connected_href_with_line_break = false;
                // var startTime = performance.now()
                for (let j = 0; j < lines.length; j++) {
                    let ind = 0, ii = 0;
                    if (curr_text_length > 0) {
                        [j, ii] = getJII(lines, curr_text_length, j);
                    }

                    let words = lines[j];
                    // words = words.replace(/<em> /gm, '<em>').replace(/<\/em>/gm, '</em>').replace(/<strong> /gm, '<strong>').replace(/<\/strong> /gm, '</strong>').replace(/ ~~ /gm, '~~').replace(/~~ /gm, '~~')
                    let top_pos = textobj === null ? initial_top : ii > 0 ? textobj.get("top") : textobj.get("top") + textobj.get("height");

                    let lPos = config_text.left;
                    context.font = config_text.fontSize + "px " + styles.fontfamily; //Helvetica Neue, Helvetica, Sans-Serif, Arial, Trebuchet MS";                                               
                    let spancolor = styles.content_color

                    if (isTitle) {
                        lPos = fab_md_scene.get('left') + (fab_md_scene.get('width') - text_widths[j]) / 2;
                        spancolor = styles.title_color;
                    }
                    if (isSubTitle)
                        spancolor = styles.title_color;

                    let is_timeline = true;

                    if (ii <= 0)
                        textobj = null;
                    // is_connected_href_with_line_break = false;
                    // console.log('spancolor', spancolor)

                    if (is_past_text || words.length + curr_text_length + ani_chars <= text_length) {
                        if (curr_text_length > 0) {
                            [, ii] = getJII(lines, curr_text_length, j);
                            ind = ii;
                        }
                        let cnt = 0;
                        for (; ii <= words.length; ii++) {
                            const initial_ii = ii;
                            let t_font_style = font_style,
                                t_font_weight = font_weight,
                                t_linethrough = linethrough,
                                link_text,
                                link_url;

                            [t_font_style, t_font_weight, t_linethrough, ii, link_text, link_url] = checkSpecialTags(t_font_style, t_font_weight, t_linethrough, words, ii, cnt, strs, last_text_length);

                            if (link_text !== '') {
                                // ii++;
                                // if (ii > words.length)
                                //     is_connected_href_with_line_break = true;
                            }

                            if (ii > initial_ii || ii >= words.length) {
                                // console.log('words.substring(ind, initial_ii)', words.substring(ind, initial_ii))
                                let left_pos = textobj === null ? lPos : textobj.get("left") + textobj.get("width");
                                let dis_text = words.substring(ind, initial_ii);
                                // if (link_text !== '') dis_text = link_text;
                                textobj = new fabric.Text(dis_text, {
                                    ...config_text,
                                    left: left_pos,
                                    top: top_pos,
                                    scaleX: 1,
                                    scaleY: 1,
                                    fill: spancolor,
                                    fontStyle: font_style,
                                    fontWeight: font_weight,
                                    linethrough: linethrough
                                });
                                fab_canvas.add(textobj);

                                if (link_text !== '') {
                                    left_pos = textobj.get("left") + textobj.get("width")
                                    let textobjs = createLinkButton(fab_canvas, '', link_text, link_url, config_text, left_pos, top_pos, spancolor, styles.player_bg_color, font_style, font_weight, linethrough);
                                    fab_canvas.add(...textobjs);
                                    textobj = textobjs[textobjs.length - 1];
                                }

                                font_style = t_font_style;
                                font_weight = t_font_weight;
                                linethrough = t_linethrough;
                                ind = ii + 1;
                            }
                            if (ii >= words.length) break;
                            cnt++;
                        }
                        curr_text_length = ii - words.length;
                    }
                    else {
                        let cnt = 0;
                        if (curr_text_length > 0)
                            [, ii] = getJII(lines, curr_text_length, j);
                        for (; ii < words.length; ii++) {
                            let link_text,
                                link_url;
                            if (words[ii] === '<') {
                                // ii = ii;
                            }
                            [font_style, font_weight, linethrough, ii, link_text, link_url] = checkSpecialTags(font_style, font_weight, linethrough, words, ii, cnt, strs, last_text_length);
                            let word = words[ii];
                            if (link_text !== '') {
                                // word = word;
                            }
                            if (link_text !== '' || word !== undefined) {
                                // if (ii < words.length) {
                                if (is_past_text || ii + last_text_length + ani_chars <= text_length) {
                                    const left_pos = textobj === null ? lPos : textobj.get("left") + textobj.get("width");

                                    let textobjs = createLinkButton(fab_canvas, word, link_text, link_url, config_text, left_pos, top_pos, spancolor, styles.player_bg_color, font_style, font_weight, linethrough);
                                    fab_canvas.add(...textobjs);
                                    textobj = textobjs[textobjs.length - 1];
                                    // console.log('left_pos1', left_pos);
                                    // is_timeline = false;
                                } else if (ii + last_text_length + ani_chars > text_length) {
                                    let left_pos = textobj === null ? lPos : textobj.get("left") + textobj.get("width");
                                    // if (!is_timeline) left_pos -= types.DIFFERENCE_LEFT;

                                    const _delay = (cnt + curr_text_length + ani_chars - text_length) / text_length;
                                    let textobjs = createLinkButton(fab_canvas, word, link_text, link_url, config_text, left_pos, top_pos, spancolor, styles.player_bg_color, font_style, font_weight, linethrough, true, _delay, is_timeline);
                                    fab_canvas.add(...textobjs);
                                    textobj = textobjs[textobjs.length - 1];

                                    is_timeline = true;
                                }
                            }
                            // if (ii > words.length && link_text !== '')
                            //     is_connected_href_with_line_break = true;
                            // }
                            if (ii >= words.length) break;
                            cnt++;
                        }
                        curr_text_length = ii - words.length;
                    }

                    const _sum = lines.slice(0, j + 1).reduce((prev, curr) => { return prev + curr.length + 1 }, 0);
                    last_text_length = _sum;
                    curr_text_length += _sum;
                }
                // var endTime = performance.now()
                // console.log(`${startTime}, ${endTime}, ${endTime - startTime} milliseconds`)

                if (textobj !== null)
                    line.bottom = textobj.get("top") + textobj.get("height");
            }
        }
    })
    if (!isExistTimestamp) {
        handleScene(is_thumbnail, currentTime, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerscale, videowidth, videoheight, types.SLIDETYPES.PRESENTERONLY, false);
        // console.log('handleScene PRESENTERONLY', is_thumbnail, types.FABRIC_HIDDEN_OBJ_COUNT);
        // console.log(fab_canvas.getObjects());

    }
    // console.log('arr_script', arr_script);
    return arr_script;
};

let rotated = true;
export const loadMdText = (is_thumbnail, presenter_refresh, is_animation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles) => {
    //animation between 2 scenes
    if (is_animation && rotated) {
        const filter_arr = arr_script.filter(line =>
            line.type === "title" &&
            line.is_animation === true &&
            currentTime >= line.start &&
            currentTime < line.start + types.INTERVAL * 2 / 1000
        );
        if (filter_arr.length > 0) {
            rotated = false;
            console.time("rotate");
            rotateScene(is_thumbnail, is_animation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles, !filter_arr[0].isLeft, filter_arr[0].slide === types.SLIDETYPES.VIDEOEND);
            console.timeEnd("rotate");
            return arr_script;
        }
    }
    if (rotated || currentTime === 0) {
        // console.time("_loadMdText");
        _loadMdText(is_thumbnail, presenter_refresh, is_animation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerw, currentTime, arr_script, playerscale, videowidth, videoheight, fontpercent, styles);
        // console.timeEnd("_loadMdText");
    }
    return arr_script;
};