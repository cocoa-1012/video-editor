import * as types from '../constants';
export const splitArrayWithChapter = (chapter, chapters, arr_script, dels, _duration) => {
    let start_chapter_index = 0, end_chapter_index = arr_script.length - 1;
    if (chapter === null || chapter < 1 || chapter > chapters) chapter = 1;
    chapter *= 1;

    for (let i = 0; i < arr_script.length; i++) {
        if (arr_script[i].type === 'chapter' && arr_script[i].chapter_id === chapter) start_chapter_index = i;
        if (arr_script[i].chapter_id === chapter) end_chapter_index = i;
    }
    // console.log('chapter', chapter, start_chapter_index, end_chapter_index)
    if (start_chapter_index > 0) {
        const _start = 0;
        const _end = arr_script[start_chapter_index].start;
        for (let i = 0; i < dels.length; i++) {
            if (dels[i].start >= _start && dels[i].end <= _end) {
                dels.splice(i, 1);
                i--;
            }
        }
        dels.push({
            start: _start,
            end: _end,
        });
    }
    if (end_chapter_index < arr_script.length - 1) {
        const _start = arr_script[end_chapter_index].end;
        const _end = types.INITIAL_ENDTIME;
        for (let i = 0; i < dels.length; i++) {
            if (dels[i].start >= _start && dels[i].end <= _end) {
                dels.splice(i, 1);
                i--;
            }
        }
        dels.push({
            start: _start,
            end: _end,
        });
    }

    dels.filter(item => item.end > _duration).forEach(item => item.end = _duration);
    for (let i = 0; i < dels.length; i++) {
        const item = dels[i];
        if (item.start <= 0) dels[i].start = 10e-3;
        if (item.start >= _duration) {
            dels.splice(i, 1);
            i--;
        }
    }

    let endtime = _duration;
    const _endDels = dels.filter(item => item.end >= endtime);
    if (_endDels.length > 0) endtime = _endDels[0].start;


    for (let i = 0; i < arr_script.length; i++) {
        const item = arr_script[i];
        if (item.start <= 0) arr_script[i].start = 10e-3;
        if (item.start >= _duration) {
            arr_script.splice(i, 1);
            i--;
        }
        if (i === 0) arr_script[i].start = 0;
    }

    arr_script.filter(item => item.end === types.INITIAL_ENDTIME).forEach(item => {
        item.end = _duration - types.ROTATE_ANIMATION_DURATION;
    });

    arr_script.push({
        is_animation: true,
        index: arr_script.length,
        type: "title",
        parent: 0,
        isLeft: false,
        slide: types.SLIDETYPES.VIDEOEND,
        text: ' ',
        start: endtime - types.ROTATE_ANIMATION_DURATION,
        end: endtime,
        bottom: 0,
    })
    // console.log('dels', dels)
    // console.log('arr_script', arr_script)
    return [dels, arr_script];
}