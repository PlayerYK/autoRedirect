$(function(){
    var isAuto = localStorage['jump_list_auto'] || 0;
    if(isAuto == 1){
        $('#enable').attr('checked','checked');
        $('#disable').removeAttr('checked');
    }else{
        $('#disable').attr('checked','checked');
        $('#enable').removeAttr('checked');
    }
    
    $('input[name="status"]').click(function(){
        if($('input:checked').val() == 1){
            localStorage['jump_list_auto'] = 1;
            chrome.browserAction.setIcon({path:"images/icon_19_bold.png"});
        }else{
            localStorage['jump_list_auto'] = 0;
            chrome.browserAction.setIcon({path:"images/icon_19.png"});
        }
        setTimeout(function(){window.close();},10);
    })
});