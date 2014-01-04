/*jslint browser: true */
(function (exports) {
    'use strict';
    
    /** @namespace */
    var namespace;

    if (exports.ziq && exports.ziq.Story) {
        namespace = exports.ziq.Story;
    } else {
        throw 'ziq.Story is needed.';
    }
    
    function isRectsInterseted(r1, r2) {
        return !((r1.y + r1.h < r2.y) || (r2.y + r2.h < r1.y) || (r1.x + r1.w < r2.x) || (r2.x + r2.w < r1.x));
    }
    
    /**
     * Create a new Scene function.
     * @constructor
     * @function
     * @param {object} ctx - the context of the scene.
     */
    function Scene(ctx) {
        var actors = {};
        
        /**
         * The implementation of scene function.
         * @function
         * @param {Number} frame - current frame.
         */
        function scene(frame) {
            // Traverse the actors and update them.
            var keys = Object.keys(actors), i, actor;
            for (i = 0; i < keys.length; i += 1) {
                actor = actors[keys[i]].object;
                
                if (actor.update) {
                    actor.update(frame);
                }
                
                if (actor.paint) {
                    actor.paint(ctx);
                }
            }
        }
        
        /**
         * Get the context of the 
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
            var pos = [rect.x, rect.y, rect.w, rect.h];
            actors[pos] = {
                rect: rect,
                object: actor
            };
            actor.scene = scene;
        };
        
        /**
         * Implementing a Array-like forEach() function.
         * @param {function} callback - the callback(rect, object) function
         */
        scene.forEach = function (callback) {
            var keys = Object.keys(actors), i;
            for (i = 0; i < keys.length; i += 1) {
                callback(actors[keys[i]].rect, actors[keys[i]].object);
            }
        };
        
        /**
         * Remove an actor. If the second parameter is absent, all objects within that area will be cleared.
         * @param {object} rect - rectangle area of the actor.
         * @param {object} actor - (optional) the actor.
         */
        scene.removeActor = function (rect, actor) {
            var keys = Object.keys(actors), i, a, b;
            for (i = 0; i < keys.length; i += 1) {
                if (isRectsInterseted(actors[keys[i]].rect, rect)) {
                    if (!actor || actor === actors[keys[i]].object) {
                        delete actors[keys[i]];
                    }
                }
            }
        };
                    
        return scene;
    }
    
    namespace.Scene = Scene;
    
}(window));