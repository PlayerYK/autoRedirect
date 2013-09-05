function initValue() {
    var list = localStorage['jump_list'];
    var isAuto = localStorage['jump_list_auto'] || 0;
    if(!list){
        $.ajax({
           url:'http://ecd.ecc.com/kamalyu/regpattern.txt',
            type:'get',
            dataType:'text',
            success:function(r){
                $('#jump_list').val(r);
                localStorage['jump_list'] = $('#jump_list').val();
            }
        });
        return;
    }
    
    $('#jump_list').val(list);
    var cb = $('#autoRedirect');
    isAuto == 1 ?cb.attr('checked','checked'):cb.removeAttr('checked');
}

$(function(){
    initValue();

    $('#save').click(function(){
        localStorage['jump_list'] = $('#jump_list').val();
        localStorage['jump_list_auto'] = $('#autoRedirect').is(':checked')?1:0;
        $('#tips').slideDown().text('保存成功！');
        setTimeout(function(){$('#tips').slideUp()},1000);
    });
});