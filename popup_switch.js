$(function(){
    var isAuto = localStorage['jump_list_auto'] || 0;
    console.log('is auto '+isAuto);
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
        }else{
            localStorage['jump_list_auto'] = 0;
        }
    })
});