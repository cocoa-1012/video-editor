
import './home.css';
import Hls from "hls.js";
import { hlsObject } from '../utils/create-hls';
import { handleDownloadNotes } from '../utils/download-notes';
import { splitArrayWithChapter } from '../utils/split-array-with-chapter-number';
import { fabric } from "fabric";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import VideoPlayerControl from "../components/VideoPlayer/Control/Control";
import { getFixedNumber, getVideoUrl, getPlaylists, getThumbUrl, parseText } from "../utils/global-functions";
import { getSupportedLanguages } from "../utils/languages";
import { getStyles } from "../utils/styles";
import { removeObjectsFromCanvas, loadMdText } from '../utils/load-mdtext-with-external-link';
import { initCanvas, addThumbnailToCanvas, addVideoToCanvas } from '../utils/init-canvas';
import * as types from '../constants';
import { format } from '../components/VideoPlayer/FormattedTime/FormattedTime.js';

let fab_canvas = null, fab_layout_white = null, fab_video = null, fab_icon = null, fab_md_scene = null;
let html_script = '', arr_script = [], dels = [], project_title = '', project_title_h2 = '';
let controlVisibleTimer, is_playing = false, is_thumbnail = true, md_content_from_api_client = '', markdownURL = '', style_text = '', styles = types.INITIAL_STYLES;
let videourl, videotype, playlists = [], iconurl = '';
let hls = null;
let var_dur = 0;
let seeking = false;
let chapters = 1;
let playerwidth = 0;
let intervalTimeout = null;
let savedTime = null;
let autoResolutionTimer = null;

export default function Home(props) {
  console.log('Home');

  const [videowidth, setVideowidth] = useState(0);
  const [videoheight, setVideoheight] = useState(0);
  const [userLang, setUserLang] = useState(types.DEFAULT_LANGUAGE);
  const [fontpercent, setFontpercent] = useState(100);
  const [playerState, setPlayerState] = useState(types.PLAYER_STATE.unstarted);
  const [mdContent, setMdContent] = useState('');
  const [volume, setVolume] = useState(types.INITIAL_VOLUME);
  const [muted, setMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [controlVisibility, setControlVisibility] = useState('visible');
  // const [mode, setMode] = useState('');
  const [playerw, setPlayerw] = useState(0);
  const [playerh, setPlayerh] = useState(0);
  // const [csslink, setCsslink] = useState('');
  const [videoduration, setVideoduration] = useState(0);
  const [resolutions, setResolutions] = useState([]);
  const [resolution, setResolution] = useState(0);
  const [localsource, setLocalsource] = useState('');
  const player = useRef(null);
  const containerRef = useRef(null);
  const animationContainerRef = useRef(null);
  const sliderInputRef = useRef(null);
  const currentTimeRef = useRef(null);
  const videoPlayerControlRef = useRef(null);

  useEffect(() => {
    if (player.current !== null) player.current.muted = muted
  }, [muted]);

  function loadVideo() {
    console.log('loadVideo');
    if (videotype === 'm3u8') {
      const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
      if (isSafari) {
        alert('Please use video type as mp4, bunny or youtube. The Safari browser does not support m3u8 files.');
      }
      if (Hls.isSupported() && player.current !== null) {
        if (hls === null) {
          hls = hlsObject();
          hls.attachMedia(player.current);
        }
        hls.loadSource(videourl);
      }
    } else if (videotype === 'youtube' || videotype === 'mp4' || videotype === 'bunny') {
      if (videourl.indexOf(types.CDN_NURO_VIDEO) > 0)
        setLocalsource(videourl);
      else {
        setLocalsource(`${videourl}`);
      }
      // setLocalsource(`${types.CORS}${videourl}`);
    } else {
      alert(`please check the ${types.MD_FILE_URL} file and linked video source file.`);
    }
    // setMode('load_video');
  }

  const fetchData = useCallback(async () => {
    console.log('fetchData');
    let res, text, _resolutions, thumburl, project_titles = [], author, description, meta_language;
    if (md_content_from_api_client === '' || md_content_from_api_client === undefined) {
      res = await fetch(markdownURL || types.MD_FILE_URL);
      text = await res.text();
    } else text = md_content_from_api_client;
    setMdContent(text);

    [videourl, videotype, project_titles, author, description, meta_language, chapters, iconurl] = await getVideoUrl(text);
    // get supported languages
    const _lang = getSupportedLanguages(meta_language);
    setUserLang(_lang);

    if (project_titles.length > 0) project_title = project_titles[0];
    if (project_titles.length > 1) project_title_h2 = project_titles[1];
    thumburl = await getThumbUrl(videourl, videotype);

    // console.log('videotype', videotype, styles)
    // if (videotype === 'm3u8' || videotype === 'bunny') {
    // let video_mins = '14 minutes';
    let video_details = `${chapters} Chapter${chapters > 1 ? 's' : ''}`; // | ${video_mins}
    addThumbnailToCanvas(fab_canvas, thumburl, project_title, project_title_h2, author, description, video_details, styles);
    // }

    [arr_script, dels, html_script] = await parseText(style_text, text, project_title);
    [videourl, playlists] = await getPlaylists(videourl, videotype);

    loadVideo();
    if (videotype === 'm3u8' || videotype === 'bunny') {
      _resolutions = playlists.map(item => item.attributes.RESOLUTION.height);
      setResolutions(_resolutions);
      // setResolution(_resolution)
    }
  }, []);

  useEffect(() => {
    if (fab_canvas !== null) {
      fab_canvas.setZoom(playerw / types.DIMENSIONS.ORIGINALWIDTH);
      fab_canvas.setWidth(types.DIMENSIONS.ORIGINALWIDTH * fab_canvas.getZoom());
      fab_canvas.setHeight(types.DIMENSIONS.ORIGINALHEIGHT * fab_canvas.getZoom());
      fab_canvas.renderAll();
    }
  }, [playerw]);

  // effect hooks
  useLayoutEffect(() => {
    window.addEventListener('resize', () => {
      handlePlayerDimension(containerRef.current.offsetWidth);
    });
  }, []);

  function handlePlayerDimension(_w) {
    let _h = _w * 9 / 16;
    if (_h > containerRef.current.offsetHeight) {
      _h = containerRef.current.offsetHeight;
      animationContainerRef.current.style.top = `0px`;
      animationContainerRef.current.style.left = `${0.5 * _w - 0.885 * _h}px`;

      videoPlayerControlRef.current.style.left = `${0.5 * _w - 0.885 * _h}px`;
      videoPlayerControlRef.current.style.top = `${0.87 * _h}px`;
      _w = _h * 16 / 9;
    } else {
      animationContainerRef.current.style.top = `${0.5 * containerRef.current.offsetHeight - 0.2825 * _w}px`;
      animationContainerRef.current.style.left = `0px`;

      videoPlayerControlRef.current.style.top = `${0.5 * containerRef.current.offsetHeight + 0.2075 * _w}px`;
      videoPlayerControlRef.current.style.left = `0px`;
    }

    let player_buttons = document.getElementsByClassName('player-control__button');
    if (_w < 710) {
      for (let i = 0; i < player_buttons.length; i++) {
        player_buttons[i].style.minWidth = '30px';
      }
    }
    else {
      for (let i = 0; i < player_buttons.length; i++) {
        player_buttons[i].style.minWidth = '60px';
      }
    }

    if (_w < 610) {
      document.getElementById('player_settings').style.display = 'none';
      document.getElementById('volumeDiv').style.display = 'none';
    } else {
      document.getElementById('player_settings').style.display = 'block';
      document.getElementById('volumeDiv').style.display = 'block';
    }
    setPlayerw(_w);
    playerwidth = _w;
    setPlayerh(_h);
  }
  const autoChooseResolution = useCallback((_h) => {
    let _resolution = resolutions[0];
    const _arr = resolutions.filter(item => item > _h);
    if (_arr.length > 0) {
      _resolution = _arr[_arr.length - 1];
    }
    setResolution(_resolution);
  }, [resolutions]);

  useEffect(() => {
    if (playerh !== 0 && resolutions !== []) {
      clearTimeout(autoResolutionTimer);
      autoResolutionTimer = setTimeout(() => {
        autoChooseResolution(playerh);
      }, 200);
    }
  }, [resolutions, playerh, autoChooseResolution]);


  useEffect(() => {
    async function fetchAsyncData() {
      if (props.mode === 'init' || props.mode === 'api_init') {
        // get style text
        [style_text, styles] = await getStyles(style_text, styles);
        document.body.style.backgroundColor = styles.player_bg_color;
        sliderInputRef.current.value = 0;

        [fab_canvas, fab_layout_white] = await initCanvas("sCanvas", types.DIMENSIONS.ORIGINALWIDTH, styles);
        handlePlayerDimension(containerRef.current.offsetWidth);

        if (props.mode === 'init')
          fetchData();
      }
    }
    fetchAsyncData();
  }, [props.mode, fetchData]);

  useEffect(() => {
    if (fab_canvas !== null && project_title !== "")
      fab_canvas.getObjects().filter(obj => obj.id === "project_title").forEach(obj => {
        if (controlVisibility === 'hidden') obj.opacity = 1;
        else obj.opacity = 0;
      });
  }, [controlVisibility]);

  useEffect(() => { if (player.current !== null) player.current.playbackRate = playbackRate; }, [playbackRate])
  const handleplaybackRate = (e) => {
    setPlaybackRate(e);
  }

  const handleResolution = (_resolution) => {
    setResolution(_resolution);
  }

  useEffect(() => {
    if (resolution !== undefined && resolution !== 0) {
      if (player.current !== null)
        savedTime = player.current.currentTime;
      if (videotype === 'm3u8') {
        playlists.filter(x => x.attributes.RESOLUTION.height === resolution).forEach(x => {
          const _videourl = videourl.replace('/video.m3u8', '');
          const filename = _videourl.substring(_videourl.lastIndexOf('/') + 1);
          videourl = _videourl.replace(filename, x.uri);
          loadVideo();
          // handleVideoRewind();
        })
      } else if (videotype === 'bunny') {
        const _videourl = videourl;
        const filename = _videourl.substring(_videourl.lastIndexOf('/') + 1);
        videourl = _videourl.replace(filename, `play_${resolution}p.mp4`);
        loadVideo();
        // handleVideoRewind();
      }
    }
  }, [resolution]);

  const handleMuteToggle = useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  const getCurrentTimeFromSliderTime = (sliderTime) => {
    if (dels.length === 0)
      return sliderTime;
    let _filteredDels = dels.filter(item => item.start <= sliderTime && sliderTime < item.end);
    if (_filteredDels.length === 0)
      return sliderTime;

    const _currentTime = sliderTime - _filteredDels[0].start + _filteredDels[0].end;
    player.current.currentTime = _currentTime;
    return _currentTime;
  }
  const getSliderTimeFromCurrentTime = (_currentTime) => {
    if (dels.length === 0)
      return _currentTime;
    let _filteredDels = dels.filter(item => item.start <= _currentTime);
    if (_filteredDels.length === 0)
      return _currentTime;
    for (let i = 0; i < _filteredDels.length; i++) {
      _currentTime += (_filteredDels[i].end - _filteredDels[i].start);
    }
    return _currentTime;
  }


  const loadCanvas = useCallback((presenter_refresh = false) => {
    if (fab_video !== null && player.current !== null) {
      let _realCurrentTime = player.current.currentTime;
      if (!seeking) {
        let _currentTime = getCurrentTimeFromSliderTime(_realCurrentTime);
        const _isAnimation = !seeking && is_playing;
        const pw = playerwidth;
        arr_script = loadMdText(presenter_refresh, _isAnimation, fab_canvas, fab_video, fab_md_scene, fab_icon, fab_layout_white, pw, _currentTime, arr_script, types.DIMENSIONS.ORIGINALHEIGHT * types.DIMENSIONS.HEIGHT_PERCENT / videoheight, videowidth, videoheight, fontpercent, styles);
      }

      let _sumDels = dels.filter(item => item.end <= _realCurrentTime).reduce((prev, curr) => { return prev + curr.end - curr.start }, 0);
      const _pseudoCurrentTime = _realCurrentTime - _sumDels;
      const ff = format(_pseudoCurrentTime)
      currentTimeRef.current.innerHTML = ff;
      if (var_dur !== 0) {
        const vv = getFixedNumber(_pseudoCurrentTime / var_dur, 5);
        sliderInputRef.current.value = vv;
      }
    }
  }, [fontpercent, videowidth, videoheight]);

  const handleVideoRewind = () => {
    is_thumbnail = true;
    fab_canvas.getObjects().filter(obj => obj.id === 'layout-white').forEach(obj => {
      obj.evented = false;
    });
    fab_canvas.getObjects().filter(obj => obj.id === 'not_using_nuro_yet' || obj.id === 'play_btn').forEach(obj => {
      obj.evented = true;
    });

    removeObjectsFromCanvas(fab_canvas, arr_script, 0, true);
    fab_video.moveTo(0)
    fab_md_scene.moveTo(1)
    if (fab_icon !== null && fab_icon !== '') {
      fab_icon.moveTo(2)
      fab_layout_white.moveTo(3)
    } else {
      fab_layout_white.moveTo(2)
    }
    fab_canvas.renderAll();

    if (playbackRate > 1)
      setPlaybackRate(playbackRate - 0.25)

    setPlayerState(types.PLAYER_STATE.unstarted)
    is_playing = false;
    playAt(0);
    if (player.current !== null) {
      player.current.pause();
      setControlVisibility('visible');
    }
  };

  const playAt = (_played) => {
    if (player.current !== null) {
      let _currentTime = _played * var_dur;
      const _realCurrentTime = getSliderTimeFromCurrentTime(_currentTime);
      player.current.currentTime = _realCurrentTime;
      if (fab_canvas !== null) removeObjectsFromCanvas(fab_canvas, arr_script, _currentTime, true)
      loadCanvas();
    }
  }

  const handleVideoSliderMouseDown = () => {
    setControlVisibility('visible');
    seeking = true;
  };
  const handleVideoSliderChange = (e) => {
    if (fab_video !== null && player.current !== null) {
      fab_video.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT + 1)
      fab_md_scene.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT)
      fab_layout_white.moveTo(types.FABRIC_HIDDEN_OBJ_COUNT - 1)
      playAt(e.target.value);
    }
    // playAt(e.target.value);
  };
  const handleVideoSliderMouseUp = (e) => {
    seeking = false;
    loadCanvas();
  };

  const handleVideoReady = (v) => {
    const _duration = v.target.duration;
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    let chapter = params.get('chapter');
    [dels, arr_script] = splitArrayWithChapter(chapter, chapters, arr_script, dels, _duration);

    player.current.width = v.target.videoWidth;
    player.current.height = v.target.videoHeight;

    if (fab_video === null) {
      [fab_canvas, fab_video, fab_md_scene] = addVideoToCanvas(fab_canvas, player.current, styles, project_title, iconurl);

      fab_canvas.on('mouse:up', function (options) {
        if (options.target) {
          if (options.target.id) {
            if (is_thumbnail && options.target.id === 'not_using_nuro_yet') {
              window.open(types.THUMBNAIL.NOT_USING_NURO_YET_LINK, '_blank');
            }
            if (
              (is_thumbnail && options.target.id === 'play_btn') ||
              (!is_thumbnail && options.target.id === 'layout-white')
            ) {
              handlePlayPause();
            }
          }
        }
      });

      fabric.Image.fromURL(iconurl, function (_img) {
        if (_img.width !== 0 && _img.height !== 0) {
          _img.set({
            id: "icon",
            selectable: types.FABRIC_OBJECT_SELECTABLE,
            evented: types.FABRIC_OBJECT_SELECTABLE,
            left: 100,
            top: 100,
            originX: 0,
            originY: 0,
            opacity: 0.5,
            objectCaching: true,
            statefullCache: true,
          });
          if (_img.width > _img.height) {
            _img.scaleX = types.DIMENSIONS.ORIGINALWIDTH * 0.1 / _img.width;
            _img.scaleY = types.DIMENSIONS.ORIGINALWIDTH * 0.1 / _img.width;
          } else {
            _img.scaleX = types.DIMENSIONS.ORIGINALHEIGHT * 0.15 / _img.height;
            _img.scaleY = types.DIMENSIONS.ORIGINALHEIGHT * 0.15 / _img.height;
          }

          fab_canvas.add(_img);
          fab_icon = _img;
          fab_icon.moveTo(2);
        } else {
          fab_icon = '';
        }
      }, { crossOrigin: 'anonymous' });
      setVideoheight(v.target.videoHeight);
      setVideowidth(v.target.videoWidth);
    } else {
      setVideoheight(v.target.videoHeight);
      setVideowidth(v.target.videoWidth);
    }

    const _delSum = dels.reduce((prev, curr) => { return prev + (curr.end - curr.start) }, 0)
    var_dur = _duration - _delSum;
    // console.log('var_dur', var_dur, _duration, _delSum)
    setVideoduration(var_dur);
    // playAt(0);

    const _autoplay = params.get('autoplay');
    if (_autoplay === '1') {
      //auto play
      handlePlayPause();
    } else {
      setMuted(false);
    }
  };

  const handleVideoEnded = () => {
    setPlayerState(types.PLAYER_STATE.ended)
    const myUrlWithParams = new URL(window.location);
    let _autoplay = myUrlWithParams.searchParams.get('autoplay');

    if (_autoplay) {
      myUrlWithParams.searchParams.delete("autoplay");
      window.location = myUrlWithParams.href;
    }
    else
      handleVideoRewind();
  };

  const handleSkipPrevious = useCallback(() => {
    if (player.current !== null) {
      const _currentTime = player.current.currentTime;
      const _arr = arr_script.filter(item => item.type === 'title' && item.start < _currentTime);
      let _prevScene = null;
      if (_arr.length > 1) _prevScene = _arr[_arr.length - 2];
      else if (_arr.length > 0) _prevScene = _arr[_arr.length - 1];

      if (_prevScene !== null) {
        player.current.currentTime = _prevScene.start + types.INTERVAL * 2 / 1000;
        if (!is_playing) loadCanvas();
      }
    }
  }, [loadCanvas]);

  const handleSkipNext = useCallback(() => {
    if (player.current !== null) {
      const _currentTime = player.current.currentTime;
      const _arr = arr_script.filter(item => item.type === 'title' && item.start > _currentTime);
      if (_arr.length > 0) {
        const _prevScene = _arr[0];
        player.current.currentTime = _prevScene.start + types.INTERVAL * 2 / 1000;
        if (!is_playing) loadCanvas();
      }
    }
  }, [loadCanvas]);

  useEffect(() => {
    if (player.current !== null) player.current.volume = volume * 0.01;
  }, [volume])

  const handleControlVisibleTimer = useCallback(() => {
    clearTimeout(controlVisibleTimer);
    if (player.current !== null && !player.current.paused) {
      controlVisibleTimer = setTimeout(() => {
        setControlVisibility('hidden');
      }, 5000)
    }
  }, []);

  const handleControlVisible = () => {
    setControlVisibility('visible')
    handleControlVisibleTimer();
  }

  // props effect hooks
  useEffect(() => {
    if (props.handlePlayerCallback)
      props.handlePlayerCallback({
        playerState,
        currentTime: player.current !== null ? 0 : player.current.currentTime * 1000,
        mdContent, volume, muted, playbackRate,
      });
  }, [props, playerState,
    // player.current.currentTime,
    // currentTime,
    mdContent, volume, muted, playbackRate]);

  useEffect(() => {
    if (props.playerw !== undefined && props.playerw !== '') handlePlayerDimension(props.playerw);
  }, [props.playerw]);

  useEffect(() => {
    if (props.muted !== undefined && props.muted !== '') setMuted(props.muted);
  }, [props.muted]);

  useEffect(() => {
    if (props.mdContent !== undefined && props.mdContent !== '') {
      md_content_from_api_client = props.mdContent;
      fetchData();
    }
  }, [props.mdContent, fetchData]);

  useEffect(() => {
    if (props.markdownURL !== undefined && props.markdownURL !== '') {
      markdownURL = props.markdownURL;
      fetchData();
    }
  }, [props.markdownURL, fetchData]);

  useEffect(() => {
    if (props.playbackRate !== undefined && props.playbackRate !== '') setPlaybackRate(props.playbackRate);
  }, [props.playbackRate]);

  useEffect(() => {
    if (props.play_at !== undefined && props.play_at !== '' && player.current !== null) player.current.currentTime = props.play_at;
  }, [props.play_at]);

  useEffect(() => {
    if (props.is_prev_scene !== undefined)
      if (props.is_prev_scene > 0 && player.current !== null) handleSkipPrevious();
  }, [props.is_prev_scene, handleSkipPrevious]);

  useEffect(() => {
    if (props.is_next_scene !== undefined)
      if (props.is_next_scene > 0 && player.current !== null) handleSkipNext();
  }, [props.is_next_scene, handleSkipNext]);

  useEffect(() => {
    if (props.volume !== undefined && props.volume !== '' && player.current !== null) setVolume(props.volume);
  }, [props.volume]);

  const handleInterval = useCallback(() => {
    intervalTimeout = setTimeout(function () {
      // console.log('handleInterval');
      loadCanvas();
      if (is_playing) {
        handleInterval();
      }
    }, types.INTERVAL);
  }, [loadCanvas]);

  useEffect(() => {
    if (fab_video !== null && player.current !== null) {
      let _currentTime = getCurrentTimeFromSliderTime(player.current.currentTime);
      removeObjectsFromCanvas(fab_canvas, arr_script, _currentTime, true);
      clearTimeout(intervalTimeout);
      handleInterval();
    }
  }, [fontpercent, handleInterval]);

  const handleFontpercent = useCallback((f, type = 'none') => {
    if (type !== 'none') {
      const fontpercents = types.FONT_PERCENTS;
      let i = 0;
      for (; i < fontpercents.length; i++)
        if (fontpercents[i] === fontpercent)
          break;
      if (type === 'minus' && i > 0) {
        setFontpercent(fontpercents[i - 1]);
      }
      if (type === 'plus' && i < fontpercents.length - 1) {
        setFontpercent(fontpercents[i + 1]);
      }
    }
    else
      setFontpercent(f);
  }, [fontpercent]);

  const handlePlay = useCallback(() => {
    if (fab_video !== null && player.current !== null) {
      if (!is_playing) {
        if (is_thumbnail) {
          is_thumbnail = false;
          fab_canvas.getObjects().filter(obj => obj.id === 'layout-white').forEach(obj => {
            obj.evented = true;
          });

          fab_canvas.getObjects().filter(obj => obj.id === 'not_using_nuro_yet' || obj.id === 'play_btn').forEach(obj => {
            obj.evented = false;
          });
        }
        is_playing = true;
        player.current.play();
        setPlayerState(types.PLAYER_STATE.playing)
        handleControlVisibleTimer();
        handleInterval();
      }
    }
  }, [handleControlVisibleTimer, handleInterval]);

  useEffect(() => {
    if (fab_video !== null && player.current !== null && savedTime !== null) {
      player.current.currentTime = savedTime;
      if (is_playing) {
        is_playing = false;
        handlePlay();
      }
      loadCanvas(true);
    }
  }, [videowidth, loadCanvas, handlePlay]);

  const handlePause = useCallback(() => {
    if (fab_video !== null && player.current !== null) {
      if (is_playing) {
        is_playing = false;
        player.current.pause();
        setControlVisibility('visible');
        setPlayerState(types.PLAYER_STATE.paused)
      }
    }
  }, []);

  useEffect(() => {
    if (props.play !== undefined) {
      if (props.play) handlePlay();
      else handlePause();
    }
  }, [props.play, handlePause, handlePlay]);

  const handlePlayPause = useCallback(() => {
    if (is_playing) handlePause();
    else handlePlay();
  }, [handlePause, handlePlay]);

  const logKey = useCallback((e) => {
    // console.log(e, ` ${e.code}`, volume);
    const keycode = e.code;
    switch (keycode) {
      case 'Space':
        handlePlayPause();
        break;
      case 'ArrowLeft':
        handleSkipPrevious();
        break;
      case 'ArrowRight':
        handleSkipNext();
        break;
      case 'ArrowUp':
        if (e.ctrlKey || e.metaKey)
          setVolume(volume + 5);
        break;
      case 'ArrowDown':
        if (e.ctrlKey || e.metaKey)
          setVolume(volume - 5);
        break;
      case 'NumpadAdd':
      case 'Equal':
        if (e.ctrlKey || e.metaKey) {
          handleFontpercent(0, 'plus');
        }
        break;
      case 'NumpadSubtract':
      case 'Minus':
        if (e.ctrlKey || e.metaKey) {
          handleFontpercent(0, 'minus');
        }
        break;
      case 'Digit0':
      case 'Numpad0':
        if (e.ctrlKey || e.metaKey) {
          handleFontpercent(100);
        }
        break;
      case 'KeyM':
        handleMuteToggle();
        break;
      default:
        break;
    }
  }, [volume, handleFontpercent, handleMuteToggle, handlePlayPause, handleSkipNext, handleSkipPrevious]);

  useEffect(() => {
    document.body.addEventListener("keyup", logKey);
    return () => {
      document.body.removeEventListener("keyup", logKey);
    };
  }, [logKey]);

  const handleFullscreen = () => {
    if (document.fullscreenElement === null)
      openFullscreen();
    else
      closeFullscreen();
  }

  function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    console.log('closeFullscreen');
    if (document) {
      if (document.exitFullscreen) {
        console.log('exitFullscreen');
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        console.log('webkitExitFullscreen');
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        console.log('msExitFullscreen');
        document.msExitFullscreen();
      }
    }
  }

  return (
    <div className='backContainer' ref={containerRef}
      onMouseOver={handleControlVisible}>
      {props.csslink && <link rel="stylesheet" type="text/css" href={props.csslink} />}
      <div className="animationContainer" ref={animationContainerRef}>
        <img alt='' crossOrigin='anonymous' id='animationImg' />
        <canvas id="sCanvas" />
      </div>

      <VideoPlayerControl
        userLang={userLang}
        videoPlayerControlRef={videoPlayerControlRef}
        resolution={resolution}
        resolutions={resolutions}
        fontpercent={fontpercent}
        onResolution={handleResolution}
        onFontpercent={handleFontpercent}
        playbackRate={playbackRate}
        onPlaybackRateChange={handleplaybackRate}
        is_playing={is_playing}
        is_muted={muted}
        onMuteToggle={handleMuteToggle}
        currentTimeRef={currentTimeRef}
        sliderInputRef={sliderInputRef}
        duration={videoduration}
        onPlayPause={handlePlayPause}
        onSliderChange={handleVideoSliderChange}
        onSliderMouseUp={handleVideoSliderMouseUp}
        onSliderMouseDown={handleVideoSliderMouseDown}
        onRewind={handleVideoRewind}
        onSkipPrevious={handleSkipPrevious}
        onSkipNext={handleSkipNext}
        volume={volume}
        onVolumeChange={(e, v) => { setVolume(v); }}
        onDownloadNotes={() => handleDownloadNotes(project_title, html_script)}
        playerw={playerw}
        playerh={playerh}
        controlVisibility={controlVisibility}
        onFullscreen={handleFullscreen}
      />
      <video controls
        id='player'
        src={localsource}
        ref={player}
        onLoadedData={handleVideoReady}
        onEnded={handleVideoEnded}
        preload="auto"
        width={"unset"}
        height={"100%"}
        crossOrigin="Anonymous"
        muted={muted}
      />
    </div>
  );
}