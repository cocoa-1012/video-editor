import Hls from "hls.js";
export const hlsObject = () => {
    const hls = new Hls();
    hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('Hls.Events.ERROR: ', event, data);
        if (data.fatal) {
            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    // try to recover network error
                    hls.startLoad();
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                default:
                    // cannot recover
                    hls.destroy();
                    break;
            }
        } else if (data.details === 'internalException' && data.type === 'otherError') {
            // && isMobile()
            console.log('this.getLevels(): ', this.getLevels());
            // const level = last(this.getLevels());
            //   hls.removeLevel(level?.level, level?.urlId);
            //   hls.startLoad();
        }
    });
    return hls;
}