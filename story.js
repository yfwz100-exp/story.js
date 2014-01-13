/*jslint browser: true */
(function (exports) {
    'use strict';

    /** @namespace */
    var namespace;

    if (exports.ziq) {
        namespace = exports.ziq;
    } else {
        namespace = exports.ziq = {};
    }

    /**
     * The story object.
     *
     * @constructor
     */
    function Story() {
        var seq = [],
            handle = false,
            cursor = 0,
            callback = {};
        
        /**
         * The function behind the object.
         *
         * @param callback the callback function.
         */
        function story(callback) {
            story.start(callback);
        }

        story.fps = 60;

        /**
         * The loop closure to start the story.
         *
         * @param {Number} timestamp defined in requestAnimationFrame.
         */
        function loop(timestamp) {
            if (timestamp - loop.start > (1000 / story.fps)) {
                if (seq[cursor](loop.frame += 1)) {
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
        loop.frame = 0;

        /**
         * Add scene function to the story.
         *
         * @param {function} func the scene function.
         */
        story.addScene = function (func) {
            if (typeof func === 'function') {
                seq.push(func);
            } else {
                var i;
                for (i = 0; i < func.length; i += 1) {
                    seq.push(func[i]);
                }
            }
        };

        /**
         * Start the story.
         *
         * @param {function} cb callback function.
         */
        story.start = function (cb) {
            handle = true;
            // Start the loop immediately.
            loop(0);
            callback.finish = cb;
        };
        
        /**
         * Check if the story is started.
         *
         * @return {Boolean}
         */
        story.isStarted = function () {
            return handle ? true : false;
        };

        /**
         * Move to next Scene.
         */
        story.nextScene = function () {
            if (seq.length > cursor + 1) {
                cursor += 1;
            } else {
                this.stop();
            }
        };

        /**
         * Stop the story and clear the handle of requestAnimationFrame().
         */
        story.stop = function () {
            if (handle) {
                window.cancelAnimationFrame(handle);
                handle = false;
            }

            // reset the cursor.
            cursor = 0;

            if (callback.finish) {
                callback.finish();
            }
        };
        
        return story;
    }

    namespace.Story = Story;
}(window));