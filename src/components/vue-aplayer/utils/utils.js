const isMobile = /mobile/i.test(window.navigator.userAgent);

const utils = {
    isMobile: isMobile,
    eventsName: {
        moveStart: isMobile ? 'touchstart' : 'mousedown',
        moving: isMobile ? 'touchmove' : 'mousemove',
        moveEnd: isMobile ? 'touchend' : 'mouseup',
    },
    storage: {
        set: (key, value) => {
            localStorage.setItem(key, value);
        },
        get: (key) => {
            localStorage.getItem(key);
        }
    },
    /**
     * Parse Second to Time String
     *
     * @param {Number} second
     * @return {String} 00:00 or 00:00:00
     */
    secondToTime: (second) => {
        const strMap = (num) => (num < 10 ? '0' + num : '' + num);
        const hour = Math.floor(second / 3600);
        const min = Math.floor((second - hour * 3600) / 60);
        const sec = Math.floor(second - hour * 3600 - min * 60);
        return (hour > 0 ? [hour, min, sec] : [min, sec]).map(strMap).join(':');
    },
    randomOrder: (length) => {
        function shuffle(arr) {
            for (let i = arr.length - 1; i >= 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                const itemAtIndex = arr[randomIndex];
                arr[randomIndex] = arr[i];
                arr[i] = itemAtIndex;
            }
            return arr;
        }
        return shuffle(
            [...Array(length)].map(function(item, i) {
                return i;
            })
        );
    },
    /**
     * Parse Lyric String to Array
     * 
     * @param {String} lyricStr 
     * @return {Array} [[0, "APlayer"], [1.2, "is"], [34.56, "Amazing"]]
     */
    parse (lyricStr) {
        if (lyricStr) {
            lyricStr = lyricStr.replace(/([^\]^\n])\[/g, (match, p) => p + '\n[');
            let lyricArr = lyricStr.split('\n');
            let lyricParseArr = [];
            for (let i = 0; i < lyricArr.length; i++) {
                // match lrc time
                const lrcTimes = lyricArr[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
                // match lrc text
                const lrcText = lyricArr[i]
                    .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                    .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                    .replace(/^\s+|\s+$/g, '');

                if (lrcTimes) {
                    // handle multiple time tag
                    for (let j = 0; j < lrcTimes.length; j++) {
                        const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                        const min2sec = oneTime[1] * 60;
                        const sec2sec = parseInt(oneTime[2]);
                        const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
                        const lrcTime = min2sec + sec2sec + msec2sec;
                        lyricParseArr.push([lrcTime, lrcText]);
                    }
                }
            }
            // sort by time
            lyricParseArr = lyricParseArr.filter((item) => item[1]);
            lyricParseArr.sort((a, b) => a[0] - b[0]);

            return lyricParseArr;
        } else {
            return [];
        }
    },
};

export default utils;