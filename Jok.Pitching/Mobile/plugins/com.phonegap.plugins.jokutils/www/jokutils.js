/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright 2012, Andrew Lunny, Adobe Systems
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2011, IBM Corporation
 * (c) 2010 Jesse MacFadyen, Nitobi
 */

var JokUtils = (function (gap) {
    function isFunction(f) {
        return typeof f === "function";
    }

    // placeholder and constants
    function JokUtils() {}


    /**
     * Set screen orientation
     */
    JokUtils.screenOrientation = function(str, success, fail) {
        var args = {};
        args.key = str;
        gap.exec(success, fail, "ScreenOrientation", "set", [args]);
    };
    
    
    /**
     * Play audio fx, without any delay
     */
    JokUtils.playAudio = function(url, success, fail) {
        gap.exec("SoundPlug.play", url);
    };
    
    
    
    /**
     * Load JokUtils
     */
    gap.addConstructor(function () {
        if (gap.addPlugin) {
            gap.addPlugin("jokUtils", JokUtils);
        } else {
            if (!window.plugins) {
                window.plugins = {};
            }

            window.plugins.jokUtils = JokUtils;
        }
    });

    return JokUtils;
})(window.cordova || window.Cordova || window.PhoneGap);
