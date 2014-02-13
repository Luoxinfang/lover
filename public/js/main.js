/**
 * Created by luoxinfang on 14-2-13.
 */
$(function () {
  function Heart() {
    this.$el = $('#heart');
    this.$parent = $('#love_heart');
    this.offsetX = this.$parent.width() / 2;
    this.offsetY = this.$parent.height() / 2 - 55;
    this.garden = null;
    this.heartDrawer = null;
    this.flowerDrawer = null;
    this.start();
  };
  Heart.prototype.createCanvas = function () {
    var canvas = this.$el[0];
    canvas.width = this.$parent.width();
    canvas.height = this.$parent.height();
    var gardenCtx = canvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    this.garden = new Garden(gardenCtx, canvas);
  };
  Heart.prototype.getPoint = function (angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(this.offsetX + x, this.offsetY + y);
  };
  Heart.prototype.start = function () {
    var self = this,
      angle = 10,
      heartArr = new Array();
    self.heartDrawer = setInterval(function () {
      var bloom = self.getPoint(angle);
      var draw = true;
      for (var i = 0; i < heartArr.length; i++) {
        var p = heartArr[i];
        var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
        if (distance < Garden.options.bloomRadius.max * 1.3) {
          draw = false;
          break;
        }
      }
      if (draw) {
        heartArr.push(bloom);
        self.garden.createRandomBloom(bloom[0], bloom[1]);
      }
      if (angle >= 30) {
        clearInterval(self.heartDrawer);
        clearInterval(self.flowerDrawer);
        $('#msg').myWriter();
      } else {
        angle += 0.2;
      }
    }, 50);
    self.createCanvas();
    this.flowerDrawer = setInterval(function () {
      heart.garden.render();
    }, Garden.options.growSpeed);
  };
  var heart = new Heart();

  $.fn.myWriter = function () {
    this.each(function () {
      var $el = $(this),
        str = $el.html(),
        progress = 0;
      $el.html('').show();
      var timer = setInterval(function () {
        var current = str.substr(progress, 1);
        if (current == '<') {
          progress = str.indexOf('>', progress) + 1;
        }else if(current == '&'){
          progress = str.indexOf(';', progress) + 1;
        } else {
          progress++;
        }
        $el.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
        if (progress >= str.length) {
          clearInterval(timer);
        }
      }, 75);
    });
    return this;
  };
});