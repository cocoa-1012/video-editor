import * as types from '../constants';
export const getSupportedLanguages = (meta_language) => {
    let _lang = 'en';

    let browserlang = navigator.language || navigator.userLanguage;
    if (types.SUPPORTED_LANGUAGES.indexOf(browserlang) > 0) _lang = browserlang;
    else if (types.SUPPORTED_LANGUAGES.indexOf(meta_language) > 0) _lang = meta_language;

    return _lang;
};