var url = 'file:///D:/dev/paipai_b2b2c_rep/static/css/404.css';
var src_list = ["v5/####http://static.paipaiimg.com/v5/", "paipai/static/####http://static.paipaiimg.com/", "paipai/paipai_b2b2c_rep/static_proj/trunk/static/####http://static.gtimg.com/", "paipai_b2b2c_rep/static/####http://static.gtimg.com/", "static/####http://static.paipaiimg.com/", "paipai_b2b2c_rep/*static/####http://static.gtimg.com/"];
var j_list = [];
$.each(src_list,function(i,v){
    if($.trim(v) != ''){
        var regStr = v.split('####')[0];
        var urlStr = v.split('####')[1];
        j_list.push({
            'regStr':regStr.replace(/\//g,'\\/').replace(/\*/g,'\.\*\?'),
            'urlStr':urlStr
        });
    }
});

var result_list = [];
$.each(j_list,function(k,v){
    var reg = new RegExp(".*"+ v.regStr,'i');
    if (reg.test(url)){
        var onlineUrl = url.replace(reg, v.urlStr);  
        if($.inArray(onlineUrl,result_list) == -1){
            result_list.push(onlineUrl);
        }
    }
});