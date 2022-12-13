import * as types from '../constants';
import { AddTextBreaks } from './add-text-breaks';
import { truncateString } from './global-functions'
import { fabric } from "fabric";

export const addVideoToCanvas = (fab_canvas, videotag, styles, project_title, CanvasCapture) => {
    let texts;
    [texts] = AddTextBreaks(
        project_title,
        types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3,
        types.FONTSIZES.PROJECT,
        styles
    );
    let text = texts.slice(0, 1).join('\n');
    const _fab_project_title = new fabric.Text(text, {
        id: "project_title",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W1 + types.DIMENSIONS.W2 + types.DIMENSIONS.W3,
        top: -(types.DIMENSIONS.H1 + types.DIMENSIONS.H2) + types.DIMENSIONS.ORIGINALHEIGHT,
        fill: "#2a3238",
        originX: "right",
        originY: "bottom",
        width: types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3,
        textAlign: "right",
        fontSize: types.FONTSIZES.PROJECT,
        fontFamily: styles.fontfamily,
        opacity: 0,
    });

    let _fab_video = new fabric.Image(videotag, {
        id: "video",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: 100,
        top: 0,
        originX: 0,
        originY: 'center',

        width: 1,
        height: 1,
        objectCaching: true,
        statefullCache: true,
        // preserveObjectStacking: true,
    });

    let _fab_md_scene = new fabric.Rect({
        id: "layout-md",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: 0,
        top: types.DIMENSIONS.H1 + types.DIMENSIONS.H2,
        width: 0,
        height: types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT,
        fill: styles.content_bg_color,
    });
    fab_canvas.add(_fab_project_title, _fab_video, _fab_md_scene);
    _fab_video.moveTo(0);
    _fab_md_scene.moveTo(1);

    return [fab_canvas, _fab_video, _fab_md_scene];
}

const resizeImage = (maxSize, imageUrl) => {
    return new Promise((resolve) => {
        let image = new Image();
        image.src = imageUrl;
        image.crossOrigin = 'anonymous';
        image.onload = (img) => {
            //check if resizing is required
            if (Math.max(img.target.width, img.target.height) > maxSize) {
                //create canvas
                let canvas = document.createElement("canvas");
                //scale image
                if (img.target.height >= img.target.width) {
                    canvas.height = maxSize;
                    canvas.width = (maxSize / img.target.height) * img.target.width;
                } else {
                    canvas.width = maxSize;
                    canvas.height = (maxSize / img.target.width) * img.target.height;
                }
                //draw to canvas
                let context = canvas.getContext("2d");
                context.drawImage(img.target, 0, 0, canvas.width, canvas.height);
                //assign new image url
                resolve(context.canvas.toDataURL());
            }
            resolve(imageUrl);
        };
    });
};

export const addThumbnailToCanvas = async (fab_canvas, thumburl, project_title, project_title_h2, author, description, video_details, styles) => {
    //resize if needed
    let imageUrl = await resizeImage(1280, thumburl);

    let imgtag = document.createElement('img');
    imgtag.crossOrigin = 'anonymous';
    imgtag.src = imageUrl;

    let fab_thumb_0 = new fabric.Rect({
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.DIMENSIONS.W1 + types.DIMENSIONS.W2,
        top: types.DIMENSIONS.H1 + types.DIMENSIONS.H2,
        width: types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1,
        height: types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT,
        fill: styles.content_bg_color,
    });

    // add h1, h2 to thumbnail
    let texts;
    [texts] = AddTextBreaks(
        project_title,
        types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 - types.THUMBNAIL.LEFT_POS,
        types.THUMBNAIL.H1_SIZE,
        styles);

    let text = truncateString(texts.slice(0, 2).join('\n'), 40)

    const fab_thumb_2 = new fabric.Text(text, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.H1_TOP,
        fontSize: types.THUMBNAIL.H1_SIZE,
        fontFamily: styles.fontfamily,
        // fontWeight: 'bold',
        fill: styles.title_color,
    });

    [texts] = AddTextBreaks(
        description, // project_title_h2,
        types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 - types.THUMBNAIL.LEFT_POS,
        types.THUMBNAIL.H2_SIZE,
        styles);
    text = truncateString(texts.slice(0, 3).join('\n'), 160)

    const fab_thumb_3 = new fabric.Text(text, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.H2_TOP,
        fontSize: types.THUMBNAIL.H2_SIZE,
        fontFamily: styles.fontfamily,
        fill: styles.content_color,
    });

    const fab_thumb_4 = new fabric.Text(types.THUMBNAIL.AUTHOR, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.AUTHOR_TOP1,
        fontSize: types.THUMBNAIL.AUTHOR_VD_SIZE1,
        fontFamily: styles.fontfamily,
        fill: styles.title_color,
    });


    [texts] = AddTextBreaks(
        author, // project_title_h2,
        types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 - types.THUMBNAIL.LEFT_POS,
        types.THUMBNAIL.H2_SIZE,
        styles);
    text = truncateString(texts.slice(0, 2).join('\n'), 60)
    const fab_thumb_5 = new fabric.Text(text, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.AUTHOR_TOP2,
        fontSize: types.THUMBNAIL.AUTHOR_VD_SIZE2,
        fontFamily: styles.fontfamily,
        fill: styles.content_color,
    });

    const fab_thumb_6 = new fabric.Text(types.THUMBNAIL.VIDEO_DETAILS, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.VIDEO_DETAILS_TOP1,
        fontSize: types.THUMBNAIL.AUTHOR_VD_SIZE1,
        fontFamily: styles.fontfamily,
        fill: styles.title_color,
    });
    const fab_thumb_7 = new fabric.Text(video_details, {
        id: "thumbnail",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.VIDEO_DETAILS_TOP2,
        fontSize: types.THUMBNAIL.AUTHOR_VD_SIZE2,
        fontFamily: styles.fontfamily,
        fill: styles.content_color,
    });
    const fab_thumb_8 = new fabric.Text(types.THUMBNAIL.NOT_USING_NURO_YET, {
        id: "not_using_nuro_yet",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: true,
        left: types.THUMBNAIL.LEFT_POS,
        top: types.THUMBNAIL.NOT_USING_NURO_YET_TOP,
        fontSize: types.THUMBNAIL.AUTHOR_VD_SIZE2,
        fontFamily: styles.fontfamily,
        fill: styles.title_color,
    });


    fab_canvas.add(fab_thumb_0, fab_thumb_2, fab_thumb_3, fab_thumb_4, fab_thumb_5, fab_thumb_6, fab_thumb_7, fab_thumb_8);

    imgtag.onload = function () {

        const imgwidth = this.width;
        const imgheight = this.height;
        const currentwidth = (types.DIMENSIONS.ORIGINALWIDTH) * types.DIMENSIONS.WIDTH_PERCENT2; //* types.DIMENSIONS.WIDTH_PERCENT1;
        const currentheight = (types.DIMENSIONS.ORIGINALHEIGHT) * types.DIMENSIONS.HEIGHT_PERCENT;
        let _scale = currentheight / imgheight;
        let fab_thumb_1;

        if (_scale * imgwidth >= currentwidth) {
            // 1280x720
            const _croppedwidth = Math.abs(imgwidth - currentwidth / _scale) / 2;
            const _croppedheight = imgheight;
            fab_thumb_1 = new fabric.Image(imgtag, {
                id: "thumbnail",
                selectable: types.FABRIC_OBJECT_SELECTABLE,
                evented: types.FABRIC_OBJECT_SELECTABLE,
                left: types.DIMENSIONS.W1 + types.DIMENSIONS.W2 + types.DIMENSIONS.W3 + types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 - (_croppedwidth) * _scale,
                top: types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + (types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT) / 2,
                originX: 0,
                originY: 'center',

                scaleX: _scale,
                scaleY: _scale,

                width: currentwidth / _scale + _croppedwidth,
                height: (imgheight),
                objectCaching: true,
                statefullCache: true,
            });

            let _original_polygon = new fabric.Polygon([
                { x: -50, y: -10 },
                { x: _croppedwidth, y: -10, },
                { x: _croppedwidth, y: _croppedheight, },
                { x: -50, y: _croppedheight },
            ]);
            let _clipping_polygon = new fabric.Polygon(_original_polygon.points, {
                left: -(fab_thumb_1.get("width") / 2) - _original_polygon.get("left") * -1 - types.DIMENSIONS.CROP_SPAN,
                top: -(fab_thumb_1.get("height") / 2) - _original_polygon.get("top") * -1 - types.DIMENSIONS.CROP_SPAN,
            });
            const _presentertext_clip_group = new fabric.Group([_clipping_polygon], { inverted: true, });
            fab_thumb_1.clipPath = _presentertext_clip_group;
        }
        else {
            let _scale = currentwidth / imgwidth;
            // const _croppedwidth = imgwidth;
            // const _croppedheight = (_scale * imgheight - currentheight * _scale) / 2;
            fab_thumb_1 = new fabric.Image(imgtag, {
                id: "thumbnail",
                selectable: types.FABRIC_OBJECT_SELECTABLE,
                evented: types.FABRIC_OBJECT_SELECTABLE,
                left: types.DIMENSIONS.W1 + types.DIMENSIONS.W2 + types.DIMENSIONS.W3 + types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1,
                top: types.DIMENSIONS.H1 + types.DIMENSIONS.H2,
                //- (_croppedheight) * _scale,
                originX: 0,
                originY: 0,

                scaleX: _scale,
                scaleY: _scale,

                width: imgwidth,
                height: currentheight / _scale, // + _croppedheight,
                objectCaching: true,
                statefullCache: true,
            });
        }
        
        var filter = new fabric.Image.filters.Blur({ blur: 0.3 });
        fab_thumb_1.filters.push(filter);
        fab_thumb_1.applyFilters();

        fab_canvas.add(fab_thumb_1);
        addPlayButton(styles, fab_canvas);
    }
    imgtag.onerror = function () {
        addPlayButton(styles, fab_canvas);
    }
};

const addPlayButton = (styles, fab_canvas) => {
    let play_config = {
        id: "play_btn",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: true,
        originX: 'center',
        originY: 'center',

        left: types.DIMENSIONS.W1 + types.DIMENSIONS.W2 + types.DIMENSIONS.W3 + types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT2 / 2,
        top: types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + (types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT) / 2,

        fontSize: types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT2 * 0.18,
        fontFamily: styles.fontfamily,
        fill: "rgba(255,255,255,0)",
        stroke: types.THUMBNAIL.PLAY_BTN_COLOR,
        strokeWidth: 3,
    }
    const fab_thumb_9 = new fabric.Text('\u25b6', {
        ...play_config,
        left: 10 + play_config.left,
        top: 5 + play_config.top,
    });
    const fab_thumb_10 = new fabric.Circle({
        ...play_config,
        radius: types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT2 * 0.15,

        centeredScaling: true,
        hasRotatingPoint: false,
    });

    play_config = {
        id: "play_btn",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: true,
        originX: 'center',
        originY: 'center',

        left: types.THUMBNAIL.LEFT_POS + types.THUMBNAIL.PLAY_WIDTH * 0.18 / 2,
        top: types.THUMBNAIL.PLAY_TOP,

        fontSize: types.THUMBNAIL.PLAY_WIDTH * 0.125,
        fontFamily: styles.fontfamily,
        fill: "rgba(255,255,255,1)",
    }
    const fab_thumb_11 = new fabric.Text('\u25b6', {
        ...play_config,
        left: 3 + play_config.left,
        top: 1 + play_config.top,
    });
    const fab_thumb_12 = new fabric.Circle({
        ...play_config,
        radius: types.THUMBNAIL.PLAY_WIDTH * 0.12,
        centeredScaling: true,
        hasRotatingPoint: false,
        fill: "#21b1ab",
    });
    const fab_thumb_13 = new fabric.Text(types.THUMBNAIL.PLAY_VIDEO, {
        ...play_config,
        left: play_config.left + types.THUMBNAIL.PLAY_WIDTH * 0.12 * 2 + 50,
        top: 1 + play_config.top,
        fontSize: types.THUMBNAIL.PLAY_WIDTH * 0.12,
        fill: styles.content_color,
    });
    fab_canvas.add(fab_thumb_9, fab_thumb_10, fab_thumb_12, fab_thumb_11, fab_thumb_13);
}

export const initCanvas = (id, w, styles) => {
    const h = w * 9 / 16;
    let fab_canvas = new fabric.Canvas(id, {
        width: w,
        height: h,
        backgroundColor: styles.player_bg_color,
        preserveObjectStacking: true,
        // defaultCursor: 'nw-resize',
        hoverCursor: 'pointer',
        renderOnAddRemove: false,        
    });

    const _conf_white_layout = {
        id: "layout-white",
        selectable: types.FABRIC_OBJECT_SELECTABLE,
        evented: types.FABRIC_OBJECT_SELECTABLE,
        originX: 'center',
        originY: 'center',
        left: w / 2,
        top: h / 2,
        width: w - types.DIMENSIONS.W1 * 2,
        height: h - types.DIMENSIONS.H1 * 2,
        fill: styles.player_border_color,
        hoverCursor: 'default'
    }
    const fab_layout_white = new fabric.Rect(_conf_white_layout);
    fab_canvas.add(fab_layout_white);
    return [fab_canvas, fab_layout_white];
};