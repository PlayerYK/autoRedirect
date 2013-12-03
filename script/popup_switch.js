$(function(){
    var isAuto = localStorage['jump_list_auto'] || 0;
    var $slider = $('#slideThree');
    if(isAuto == 1){
        $slider.attr('checked','checked');
    }else{
        $slider.removeAttr('checked');
    }

    $slider.click(function(){
        if($slider.is(':checked')){
            localStorage['jump_list_auto'] = 1;
            chrome.browserAction.setIcon({path:"images/icon_19_bold.png"});
        }else{
            localStorage['jump_list_auto'] = 0;
            chrome.browserAction.setIcon({path:"images/icon_19.png"});
        }
//        setTimeout(function(){window.close();},500);
    })
});