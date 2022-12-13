export const REQUESTANIM_INTERVEL = 1000 / 16;
export const LIMIT_RESOLUTION_MP4 = 1080;
export const FABRIC_OBJECT_SELECTABLE = false;
export const STYLE_URL = "./style.css";
export const MD_FILE_URL = "./neurovideo.md"; // "markdown.txt";
export const DESIRED_HIGH_RESOLUTION = 720;

export const CORS = "https://corsanywhere.herokuapp.com/"; //"https://corsnomon.herokuapp.com/";
export const CDN_NURO_VIDEO = "cdn.nuro.video"; //"https://corsnomon.herokuapp.com/";

export const FPS = 20;
export const INTERVAL = 1000 / 5;
export const INITIAL_ENDTIME = 100000000;

export const SLIDETYPES = {
    PRESENTERONLY: "PRESENTER-ONLY",
    TEXTONLY: "TEXT-ONLY",
    
    PRESENTERTEXT: "PRESENTER+TEXT",
    PRESENTER_LEFT_TEXT_RIGHT: "PRESENTER-LEFT+TEXT-RIGHT",
    PRESENTER_RIGHT_TEXT_LEFT: "PRESENTER-RIGHT+TEXT-LEFT",

    TITLEONLY: "TITLE-ONLY",
    VIDEOEND: 'VIDEOEND',
};

export const FONTSIZES = {
    PROJECT: 30,
    TITLE: 42,
    CONTENT: 26,
};
export const FONT_PERCENTS = [50, 75, 100, 150, 200];

export const INITIAL_VOLUME = 30;

//dimensions
export const DIMENSIONS = {
    CROP_SPAN: 0,
    ORIGINALWIDTH: 1280,
    ORIGINALHEIGHT: 720,
    TRIANGLE_WIDTH: 17,
    W1: 15,
    H1: 25,
    HEIGHT_GAP_RATE: 0.8,
    W2: 10,
    W3: 10,
    H2: 10,
    WIDTH_PERCENT1: 0.415,
    WIDTH_PERCENT2: 0.535,
    HEIGHT_PERCENT: 0.829,
    H3: 68,
    MAX_CONTROL_HEIGHT: 30,
};

//animation
export const ROTATE_ANIMATION_DURATION = 1;
export const ANIMATION_CHARACTERS = 150;
export const DIFFERENCE_LEFT = 50;

export const PLAYER_STATE = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    paused: 2,
    buffering: 3,
    video_cued: 5
}

export const FABRIC_HIDDEN_OBJ_COUNT = 16; // layout-white, and thumbnail 0, 1, 2, 3 - 13
// styles
export const INITIAL_STYLES = {
    player_border_color: 'white',
    fontfamily: 'Helvetica Neue, Helvetica',
    title_color: '#FFAF04',
    content_color: 'white',
    bullet_color: '#FFAF04',
    bullet_content: '25B6︎',
    player_bg_color: '#2F5F83',
    content_bg_color: '#263c50',
}

// thumbnail
export const THUMBNAIL = {
    AUTHOR: 'Author',
    VIDEO_DETAILS: 'Video Details',
    PLAY_VIDEO: 'Play Video',
    NOT_USING_NURO_YET: 'Vous n\'utilisez pas encore Nuro?', //Not using Nuro yet?
    NOT_USING_NURO_YET_LINK: 'https://get.nuro.video/offre-nuro',

    H1_COLOR: 'black',
    H2_COLOR: 'grey',
    AUTHOR_VD_COLOR1: 'black',
    AUTHOR_VD_COLOR2: 'grey',
    PLAY_BTN_COLOR: 'lightgrey',

    H1_SIZE: 35,
    H2_SIZE: 19,
    AUTHOR_VD_SIZE1: 24,
    AUTHOR_VD_SIZE2: 20,
    PLAY_WIDTH: 150,

    LEFT_POS: 70,
    H1_TOP: 80,
    H2_TOP: 180,
    AUTHOR_TOP1: 260,
    AUTHOR_TOP2: 295,
    VIDEO_DETAILS_TOP1: 350,
    VIDEO_DETAILS_TOP2: 385,

    PLAY_TOP: 480,
    NOT_USING_NURO_YET_TOP: 525,
}

export const PLAYBACKS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

// languages
export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'pt-br'];

export const labels = {
    'en': {
        'Play': 'Play',
        'Pause': 'Pause',
        'Next': 'Next',
        'Previous': 'Previous',
        'Settings': 'Settings',
        'Playrate': 'Playrate',
        'Fontsize': 'Font size',
        'Downloadnotes': 'Download notes',
        'Quality': 'Quality',
        'Rewind': 'Rewind',
        'PlaybackSpeed': 'Playback speed',
        'Normal': 'Normal',
        'NormalHD': 'Normal (HD)',
        'ExportToMP4': 'Export To MP4',
        'Fullscreen': 'Full screen',
    },
    'fr': {
        'Play': 'Jouer',
        'Pause': 'Pause',
        'Next': 'Suivante',
        'Previous': 'Précédente',
        'Settings': 'Réglages',
        'Playrate': 'Taux de jeu',
        'Fontsize': 'Taille de police',
        'Downloadnotes': 'Télécharger les notes',
        'Quality': 'Qualité',
        'Rewind': 'Rembobiner',
        'PlaybackSpeed': 'Vitesse de lecture',
        'Normal': 'Normale',
        'NormalHD': 'Normale (HD)',
        'ExportToMP4': 'Exporter vers MP4',
        'Fullscreen': 'Plein écran',
    },
    'pt-br': {
        'Play': 'Reproduzir',
        'Pause': 'pausa',
        'Next': 'próxima',
        'Previous': 'anterior',
        'Settings': 'Configurações',
        'Playrate': 'Playrate',
        'Fontsize': 'Taxa de reprodução',
        'Downloadnotes': 'Baixar notas',
        'Quality': 'Qualidade',
        'Rewind': 'Retroceder',
        'PlaybackSpeed': 'Velocidade de reprodução',
        'Normal': 'Normal',
        'NormalHD': 'Normal (HD)',
        'ExportToMP4': 'Exportar para MP4',
        'Fullscreen': 'Tela cheia',
    },
}

