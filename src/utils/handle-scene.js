import * as types from '../constants';
import { fabric } from "fabric";


const handlePresenteronly = (fab_video, fab_md_scene, fab_icon, playerscale, videowidth, videoheight) => {
    let tempScale = playerscale;

    if ((types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3) / playerscale > videowidth) {
        tempScale = (types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3) / videowidth;
    }

    const realVideoH = types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT;

    fab_video.scaleX = tempScale;
    fab_video.scaleY = tempScale;
    const ll = types.DIMENSIONS.W1 + types.DIMENSIONS.W2;
    fab_video.left = ll;
    fab_video.width = (types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3) / tempScale;

    if (fab_icon !== null && fab_icon !== '') {
        fab_icon.left = ll + types.DIMENSIONS.ORIGINALWIDTH * 0.005;
        fab_icon.top = types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + types.DIMENSIONS.ORIGINALWIDTH * 0.005;
    }

    fab_video.width = (types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + types.DIMENSIONS.W3) / tempScale;

    const hh = realVideoH / tempScale +
        Math.abs(videoheight - realVideoH / tempScale) / 3;
    fab_video.height = hh;

    const tt = (
        types.DIMENSIONS.H1 + types.DIMENSIONS.H2 - (Math.abs(videoheight - realVideoH / tempScale) * tempScale) / 3
    );

    // console.log('PRESENTERONLY', tempScale, videowidth, videoheight, hh);
    // console.log('PRESENTERONLY', realVideoH, tt, tt + hh * tempScale / 2);
    // console.log('PRESENTERONLY', realVideoH / tempScale, Math.abs(videoheight - realVideoH) / 3, Math.abs(videoheight - realVideoH / tempScale) / 3);

    fab_video.top = tt + hh * tempScale / 2

    let originalPolygon = new fabric.Polygon([
        { x: -50, y: -2 },
        { x: -50, y: (Math.abs(videoheight - realVideoH / tempScale) / 3) },
        { x: types.DIMENSIONS.ORIGINALWIDTH / tempScale + 100, y: (Math.abs(videoheight - realVideoH / tempScale) / 3), },
        { x: types.DIMENSIONS.ORIGINALWIDTH / tempScale + 100, y: -2 },
    ]);
    originalPolygon.id = "originalPolygon";
    let clippingPolygon = new fabric.Polygon(originalPolygon.points, {
        left: -(fab_video.get("width") / 2) - 2,
        top: -(fab_video.get("height") / 2) - 2,
    });
    // fab_canvas.add(originalPolygon);
    const clipG = new fabric.Group([clippingPolygon], { inverted: true, objectCaching: false });

    fab_video.clipPath = clipG;
    // fab_video.clipPath = null;
}

export const handleScene = (is_thumbnail, currentTime, fab_video, fab_md_scene, fab_icon, fab_layout_white, playerscale, videowidth, videoheight, slide, isLeft) => {
    // mode
    if (fab_video !== null && fab_md_scene !== null) {
        if (slide === types.SLIDETYPES.TEXTONLY || slide === types.SLIDETYPES.TITLEONLY) {
            fab_md_scene.left = types.DIMENSIONS.W1 + types.DIMENSIONS.W2;
            fab_md_scene.width = types.DIMENSIONS.ORIGINALWIDTH * (types.DIMENSIONS.WIDTH_PERCENT1 + types.DIMENSIONS.WIDTH_PERCENT2) + (types.DIMENSIONS.W3);
            if (!is_thumbnail) {
                fab_md_scene.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 1);
                fab_video.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT);
                if (fab_icon !== null && fab_icon !== '')
                    fab_icon.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT - 1);
            }
        }
        else if (slide === types.SLIDETYPES.PRESENTERONLY) {
            handlePresenteronly(fab_video, fab_md_scene, fab_icon, playerscale, videowidth, videoheight);
            if (!is_thumbnail) {
                if (fab_icon !== null && fab_icon !== '')
                    fab_icon.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 2);
                fab_video.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 1);
                fab_md_scene.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT);
            }
        }
        else if (slide === types.SLIDETYPES.VIDEOEND) {
        }
        else {
            // PRESENTERTEXT
            const crop_width = (videowidth - types.DIMENSIONS.ORIGINALWIDTH / playerscale * types.DIMENSIONS.WIDTH_PERCENT1) / 2;
            const initLeftPos = types.DIMENSIONS.W1 + types.DIMENSIONS.W2 - crop_width * playerscale;


            // console.log("initLeftPos", initLeftPos);
            fab_video.top = (types.DIMENSIONS.H1 + types.DIMENSIONS.H2) + (types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT) / 2;

            const ll = isLeft ? initLeftPos : initLeftPos + (types.DIMENSIONS.W3) + types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT2;
            fab_video.left = ll;
            fab_video.width = (types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1) / playerscale + crop_width;
            fab_video.height = (types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT) / playerscale;
            fab_video.scaleX = playerscale;
            fab_video.scaleY = playerscale;

            if (fab_icon !== null && fab_icon !== '') {
                // console.log('ll', ll, types.DIMENSIONS.ORIGINALWIDTH * 0.005)
                fab_icon.left = ll + crop_width * playerscale + types.DIMENSIONS.ORIGINALWIDTH * 0.005;
                fab_icon.top = types.DIMENSIONS.H1 + types.DIMENSIONS.H2 + types.DIMENSIONS.ORIGINALWIDTH * 0.005;
            }

            const _croppedwidth = (videowidth - types.DIMENSIONS.ORIGINALWIDTH / playerscale * types.DIMENSIONS.WIDTH_PERCENT1) / 2;
            const _croppedheight = types.DIMENSIONS.ORIGINALHEIGHT / playerscale;

            let _original_polygon = new fabric.Polygon([
                { x: -50, y: -10 },
                { x: _croppedwidth, y: -10, },
                { x: _croppedwidth, y: _croppedheight, },
                { x: -50, y: _croppedheight },
            ]);
            let _clipping_polygon = new fabric.Polygon(_original_polygon.points, {
                left: -(fab_video.get("width") / 2) - _original_polygon.get("left") * -1 - types.DIMENSIONS.CROP_SPAN,
                top: -(fab_video.get("height") / 2) - _original_polygon.get("top") * -1 - types.DIMENSIONS.CROP_SPAN,
            });
            // _fabric.add(_original_polygon);

            const _presentertext_clip_group = new fabric.Group([_clipping_polygon], { inverted: true, objectCaching: false });

            fab_video.clipPath = _presentertext_clip_group;

            fab_md_scene.left = isLeft
                ? types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT1 + (types.DIMENSIONS.W1 + types.DIMENSIONS.W2 + types.DIMENSIONS.W3)
                : types.DIMENSIONS.W1 + types.DIMENSIONS.W2;
            fab_md_scene.width = types.DIMENSIONS.ORIGINALWIDTH * types.DIMENSIONS.WIDTH_PERCENT2;
            if (!is_thumbnail) {
                fab_layout_white.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT - 1);

                if (fab_icon !== null && fab_icon !== '')
                    fab_icon.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 2);

                fab_md_scene.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 1);
                fab_video.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT);
            }
        }
        if (fab_video.filters !== undefined)
            fab_video.applyFilters();
    }
}