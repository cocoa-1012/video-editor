import ReactDOM from 'react-dom';
import React from 'react';
import Home from './pages/Home';

let nextSceneCount = 0, prevSceneCount = 0;

export default function nurolib() {

  function renderFunction(props) {
    // console.log('nurolib', nurolib)
    // console.log('nurolib.play', nurolib.play)
    
    ReactDOM.render(
      <Home
        handlePlayerCallback={nurolib.handlePlayerCallback}
        {...props}
        play={nurolib.play}
        csslink={nurolib.csslink}
      />,
      nurolib.element
    );
  }
  function _init(element, csslink) {
    nurolib.element = element;
    nurolib.play = false;
    nurolib.csslink = csslink;
    const props = {
      mode: 'api_init',
    };
    renderFunction(props);
  }
  const addFixedZeroes = (str, zero_count) => {
    return '0'.repeat(zero_count - str.toString().length) + str;
  }
  const getTimeFormat = (timestamp) => {
    //[17]: 00:00:00,000
    return (
      addFixedZeroes(Number.parseInt(timestamp / 3600), 2) + ':' +
      addFixedZeroes(Number.parseInt(timestamp / 60) % 60, 2) + ':' +
      addFixedZeroes(Number.parseInt(timestamp % 60), 2) + ',' +
      addFixedZeroes(Number.parseInt(timestamp * 1000) % 1000, 3)
    );
  };
  function _deleteMarkdownTimecode(eventNumber) {
    // [14]: 00:02:43,957
    let mdContent = nurolib.mdContent.replace(new RegExp("\\[" + eventNumber + "\\]:\\s\\d\\d:\\d\\d:\\d\\d,\\d\\d\\d\\n", ""), "");
    nurolib.mdContent = mdContent;
    nurolib.play = false;
    const props = {
      mdContent,
    };
    renderFunction(props);
  }
  function _setMarkdownTimecode(eventNumber, timestamp) {
    let mdContent = nurolib.mdContent.replace(/^\s+|\s+$/gm, '') + `\n[${eventNumber}]: ` + getTimeFormat(timestamp);
    nurolib.mdContent = mdContent;
    nurolib.play = false;
    const props = {
      mdContent,
    };
    renderFunction(props);
  }
  function _handlePlayerCallback(_player) {
    nurolib.playerState = _player.playerState;
    nurolib.currentTime = _player.currentTime;
    nurolib.mdContent = _player.mdContent;
    nurolib.volume = _player.volume;
    nurolib.muted = _player.muted;
    nurolib.playbackRate = _player.playbackRate;
    return _player;
  }
  function _setMarkdownSource(markdownURL) {
    nurolib.markdownURL = markdownURL;
    nurolib.play = false;

    const props = {
      markdownURL,
    };
    renderFunction(props);
  }
  function _setMarkdownContent(mdContent) {
    nurolib.mdContent = mdContent;
    nurolib.play = false;

    const props = {
      mdContent,
    };
    renderFunction(props);
  }
  function _getMarkdownContent() {
    return nurolib.mdContent;
  }
  function _playVideo() {
    nurolib.play = true;

    const props = {
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _pauseVideo() {
    nurolib.play = false;
    const props = {
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _stopVideo() {
    nurolib.play = false;
    const props = {
      play_at: 0,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _setPlaybackRate(suggestedRate) {
    nurolib.playbackRate = suggestedRate;
    const props = {
      playbackRate: suggestedRate,
    };
    renderFunction(props);
  }
  function _getPlaybackRate() {
    return nurolib.playbackRate;
  }
  function _seekTo(timestamp) {
    nurolib.play_at = timestamp;
    const props = {
      play_at: timestamp,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _prevScene() {
    prevSceneCount++
    const props = {
      is_prev_scene: prevSceneCount,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _nextScene() {
    nextSceneCount++
    const props = {
      is_next_scene: nextSceneCount,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _mute() {
    const props = {
      muted: true,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _unMute() {
    const props = {
      muted: false,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _isMuted() {
    return nurolib.muted
  }
  function _setSize(playerw, playerh) {
    const props = {
      playerw,
      playerh,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _setVolume(volume) {
    nurolib.volume = volume;
    const props = {
      volume,
      playbackRate: nurolib.playbackRate,
    };
    renderFunction(props);
  }
  function _getVolume() {
    return nurolib.volume;
  }
  function _getPlayerState() {
    return nurolib.playerState;
  }
  function _getCurrentTime() {
    return nurolib.currentTime;
  }

  nurolib.init = _init;
  nurolib.handlePlayerCallback = _handlePlayerCallback;
  nurolib.getPlayerState = _getPlayerState;
  nurolib.getCurrentTime = _getCurrentTime;
  nurolib.setMarkdownSource = _setMarkdownSource;
  nurolib.setMarkdownContent = _setMarkdownContent;
  nurolib.getMarkdownContent = _getMarkdownContent;
  nurolib.setMarkdownTimecode = _setMarkdownTimecode;
  nurolib.deleteMarkdownTimecode = _deleteMarkdownTimecode;
  nurolib.playVideo = _playVideo;
  nurolib.pauseVideo = _pauseVideo;
  nurolib.stopVideo = _stopVideo;
  nurolib.setPlaybackRate = _setPlaybackRate;
  nurolib.getPlaybackRate = _getPlaybackRate;
  nurolib.seekTo = _seekTo;
  nurolib.prevScene = _prevScene;
  nurolib.nextScene = _nextScene;
  nurolib.setVolume = _setVolume;
  nurolib.getVolume = _getVolume;
  nurolib.mute = _mute;
  nurolib.unMute = _unMute;
  nurolib.isMuted = _isMuted;
  nurolib.setSize = _setSize;
};

