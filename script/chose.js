$(function(){
    $('#list').delegate('a','click',function(){
        chrome.tabs.update(null, {url:$(this).attr('href')});
    })
});
function genUrlSelect(name, value){
    var liStr = '';
    $.each(value,function(i,v){
        liStr += '<li><a href="'+v+'">'+v+'?t='+(+new Date)+'</a></li>';
    });
    $('#list').html(liStr);
}

chrome.runtime.onMessage.addListener(function(request, sender, callback){
    if(request.type = 'content_script_urls'){
        callback(genUrlSelect(request.name,request.value));
    }
});