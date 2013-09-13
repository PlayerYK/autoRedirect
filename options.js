function initValue() {
    var list = localStorage['jump_list'];
//    var isAuto = localStorage['jump_list_auto'] || 0;
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
}

function checkCicleRedirect(src_list){
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
        var errorArr = checkCicleRedirect(srcList);
        if(errorArr.length == 0){
            localStorage['jump_list'] = srcList;
            $('#tips').slideDown().text('保存成功！');
            setTimeout(function(){$('#tips').slideUp()},1000);            
        }else{
            var errAlert = '以下行可能存在循环重定向，请检查后再保存！<br><br>';
            $.each(errorArr,function(i,v){
                errAlert += v;
            });
            $('#msg-alert').html(errAlert).show();;
        }
    });
});