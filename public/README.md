# Neuro Player API - Nuro player methods controllable by the page that embeds it (similar to the YouTube player API)

### Naming methods
used [the YouTube player API](https://developers.google.com/youtube/iframe_api_reference) as a guide when naming the methods.

### Ready work before start the nuro player embed

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

`1. React and reactdom js files with same version as api project.`

    <script crossorigin src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>    
    <script crossorigin src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>

`2. Insert a compiled js.`

    <script src="./nuroplayer-api.min.js"></script>

`3. Declare nuroplayer object.`

    nuroplayer = nurolib.default
    nuroplayer()
    
### How to initialize nuro player

    <div id="content"></div>

`Embed player into target content element.`

    nuroplayer.init(document.getElementById("content"), 'https://player.nuro.video/current/nuroplayer.min.css'):Void

### Markdown Source/Content

    nuroplayer.setMarkdownSource(markdownURL:String):Void
    nuroplayer.setMarkdownContent(markdownText:String):Void
    nuroplayer.getMarkdownContent():String

### Play/Pause/Stop Video and skip to previous or next scene
    
    nuroplayer.playVideo():Void 
    nuroplayer.pauseVideo():Void
    nuroplayer.stopVideo():Void

    nuroplayer.prevScene():Void
    nuroplayer.nextScene():Void

### Set/Get Playback Rate ( step: 0.25, range: 0.25 - 4)

    nuroplayer.setPlaybackRate(suggestedRate:Number):Void

    nuroplayer.getPlaybackRate():Number

### Get Current Time

`Returns the elapsed time in milliseconds, not seconds like YouTube does since the video started playing.`

    nuroplayer.getCurrentTime():Number

### Other methods

    nuroplayer.seekTo(timestamp:Number):Void
    nuroplayer.setMarkdownTimecode(eventNumber, timestamp):Void
    nuroplayer.deleteMarkdownTimecode(eventNumber):Void
    nuroplayer.getPlayerState():Number
    nuroplayer.mute():Void
    nuroplayer.unMute():Void
    nuroplayer.isMuted():Boolean
    nuroplayer.setVolume(volume:Number):Void
    nuroplayer.getVolume():Number
    nuroplayer.setSize(width:Number, height:Number):Object