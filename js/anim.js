/**
 * Created by Arman on 5/5/2016.
 */

(function(kangarooBigger, kangarooSmaller) {
    // key mapping
    var keys = {
            JUMP: 1,
            RIGHT: 2,
            LEFT: 0
            },
        numberOfKangaroos = 0,
        viewWidth = 0,
        viewHeight = 0,
        prevViewWidth = 0,
        prevViewHeight = 0,
        max = 110,
        min = 2,
        arrKangaroo = [];

    document.body.style.overflow = 'hidden';

    window.addEventListener('resize', function updateView() {
        var win = window,
            doc = document,
            el = doc.documentElement,
            g = doc.getElementsByTagName('body')[0];

        viewWidth = win.innerWidth || el.clientWidth || g.clientWidth;
        viewHeight = win.innerHeight || el.clientHeight || g.clientHeight;
        for (var index in arrKangaroo) {
          arrKangaroo[index].x = ((arrKangaroo[index].x * viewWidth) / (prevViewWidth || viewWidth));
          arrKangaroo[index].y = ((arrKangaroo[index].y * viewHeight) / (prevViewHeight || viewHeight));
        }
        prevViewWidth = viewWidth;
        prevViewHeight = viewHeight;
        return updateView
    }());

    /**************** Kangaroo Constructor ****************/
    var Kangaroo = function(el, jumping, x, y, vx, vy) {
        this.el = el;
        this.isJumping = jumping || false;
        this.x = x || 600;
        this.y = y || 0;
        this.vx = vx || 0;
        this.vy = vy || 0;
        this.pressed = [];
        this.moveX = 2;
        this.flip = false;
        this.degrees = 0;
        this.speed = 0;
        this.clicked = false;
        this.loopInterval = 33;
        arguments.callee.instances = ++arguments.callee.instances || 1;
    };

    /**************** Creating static method createNewKangaroo****************/
    Kangaroo.createNewKangaroo = function (kangaroo, jumping, x, y, vx, vy) {
        new Kangaroo(kangaroo, jumping, x, y, vx, vy).init();
        console.log('Total Number of Kangaroos Created:', this.instances);
        return this;
    };

    Kangaroo.prototype = {
        init: function(){
            this.createKangaroo()
                .setPosition()
                .bindEvent()
                .jump()
                .loop();
        },
        loop: function() {
            this.updateStatus()
                .render();
            this.loopOut = setTimeout(this.loop.bind(this), this.loopInterval);
            return this;
        },
        updateStatus: function() {
            /**************** vertical moves ****************/
            if (!this.isJumping && this.pressed[keys.JUMP]) {
                this.isJumping = true;
                this.changeSize();
                this.vy = Math.floor(Math.random()*(((max * viewHeight) / 643) - min + 1) + min);
                this.speed = Math.floor(Math.random()*(22 - 8 + 1) + 8);
                if(Math.floor(Math.random()*(2)) === 0) {
                  this.moveLeft();
                }else {
                  this.moveRight();
                }
                if(Math.floor(Math.random()*(2)) === 0) {
                    this.flip = true;
                }else {
                    this.flip = false;
                }
            }
            if (this.isJumping) {
                if(this.flip) this.degrees += this.speed;
                this.y += this.vy;
                if (this.vy >= 0 && this.vy <= 0.5) {
                    this.vy = -0.5;
                }
                if (this.vy > 0) {
                    this.vy /= 1.25;
                }
                else {
                    this.vy *= 1.25;
                }
                if (this.y <= 0) {
                    this.isJumping = false;
                    this.y = 0;
                    this.vy = 0;
                    this.degrees = 0;
                }
            }

            /**************** horizontal moves ****************/
            if (this.pressed[keys.RIGHT]) {
                this.vx = this.moveX;
            }
            else if (this.pressed[keys.LEFT]) {
                this.vx = -this.moveX;
            }
            else {
                this.vx = 0;
            }
            this.x += this.vx;
            if(this.x <= 0) {
                this.x += this.moveX;
                this.moveRight();
            }else if(this.x >= viewWidth - 40) {
                this.x -= this.moveX;
                this.moveLeft();
            }
            return this;
        },
        render: function() {
            this.el.style.bottom = this.y + 'px';
            this.el.style.left = this.x + 'px';
            if(this.flip) this.rotate(this.el, this.degrees);
            return this;
        },
        jump: function() {
          this.pressed[keys.JUMP] = true;
            return this;
        },
        rotate: function(el, degrees) {
            if(this.pressed[0]) degrees = -degrees;
            if(navigator.userAgent.match("Chrome")){
                el.style.WebkitTransform = "rotate(" + degrees + "deg)";
            } else if(navigator.userAgent.match("Firefox")){
                el.style.MozTransform = "rotate(" + degrees + "deg)";
            } else if(navigator.userAgent.match("MSIE")){
                el.style.msTransform = "rotate(" + degrees + "deg)";
            } else if(navigator.userAgent.match("Opera")){
                el.style.OTransform = "rotate(" + degrees + "deg)";
            } else {
                el.style.transform = "rotate(" + degrees + "deg)";
            }
        },
        moveRight: function() {
            this.pressed[0] = false;
            this.pressed[2] = true;
        },
        moveLeft: function() {
            this.pressed[2] = false;
            this.pressed[0] = true;
        },
        changeSize: function() {
            if(Math.floor(Math.random()*(3)) === 0) {
                this.el.src = kangarooBigger;
            }else {
                this.el.src = kangarooSmaller;
            }
        },
        createKangaroo: function() {
            var doc = document,
                el = doc.createElement('img');
            el.setAttribute('src', this.el);
            el.setAttribute('id', 'Kangaroo_' + ++numberOfKangaroos);
            doc.body.appendChild(el);
            this.el = doc.getElementById('Kangaroo_' + numberOfKangaroos);
            arrKangaroo[numberOfKangaroos - 1] = this;
            return this;
        },
        setPosition: function() {
            this.el.style.position = 'absolute';
            this.el.style.bottom = '0px';
            this.el.style.cursor = 'pointer';
            return this;
        },
        attachWithMouse: function(e) {
            var obj = _kangaroo.el;
            _kangaroo.x = e.clientX - 20;
            _kangaroo.y = viewHeight - e.clientY - 10;
            obj.style.left = e.clientX - 20 + "px";
            obj.style.bottom = viewHeight - e.clientY - 10 + "px";
        },
        bindEvent: function() {
          var _self = this;
          this.el.addEventListener('click', function(e) {
              //_self.vy = (viewHeight - _self.y)/6;
              window._kangaroo = _self;
              if(!_self.clicked) {
                  _self.clicked = true;
                  clearTimeout(_self.loopOut);
                  window.addEventListener("mousemove", _self.attachWithMouse);
              }else {
                  _self.clicked = false;
                  window.removeEventListener("mousemove", _self.attachWithMouse);
                  _self.loop();
              }
          });
          return this;
        }
    };

    Kangaroo
        .createNewKangaroo(kangarooSmaller, false, viewWidth/6.83, 0, 0, 0)
        .createNewKangaroo(kangarooBigger, false, viewWidth/3.415, 0, 0, 0)
        .createNewKangaroo(kangarooSmaller, false, viewWidth/2.28, 0, 0, 0)
        .createNewKangaroo(kangarooSmaller, false, viewWidth/1.71, 0, 0, 0)
        .createNewKangaroo(kangarooBigger, false, viewWidth/1.37, 0, 0, 0)
        .createNewKangaroo(kangarooSmaller, false, viewWidth/1.14, 0, 0, 0);

    // new Kangaroo(kangarooSmaller, false, viewWidth/6.83, 0, 0, 0).init();
    // new Kangaroo(kangarooBigger, false, viewWidth/3.415, 0, 0, 0).init();
    // new Kangaroo(kangarooSmaller, false, viewWidth/2.28, 0, 0, 0).init();
    // new Kangaroo(kangarooSmaller, false, viewWidth/1.71, 0, 0, 0).init();
    // new Kangaroo(kangarooBigger, false, viewWidth/1.37, 0, 0, 0).init();
    // new Kangaroo(kangarooSmaller, false, viewWidth/1.14, 0, 0, 0).init();

}('img/kangaroo_bigger.png', 'img/kangaroo_smaller.png'));
