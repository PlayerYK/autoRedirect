
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the letter 'file:///' is found in the tab's URL...
    if (tab.url.indexOf('file:///') > -1) {
        // ... show the page action.
        chrome.pageAction.show(tabId);
        var jump_list = localStorage['jump_list'];
        if(!jump_list){
            $.ajax({
                url:'http://ecd.ecc.com/kamalyu/regpattern.txt',
                type:'get',
                dataType:'text',
                success:function(r){
                    localStorage['jump_list'] = r;
                }
            });
        }
        var isAuto = localStorage['jump_list_auto'] || 0;
//        console.log(isAuto);
        if(isAuto == 1){
//            console.log('auto start');
            startProcess(tab);
        }
    }
};
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);


chrome.pageAction.onClicked.addListener(function(tab){startProcess(tab);});

function startProcess(tab){
    chrome.tabs.getSelected(function(tab){
        var url = encodeURI(tab.url);
        var src_list = localStorage['jump_list'].split('\n');
        var j_list = [];
        $.each(src_list,function(i,v){
            var line = $.trim(v);
            if(line != ''){
                var regStr = v.split('####')[0];
                var urlStr = v.split('####')[1];
                j_list.push({
                    'regStr':regStr.replace(/\//g,'\\/').replace(/\*/g,'\.\*\?').replace(/\n/,'').replace(/\r/,''),
                    'urlStr':urlStr.replace(/\n/,'').replace(/\r/,'')
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

        switch (result_list.length){
            case 0:
                chrome.tabs.create({
                    url:chrome.extension.getURL("options.html"),
                    index:tab.index + 1,
                    active:true
                },function(tab){
                    
                })
                break;
            case 1:
                chrome.tabs.update(tab.id, {url:result_list[0]+'?t='+(+new Date)});
                break;
            default:
                chrome.tabs.update(tab.id, {url:chrome.extension.getURL("chose.html")});
                setTimeout(function(){
                    chrome.runtime.sendMessage({
                        type: 'urls',
                        value:result_list
                    })},100);
                break;
        }

////      update
//        chrome.tabs.update(tab.id, {url:"http://www.baidu.com"});
//        chrome.tabs.update(tab.id, {url:chrome.extension.getURL("chose.html")});

//        setTimeout(function(){
//            sending msg
//            chrome.runtime.sendMessage({
//                type: 'urls',
//                value:result_list
////            value:['http://www.google.com','http://www.baidu.com']
//            })},100);

    });
}




