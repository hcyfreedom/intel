/**
 * Created by Acer on 2016/9/3.
 */
// 通用函数
// 直接获取某个元素对象的方法
var g = function (id) {
    return document.getElementById(id);
}
//快速获得模板字符串的方法
var g_tpl = function (id) {
    return g("tpl_"+id).innerHTML;
}

//
var g_class = function (className) {
    return document.getElementsByClassName(className);
}
//
var getBodyW = function(){ return document.body.offsetWidth; };
var getBodyH = function(){ return document.body.offsetHeight; };
//格式化数据，原数组是一维的
// {
//     2016:{
//         8:[
//         {
//             date:
//             month:
//             year:
//             ...
//         }//一个月有若干日志
//     ]
//     9:[]
//     //一年有若干月份
// }
//     2015:{
//     }
//     //若干年
// }
var list = {};
for(var i=0;i<data.length;i++){
    var date = new Date(data[i].date);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var lunar = GetLunarDateString(date);

    //如果没有年份月份  就给它一个默认的
    if( !list[year] ){ list[year] = {}; }
    if( !list[year][month] ){ list[year][month] = []; }

    var item = data[i];
    item.lunar = lunar[0]+'<br>&nbsp;'+lunar[1];
    item.year = year;
    item.month = month;
    item.like_format = item.like < 10000 ? item.like:(item.like/10000).toFixed(1)+"万";

    list[year][month].push( item );
};

//时序菜单 HTML 生成
var html_scrubber_list = [];
var tpl_year = g_tpl('scrubber_year');
var tpl_month = g_tpl('scrubber_month');

//for in  遍历输出对象的方法，y是list里面的每个key 就是年份
for( y in list){
    var html_year = tpl_year.replace(/\{year\}/g,y);//正则表达式 全局替换year

    var html_month = [];
    for(m in list[y]){
        html_month.unshift(tpl_month.replace(/\{month\}/g,m).replace(/\{year\}/g,y))
    }

    html_year = html_year.replace(/\{list\}/g,html_month.join(''));

    html_scrubber_list.unshift(html_year);
}

g('scrubber').innerHTML = html_scrubber_list.join('')+'<a href = "javascript:;" onclick = "scroll_top(getBodyH() )">出生</a>';

//日志列表的 HTML 生成
var html_content_list = [];

var tpl_c_year = g_tpl('content_year');
var tpl_c_month = g_tpl('content_month');
var tpl_c_item = g_tpl('content_item');

for( y in list){
    var html_c_year = tpl_c_year.replace(/\{year\}/g,y);//正则表达式 全局替换year

    var html_c_month = [];
    for(m in list[y]){
        var html_c_item = [];

        var isFirst_at_month = true;
        for(i in list[y][m]){
            var item_data = list[y][m][i];

            var item_c_html = tpl_c_item
                .replace(/\{date\}/g,item_data.date)
                .replace(/\{lunar\}/g,item_data.lunar)
                .replace(/\{media\}/g,item_data.media)
                .replace(/\{intro\}/g,item_data.intro)
                .replace(/\{like_format\}/g,item_data.like_format)
                .replace(/\{like\}/g,item_data.like)
                .replace(/\{position\}/g,i%2?'right':'left')
                .replace(/\{isFirst\}/g,isFirst_at_month?'content_item_first':'')
                .replace(/\{comment\}/g,item_data.comment);
            html_c_item.push( item_c_html);
            isFirst_at_month = false;
        }

        html_c_month.unshift(tpl_c_month.replace(/\{year\}/g,y ).replace(/\{month\}/g,m ).replace(/\{list\}/g,html_c_item.join('')))
    }

    html_c_year = html_c_year.replace(/\{list\}/g,html_c_month.join(''));

    html_content_list.unshift(html_c_year);
}

g('content').innerHTML = html_content_list.join('')+'<div class="content_year" id="content_month_0_0">出生</div>';

//获得元素高度
var get_top = function (el) {
    return el.offsetTop +170;
}

//滚动页面到
var scroll_top = function (to) {
    window.scroll(0,to);
}
//年份、月份点击处理
var show_year = function (year) {
    console.log(year);
    var c_year = g('content_year_'+year);
    var top = get_top(c_year);
    scroll_top(top);
    expand_year(year,g('scrubber_year_'+year));
}

var show_month = function (year,month) {
    console.log(year,month)
    var c_month = g('content_month_'+year+'_'+month);
    var top = get_top(c_month);
    scroll_top(top);
    highlight_month(    g('scrubber_month_'+year+'_'+month));
}

//高亮处理 - 月份
var highlight_month = function (element) {
    var months = g_class('scrubber_month');
    for(var i = months.length-1;i>=0;i--){
        months[i].className = months[i].className.replace(/current/g,'');
    };
    element.className = element.className +'    current';
}

//年份点击展开、
var expand_year = function (year,element) {
    var months = g_class('scrubber_month');
    var show_month = g_class('scrubber_month_in_'+year);
    var years = g_class('scrubber_year');
    for (var i = months.length-1;i>=0;i--){
        months[i].style.display = 'none';
    };
    for ( var i = show_month.length -1;i>=0;i--){
        show_month[i].style.display = 'block';
    };
    for (var i = years.length -1;i>=0;i--){
        years[i].className = years[i].className.replace(/current/g,'');
    };
    element.className = element.className+' current';
}
//年份自动展开
var update_scrubber_year = function( top ){
    var years  = g('content').getElementsByClassName('content_year');
    var tops = [];

    for (var i = 0; i <years.length ; i++) {
        tops.push( years[i].offsetTop );
    };

    for(var i = 1; i <tops.length ; i++){

        if( top > tops[i-1] && top < tops[i] ){

            var year = years[i-1].innerHTML;
            var s_year = g('scrubber_year_'+year);
            expand_year(year,s_year);
        }
    }
}

//月份自动展开
var update_scrubber_month = function (top) {
    //日志列表中所有的月份标签
    var months = g('content').getElementsByClassName('content_month');
    var tops = [];
    for(var i =0;i<months.length;i++){
        tops.push(months[i].offsetTop);
    }
    //定位top 在窗口的哪个月份区间
    for(var i = 1;i<tops.length;i++){
        if (top > tops[i-1]&&top<tops[i]){
            var id = months[i-1].id;
            highlight_month(g(id.replace('content','scrubber')));
        }
    }
}
//滚动页面到
var scroll_top = function (to) {
    var star = document.body.scrollTop;
    fx(function (now) {
        window.scroll(0,now);
    },star,to)
}
//页面滚动处理，固定时序菜单的位置、自动展开时序菜单
window.onscroll  = function () {
    var top = document.body.scrollTop;
    var scrubber = g('scrubber');
    if (top>200){
        scrubber.style.position = 'fixed';
        scrubber.style.top = '100px';
        scrubber.style.left = (getBodyW() - 960)/2 +'px';
    }else{
        scrubber.style.position = '';
        scrubber.style.top = '';
        scrubber.style.left = '';
    }

    update_scrubber_year( top );
    update_scrubber_month( top );
}