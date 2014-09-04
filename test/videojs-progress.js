(function() {
  "use strict";
  var $, evoClass, initTimepoints, initTooltip, vjsProgress;

  $ = jQuery;

  evoClass = function(className, hasDot) {
    return "" + (hasDot ? "." : "") + "vjs-" + className + "--evo";
  };

  initTimepoints = function(player, pointsData) {
    var TIMEPOINT_ID_DELIMITER, createTimepoint, timepoints, video;
    if (!$.isArray(pointsData)) {
      return false;
    }
    video = $(player.el());
    TIMEPOINT_ID_DELIMITER = "-vjs-timepoint-";
    timepoints = [];
    createTimepoint = function(sec, text) {
      var pt;
      pt = $("<div />", {
        "id": "" + (video.attr("id")) + TIMEPOINT_ID_DELIMITER + (timepoints.length + 1),
        "class": evoClass("progress-point")
      });
      timepoints.push({
        sec: sec,
        text: text
      });
      return pt.css("left", "" + ((sec / player.duration()) * 100) + "%");
    };
    player.on("loadedmetadata", function() {
      var container, duration;
      duration = player.duration();
      container = $("<div />", {
        "class": evoClass("progress-points")
      });
      $.each(pointsData, function(idx, pt) {
        var _ref;
        if ((0 <= (_ref = Number(pt.time)) && _ref <= duration)) {
          return container.append(createTimepoint(pt.time, pt.text));
        }
      });
      player.controlBar.progressControl.el().appendChild(container.get(0));
      return $(evoClass("progress-point", true)).on("click", function() {
        player.currentTime(timepoints[this.id.split(TIMEPOINT_ID_DELIMITER)[1] - 1].sec);
        return false;
      });
    });
    return true;
  };

  initTooltip = function(player) {
    return player.on("loadedmetadata", function() {
      var duration, progress;
      progress = player.controlBar.progressControl;
      duration = player.duration();
      return $(progress.el()).on("mousemove", function(event) {
        var bar, currentPos, offsetLeft, seekBar;
        bar = $(progress.el());
        offsetLeft = bar.offset().left;
        currentPos = event.clientX;
        console.log((currentPos - offsetLeft) / bar.width() * duration);
        seekBar = progress.seekBar;
      });
    });
  };

  vjsProgress = function(options) {
    initTimepoints(this, options.timepoints);
    initTooltip(this);
  };

  videojs.plugin("progress", vjsProgress);

}).call(this);
