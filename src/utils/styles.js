import { STYLE_URL } from '../constants';
export const getStyles = async (style_text, styles) => {
    let res = await fetch(STYLE_URL);
    style_text = await res.text();
    if (/<html/.test(style_text)) return [style_text, styles];

    const bodyPattern = /body[\s]*?{[\s\S]*?}/gm;
    const h3Pattern = /h3[\s]*?{[\s\S]*?}/gm;
    const contentIdPattern = /#content[\s]*?{[\s\S]*?}/gm;
    const libeforePattern = /li:before[\s]*?{[\s\S]*?}/gm;

    const bgcolorPattern = /background-color[\s]*?:(.*?);/g;
    const colorPattern = /[^background-]color[\s]*?:(.*?);/g;
    const fontPattern = /font-family[\s]*?:(.*?);/g;
    const borderPattern = /border[\s]*?:(.*?);/g;
    const contentPattern = /content[\s]*?:(.*?);/g;

    let colors, bgcolors;

    const bodys = style_text.match(bodyPattern);
    if (bodys !== null && bodys.length > 0) {
        bgcolors = bodys[0].match(bgcolorPattern);
        if (bgcolors !== null && bgcolors.length > 0) {
            styles.player_bg_color = bgcolors[0].replace(/background-color[\s]*?:/, '').replace(';', '').replace('\t', '');
        }

        colors = bodys[0].match(colorPattern);
        if (colors !== null && colors.length > 0) {
            styles.content_color = colors[0].replace(/color[\s]*?:/, '').replace(';', '').replace('\t', '');
        }
        const fonts = bodys[0].match(fontPattern);
        if (fonts !== null && fonts.length > 0) {
            styles.fontfamily = fonts[0].replace(/font-family[\s]*?:/, '').replace(';', '');
        }
    }
    const h3s = style_text.match(h3Pattern);
    if (h3s !== null && h3s.length > 0) {
        colors = h3s[0].match(colorPattern);
        if (colors !== null && colors.length > 0) {
            styles.title_color = colors[0].replace(/color[\s]*?:/, '').replace(';', '').replace('\t', '');
        }
    }
    const contents = style_text.match(contentIdPattern);
    if (contents !== null && contents.length > 0) {
        bgcolors = contents[0].match(bgcolorPattern);
        if (bgcolors !== null && bgcolors.length > 0) {
            styles.content_bg_color = bgcolors[0].replace(/background-color[\s]*?:/, '').replace(';', '').replace('\t', '');
        }

        const borders = contents[0].match(borderPattern);
        if (borders !== null && borders.length > 0) {
            styles.player_border_color = borders[0].slice(borders[0].lastIndexOf(' '))
        }
    }

    const libefores = style_text.match(libeforePattern);
    if (libefores !== null && libefores.length > 0) {
        colors = libefores[0].match(colorPattern);
        if (colors !== null && colors.length > 0) {
            styles.bullet_color = colors[0].replace(/color[\s]*?:/, '').replace(';', '').replace('\t', '');
        }

        const libeforecontents = libefores[0].match(contentPattern);
        if (libeforecontents !== null && libeforecontents.length > 0) {
            styles.bullet_content = libeforecontents[0].replace(/content[\s]*?:/, '').replace(';', '');
        }
    }
    styles.bullet_content = styles.bullet_content.trim().replace(/"/g, '').replace('\\', '');
    styles.player_border_color = styles.player_border_color.trim().replace(/;/g, '');

    return [style_text, styles];
};