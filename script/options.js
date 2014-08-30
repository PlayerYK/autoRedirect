var regPatternUrl = 'http://jslab.pro/autoredirect/regpattern.txt';

function initValue() {
    var list = localStorage['jump_list'];
//    var isAuto = localStorage['jump_list_auto'] || 0;
    if(!list){
        $.ajax({
           url:regPatternUrl,
            type:'get',
            dataType:'text',
            success:function(r){
                $('#jump_list').val(r);
                localStorage['jump_list'] = $('#jump_list').val();
            }
        });
    }else{
        $('#jump_list').val(list);        
    }
    
}

function checkCircleRedirect(src_list){
    src_list = src_list.split('\n');
    var errorList = [];
    $.each(src_list,function(i,v){
        var line = $.trim(v);
        if(line != ''){
            var regStr = line.split('####')[0];
            var urlStr = line.split('####')[1];
            if(urlStr.indexOf(regStr) != -1){
                errorList.push(line);
            }
        }
    });
    return errorList;
}

$(function(){
    initValue();

    $('#save').click(function(){
        $('#msg-alert').empty().hide();
        var srcList = $('#jump_list').val();
        var errorArr = checkCircleRedirect(srcList);
        if(errorArr.length == 0){
            localStorage['jump_list'] = srcList;
            $('#tips').slideDown().text('保存成功！');
            setTimeout(function(){$('#tips').slideUp()},1000);            
        }else{
            var errAlert = '<h3>Redirect loop found!</h3><br>';
            $.each(errorArr,function(i,v){
                errAlert += v;
            });
            $('#msg-alert').html(errAlert).show();
        }
    });
});