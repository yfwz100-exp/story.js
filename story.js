/*jslint browser: true */
(function (exports) {
    'use strict';
    
    var namespace;
    
    if (exports.ziq) {
        namespace = exports.ziq;
    } else {
        namespace = exports.ziq = {};
    }
    
    function Story() {
        var seq = [], story = this, handle = false, cursor = 0, callback = {};
        
        this.fps = 60;
        
        function loop(timestamp) {
            if (timestamp - loop.start > (1000 / story.fps)) {
                if (seq[cursor]()) {
                    story.next();
                }
                loop.start = timestamp;
            }
            // check if started.
            if (handle) {
                handle = window.requestAnimationFrame(loop);
            }
        }
        loop.start = 0;
        
        this.add = function (func) {
            if (typeof func === 'function') {
                seq.push(func);
            } else {
                var i;
                for (i = 0; i < func.length; i += 1) {
                    seq.push(func[i]);
                }
            }
        };
        
        this.start = function (finishCallback) {
            handle = true;
            loop(0);
            callback.finish = finishCallback;
        };
        
        this.next = function () {
            if (seq.length > cursor + 1) {
                cursor += 1;
            } else {
                this.stop();
            }
        };
        
        this.stop = function () {
            if (handle) {
                window.cancelAnimationFrame(handle);
                handle = false;
            }
            
            cursor = 0;
            
            if (callback.finish) {
                callback.finish();
            }
        };
    }
    
    namespace.Story = Story;
}(window));
