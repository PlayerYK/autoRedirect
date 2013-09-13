
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the letter 'file:///' is found in the tab's URL...
    if (tab && tab.url && tab.url.indexOf('file:///') > -1) {
        // ... show the page action.
//        chrome.pageAction.show(tabId);
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
//Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

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
//                chrome.tabs.create({
//                    url:chrome.extension.getURL("options.html"),
//                    index:tab.index + 1,
//                    active:true
//                },function(tab){
//
//                })
                break;
            case 1:
                chrome.tabs.update(tab.id, {url:result_list[0]+'?t='+(+new Date)});
//                chrome.tabs.update(tab.id, {url:result_list[0]});
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
    });
}


chrome.webRequest.onBeforeRequest.addListener(function(details){
    console.log('called details params');
    console.log(details);

    var isAuto = localStorage['jump_list_auto'] || 0;
    console.log('auto redirect: isAuto ' + isAuto);
    if(isAuto != 1){
        return;
    }
    var url = details.url;
    var src_list = localStorage['jump_list'].split('\n');

    if(!src_list){
        $.ajax({
            url:'http://ecd.ecc.com/kamalyu/regpattern.txt',
            type:'get',
            dataType:'text',
            success:function(r){
                localStorage['jump_list'] = r;
            }
        });
    }

    console.log(src_list);
    var j_list = [];
    $.each(src_list,function(i,v){
        var line = $.trim(v);
        console.log("line : "+line);
        if(line != ''){
            var regStr = v.split('####')[0];
            var urlStr = v.split('####')[1];
            console.log(urlStr);
            console.log(urlStr.replace(/\n/,''));
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

    console.log('result length' + result_list.length);
    console.log(result_list);
    switch (result_list.length){
        case 0:
            break;
        case 1:
//            return {redirectUrl:result_list[0]+'?t='+(+new Date)};
            return {redirectUrl:result_list[0]};
            break;
        default:
            chrome.tabs.update(details.tabId, {url:chrome.extension.getURL("chose.html")});
            setTimeout(function(){
                chrome.runtime.sendMessage({
                    type: 'urls',
                    value:result_list
                })},100);
            break;
    }
},{
    urls:["http://*/*"
        ,"https://*/*"
    ],
    types:["main_frame"]
//    types:["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
},["blocking"]);


