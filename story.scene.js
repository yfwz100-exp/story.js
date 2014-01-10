/*jslint browser: true */
(function (exports) {
    'use strict';
    
    /** @namespace */
    var namespace;

    if (exports.ziq && exports.ziq.Story) {
        namespace = exports.ziq.Story;
    } else {
        throw 'ziq.Story is required.';
    }
    
    /** Check if the two rectangle area is intersected. */
    function isRectsInterseted(r1, r2) {
        return !((r1.y + r1.h < r2.y) || (r2.y + r2.h < r1.y) || (r1.x + r1.w < r2.x) || (r2.x + r2.w < r1.x));
    }
    
    /**
     * Create a new Scene function.
     * @constructor
     * @function
     * @param ctx the context of the scene.
     * @param callback (optional) the update callback function.
     */
    function Scene(ctx, callback) {
        var actors = [];
        
        /**
         * The implementation of scene function.
         * @function
         * @param {Number} frame current frame.
         */
        function scene(frame) {
            // Traverse the actors and update them.
            var i, actor;
            ctx.save();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
            for (i = 0; i < actors.length; i += 1) {
                actors[i].object(ctx);
            }
            if (callback) {
                callback(frame);
            }
        }
        
        /**
         * Get the context created with the scene.
         * @returns {object}
         */
        scene.getContext = function () {
            return ctx;
        };
        
        /**
         * Add an actor to the screen. An actor is an active(updatable/paitable) object on the scene.
         * @param {object} rect - the rectangle area of the boject.
         * @param {object} actor - (optional) the actor object.
         */
        scene.addActor =  function (rect, actor) {
            if (!actor) {
                actor = rect;
            }
            actors.push({
                rect: rect,
                object: actor
            });
            actor.scene = scene;
        };
        
        /**
         * Implementing a Array-like forEach() function.
         * @param {function} callback - the callback(rect, object) function
         */
        scene.forEach = function (callback) {
            var i;
            for (i = 0; i < actors.length; i += 1) {
                callback(actors[i].rect, actors[i].object);
            }
        };
        
        /**
         * Remove an actor. If the second parameter is absent, all objects within that area will be cleared.
         * @param rect rectangle area of the actor.
         * @param actor (optional) the actor.
         */
        scene.removeActor = function (rect, actor) {
            var i, a, b;
            for (i = 0; i < actors.length; i += 1) {
                if (isRectsInterseted(actors[i].rect, rect)) {
                    if (!actor || actor === actors[i].object) {
                        delete actors[i];
                    }
                }
            }
        };
        
        /**
         * Get an arrary of actors around the selected area.
         * @param rect the rectangle area(x,y,w,h).
         * @returns {Array}
         */
        scene.getActors = function (rect) {
            var keys = Object.keys(actors), i, results = [];
            for (i = 0; i < keys.length; i += 1) {
                if (isRectsInterseted(actors[keys[i]].rect, rect)) {
                    results.push(actors[keys[i]]);
                }
            }
            return results;
        };
                    
        return scene;
    }
    
    namespace.Scene = Scene;
    
}(window));