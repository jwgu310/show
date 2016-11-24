/*--String.prototype--*/
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

/*--LOADING--*/
var loadingRender = (function () {
    var ary = [ "cube1.png", "cube2.png", "cube3.png", "cube4.png", "cube5.png", "cube6.png"];

    //->获取需要操作的元素
    var $loading = $('#loading'),
        $progressBox = $loading.find('.progressBox');
        $btnLoad = $('#btnLoad');
    var step = 0,
        total = ary.length;

    return {
        init: function () {
            $loading.css('display', 'block');

            //->循环加载所有的图片,控制进度条的宽度
            $.each(ary, function (index, item) {
                var oImg = new Image;
                oImg.src = 'img/' + item;
                oImg.onload = function () {
                    step++;
                    $progressBox.css('width', step / total * 100 + '%');
                    oImg = null;

                    //->所有图片都已经加载完毕:关闭LOADING,显示CUBE
                    if (step === total) {
                        if (page === 0) return;
                        window.setTimeout(function () {
                           $btnLoad.css('display','block');
                        }, 2000);
                    }
                    $btnLoad.click(function () {
                        $loading.css('display', 'none');
                    })

                }
            });
        }
    }
})();
//loadingRender.init();

/*--CUBE--*/

var cubeRender = (function () {
    var $cube = $('#cube'),
        $cubeBox = $cube.children('.cubeBox'),
        $cubBoxLis = $cubeBox.children('li');

    //->滑动的处理
    function isSwipe(changeX, changeY) {
        return Math.abs(changeX) > 30 || Math.abs(changeY) > 0;
    }

    function start(ev) {
        var point = ev.touches[0];
        $(this).attr({
            strX: point.clientX,
            strY: point.clientY,
            changeX: 0,
            changeY: 0
        });
    }

    function move(ev) {
        var point = ev.touches[0];
        var changeX = point.clientX - $(this).attr('strX'),
            changeY = point.clientY - $(this).attr('strY');
        $(this).attr({
            changeX: changeX,
            changeY: changeY
        });
    }

    function end(ev) {
        var changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY'));
        var rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY'));
        if (isSwipe(changeX, changeY) === false) return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $(this).attr({
            rotateX: rotateX,
            rotateY: rotateY
        }).css('transform', 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
    }

    return {
        init: function () {
            $cube.css('display', 'block');

            //->魔方区域的滑动
            $cubeBox.attr({
                rotateX: -35,
                rotateY: 45
            }).on('touchstart', start).on('touchmove', move).on('touchend', end);

            //->每一个页面的点击操作
            $cubBoxLis.singleTap(function () {
                var index = $(this).index();
                $cube.css('display', 'none');
                swiperRender.init(index);
            });
        }
    }
})();
cubeRender.init();

/*--SWIPER--*/
var swiperRender = (function () {
    var $swiper = $('#swiper'),
        $makisu = $('#makisu'),
        $return = $swiper.children('.return');

    //->change:实现每一屏幕滑动切换后控制页面的动画
    function change(example) {
        var slidesAry = example.slides,
            activeIndex = example.activeIndex;
        if (activeIndex === 0) {
            $makisu.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $makisu.makisu('open');
        } else {
            $makisu.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0
            });
            $makisu.makisu('close');
        }
        $.each(slidesAry, function (index, item) {
            if (index === activeIndex) {
                item.id = 'page' + (activeIndex + 1);
                return;
            }
            item.id = null;
        });
    }

    return {
        init: function (index) {
            $swiper.css('display', 'block');

            //->初始化SWIPER实现六个页面之间的切换
            var mySwiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                shortSwipes : true,
                onTransitionEnd: change,
                onInit: change
            });
            index = index || 0;
            mySwiper.slideTo(index, 0);

            //->给返回按钮绑定单击事件
            $return.singleTap(function () {
                $swiper.css('display', 'none');
                $('#cube').css('display', 'block');
            });
        }
    }
})();


var urlObj = window.location.href.queryURLParameter(),
    page = parseFloat(urlObj['page']);



