/**
 * Created by Acer on 2016/9/8.
 */
$(document).ready(function () {
    $("#bt2").click(function () {
        $(".label").stop(true, false).animate({"top": 220}, 300);
    });
    $("#bt3").click(function () {
        $(".label").stop(true, false).animate({"top": 269}, 300);
    })
    $("#bt4").click(function () {
        $(".label").stop(true, false).animate({"top": 318}, 300);
    })
    $("#bt1").click(function () {
        $(".label").stop(true, false).animate({"top": 171}, 300);
    })


    $(".comment").click(function () {
     $("#ds-reset, #ds-related-reads").toggle();

    })

    // $(".comment").click(function () {
    //     $(this).parent(".container").css("height",575);
    //     $(this).parent(".bottom").siblings("#ds-reset, #ds-related-reads ").css("display","block");
    // })

    $(".more").click(function () {
        $(".announce").toggle();
        $(".input-ann").toggle();
    })
    $(".input-ann").click(function () {
        $(".announce").hide();
        $(".input-ann").hide();
    })


})


// $(function() {
//
//     var page = 1;
//     var isFetch = false;
//
//
//     $('.load-next-page').onclick = function() {
//         var self = this;
//         isFetch = true;
//         $.ajax({
//             method: 'GET',
//             dataType: 'json',
//             data: {page: page},
//             url: '???',
//             success: function(data){
//                 page+=1;
//                 isFetch = false;
//
//                 //这里根据获取到的数据渲染页面
//
//             },
//             error: function() {
//                 self.text('加载失败，请重新加载');
//             }
//         })
//     }
// })
