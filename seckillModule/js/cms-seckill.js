/**
 * Created by Administrator on 2018/2/26.
 */
function seckill($node) {
    var $dateNode = $node.find('.seckill-date'),
        $countdownNode = $node.find('.seckill-countdown'),
        $countdownItem = $node.find('.countdown-item'),
        dateArr = $node.data('seckillTime').replace(/;\s*/g, ';').split(';'),//获取秒杀时间
        goodsType = parseInt($node.data('productsType'), 10),//商品数量
        $productNode = $node.find('.seckill-products-' + goodsType),
        dateNum = dateArr.length,//秒杀天数
        spieltag,//秒杀场次
        timetamp = 0,//时间差的秒数
        newDateArr = [],
        startTimeArr = [],
        endTimeArr = [],
        currentIndex = 0,
        curKillTime = new Date().getTime();//系统当前的时间戳
    for (var i = 0; i < dateNum; i++) {
        var dateArr2 = dateArr[i].replace(/,\s*/g, ',').split(',');
        spieltag = dateArr2.length;
        for (var j = 0; j < spieltag; j++) {
            var date = dateArr2[j].replace(/\/\s*/g, '/').split('/');
            newDateArr.push(date);
        }
    }
    var init = {
        showProductType: function () {//显示的产品类型
            $node.find('.seckill-products').each(function (i, obj) {
                $(obj).data('type') === goodsType ? $(obj).addClass('current') : $(obj).hide();
            });
        },
        seckillSpieltag: function () {
            $countdownNode.each(function () {
                $(this).find('.countdown-item').eq(spieltag - 1).nextAll().hide();
            })
        },
        toggleClassCur: function (index) {
            $productNode.removeClass('current').eq(index).addClass('current');
        },
        toggleClassOver: function (index) {
            $productNode.eq(index).prevAll().find('.goods-link').addClass('seckillover');
            $productNode.eq(index).prevAll().find('.product-btn').addClass('over').html('已结束');
        },
        seckillNotStart: function (index) {//秒杀未开始

        },
        seckillOver: function (index) {//已结束

        },
        seckillBeing: function (index) {//秒杀中
            init.toggleClassCur(index);
            init.toggleClassOver(index);
            $productNode.eq(index).find('.product-btn').html('立即抢购');
            var indexInt = parseInt((index / spieltag), 10),
                indexFloat = parseInt((index % spieltag), 10);
            $countdownNode.eq(indexInt).find('.countdown-item').removeClass('current').eq(indexFloat).addClass('current').prevAll().find('.countdown').html('已结束');
            if(curKillTime >= $countdownItem.eq(index).data('start') && curKillTime <= $countdownItem.eq(index).data('end')) {
                var endTotalS = $countdownItem.eq(index).data('end');
                timetamp = parseInt((endTotalS - curKillTime) / 1000, 10);
                countdownTime(timetamp, indexInt, indexFloat);
            } else if(curKillTime < $countdownItem.eq(currentIndex * spieltag).data('start')) {
                init.toggleClassCur(currentIndex * spieltag);
                init.toggleClassOver(currentIndex * spieltag);
                var criticalVal1 = $countdownItem.eq(currentIndex * spieltag).data('start');
                timetamp = parseInt((criticalVal1 - curKillTime) / 1000, 10);
                countdownTime(timetamp);
            } else {
                $countdownNode.eq(indexInt).find('.countdown-item').eq(indexFloat).find('.countdown').html('已结束');
                $productNode.eq(index).find('.goods-link').addClass('seckillover');
                $productNode.eq(index).find('.product-btn').addClass('over').html('已结束');
                var criticalVal2 = $countdownItem.eq(index + 1).data('start');
                timetamp = parseInt((criticalVal2 - curKillTime) / 1000, 10);
                if(criticalVal2) countdownTime(timetamp);

            }

        }
    };
    function countdownTime(timetamp, indexInt, indexFloat) {//倒计时生成
        var time = window.setInterval(function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0,
                str = '';//时间默认值
            if (timetamp > 0) {
                day = Math.floor(timetamp / (60 * 60 * 24));
                hour = Math.floor(timetamp / (60 * 60)) - (day * 24);
                minute = Math.floor(timetamp / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(timetamp) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            } else {
                window.location.reload();
                clearInterval(time);
            }
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            if (day === 0) str = hour + ':' + minute + ':' + second;
            if (day > 0) str = day + '天 ' + hour + ':' + minute + ':' + second;
            $countdownNode.eq(indexInt).find('.countdown-item').eq(indexFloat).find('.countdown').html('距秒杀结束 ' + str);
            timetamp--;
        }, 1000);
    }
    function initSeckillDate() {//初始化Date显示
        if (dateNum === 1) $dateNode.hide();
        var arr1 = [], arr2 = [], arr3 = [], str = '';
        $.each(newDateArr, function (i, val) {
            if (i % spieltag === 0) {
                arr1.push(parseInt(val[0].split(/\s/)[0].split('-')[1], 10));
                arr2.push(parseInt(val[0].split(/\s/)[0].split('-')[2], 10));
                arr3.push(val[0].split(' ')[0].replace(/-\s*/g, '/'));
            }
        });
        //生成 date bar 里面的内容
        for (var i = 0; i < dateNum; i++) {
            var endDayTime = new Date(arr3[i] + ' 24:00:00').getTime();//一天的结束时间
            if (curKillTime > endDayTime) {
                currentIndex = i + 1 >= dateNum ? dateNum - 1 : i + 1;
            }
            str += '<a class="date-item" href="javascript:void(0)">' + arr1[i] + '月' + arr2[i] + '日</a>';
            $dateNode.html(str);
            $countdownNode.eq(i).find('.countdown-item').eq(0).addClass('current');
        }
        var newArr = newDateArr.slice(currentIndex * spieltag, (currentIndex + 1) * spieltag),
            pointTimeArr = [];
        $.each(newArr, function (i,arr) {
            var pointTime = arr[0].split(/\s/)[1];
            pointTimeArr.push(pointTime);

        });
        $countdownNode.eq(currentIndex).find('.countdown-item').each(function (i,o) {
            $(this).find('.countdown').html(pointTimeArr[i] + ' 开枪');
        });

        var s = new Date(newDateArr[currentIndex * spieltag][0].replace(/-\s*/g, '/')).getTime();
        if (curKillTime < s) {
            $productNode.removeClass('current').eq(currentIndex * spieltag).addClass('current');
        }
        //显示对应的第几天
        $dateNode.find('.date-item').removeClass('current').eq(currentIndex).addClass('current');
        $countdownNode.removeClass('current').eq(currentIndex).addClass('current');
        $countdownNode.eq(currentIndex).prevAll().find('.countdown').html('已结束');
    }
    function toggleTab() {//点击tab切换商品

        $dateNode.on('click', '.date-item', function () {//点击时间条
            var thisIndex = $(this).index(),
                index = $countdownNode.eq(thisIndex).find('.countdown-item.current').index();
            $(this).addClass('current').siblings().removeClass('current');
            $countdownNode.removeClass('current').eq(thisIndex).addClass('current');
            init.toggleClassCur(thisIndex * spieltag + index);
        });

        $countdownItem.on('click', function () {
            var index = $(this).index();
            $(this).addClass('current').siblings().removeClass('current');

            var thisIndex = $dateNode.find('.date-item.current').index() * spieltag + index;
            init.toggleClassCur(thisIndex);
        });
    }
    for (var g = 0, len = newDateArr.length; g < len; g++) {
        var startTime = newDateArr[g][0].replace(/-\s*/g, '/'),
            endTime = newDateArr[g][1].replace(/-\s*/g, '/'),
            startTimeS = new Date(startTime).getTime(),
            endTimeS = new Date(endTime).getTime();
        startTimeArr.push(startTimeS);
        endTimeArr.push(endTimeS);
        $countdownItem.eq(g).data('start', startTimeS).data('end', endTimeS);
    }
    //选中的元素被显示出来
    function chooseTab() {
        var startTimeArrClone = startTimeArr.slice();
        startTimeArrClone.push(curKillTime);
        startTimeArrClone.sort(function (a, b) {
            return a - b;
        });
        var curIndexStart = startTimeArrClone.indexOf(curKillTime) - 1;
        if (curIndexStart < 0) {
            init.seckillNotStart(curIndexStart);
        } else if (curIndexStart > startTimeArr.length - 1) {
            init.seckillOver(curIndexStart);
        } else {
            init.seckillBeing(curIndexStart);
        }
    }
    init.showProductType();
    initSeckillDate();
    init.seckillSpieltag();
    chooseTab();
    toggleTab();

    //平分date条和场次的宽度
    $dateNode.find('.date-item').css({ width: 100 / dateNum + '%' });
    $countdownNode.find('.countdown-item').css({ width: 100 / spieltag + '%' });
}



