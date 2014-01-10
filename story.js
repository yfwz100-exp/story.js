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
            story = this,
            handle = false,
            cursor = 0,
            callback = {};

        this.fps = 60;

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
        this.addScene = function (func) {
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
        this.start = function (cb) {
            handle = true;
            // Start the loop immediately.
            loop(0);
            callback.finish = cb;
        };

        /**
         * Move to next Scene.
         */
        this.nextScene = function () {
            if (seq.length > cursor + 1) {
                cursor += 1;
            } else {
                this.stop();
            }
        };

        /**
         * Stop the story and clear the handle of requestAnimationFrame().
         */
        this.stop = function () {
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
    }


    namespace.Story = Story;
}(window));