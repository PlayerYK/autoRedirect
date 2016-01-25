var regPatternUrl = 'http://jslab.pro/autoredirect/regpattern.txt';

// get 
var isAuto = localStorage['jump_list_auto'] || 0;
if(isAuto == 1){
    chrome.browserAction.setIcon({path:"images/icon_19_bold.png"});
}else{
    chrome.browserAction.setIcon({path:"images/icon_19.png"});
}


// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the letter 'file:///' is found in the tab's URL...
    if (tab && tab.url && tab.url.indexOf('file:///') > -1) {
        // ...check options and start jump.
        var jump_list = localStorage['jump_list'];
        if(!jump_list){
            $.ajax({
                url:regPatternUrl,
                type:'get',
                dataType:'text',
                success:function(r){
                    localStorage['jump_list'] = r;
                }
            });
        }
        isAuto = localStorage['jump_list_auto'] || 0;
        if(isAuto == 1){
            startProcess(tab);
        }
    }
};
//Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function startProcess(tab){
    chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT},function(tabs){
        var tab = tabs[0];
        var url = encodeURI(tab.url);
        debugLog('local tab url ' + url,2);
        var src_list = localStorage['jump_list'].split('\n');
        var j_list = [];
        $.each(src_list,function(i,v){
            var line = $.trim(v);
            if(line != ''){
                var regStr = line.split('####')[0];
                var urlStr = line.split('####')[1];
                j_list.push({
                    'regStr':regStr.replace(/\//g,'\\/').replace(/\?/g,'\\?').replace(/\*/g,'\.\*\?').replace(/\n/,'').replace(/\r/,''),
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
        debugLog(result_list,2);
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
    debugLog('called details params');
    debugLog(details);
    debugLog('online tab url '+details.url,2);

    isAuto = localStorage['jump_list_auto'] || 0;
    debugLog('auto redirect: isAuto ' + isAuto);
    if(isAuto != 1){
        return;
    }
    var url = details.url;
    var src_list = localStorage['jump_list'].split('\n');

    if(!src_list){
        $.ajax({
            url:regPatternUrl,
            type:'get',
            dataType:'text',
            success:function(r){
                localStorage['jump_list'] = r;
            }
        });
    }

    debugLog(src_list);
    var j_list = [];
    $.each(src_list,function(i,v){
        var line = $.trim(v);
        debugLog("line : "+line);
        if(line != ''){
            var regStr = line.split('####')[0];
            var urlStr = line.split('####')[1];
            j_list.push({
                'regStr':regStr.replace(/\//g,'\\/').replace(/\?/g,'\\?').replace(/\*/g,'\.\*\?').replace(/\n/,'').replace(/\r/,''),
                'urlStr':urlStr.replace(/\n/,'').replace(/\r/,'') || ""
            });
        }
    });

    var result_list = [];
    $.each(j_list,function(k,v){
        var reg = new RegExp(".*"+ v.regStr,'i');
        debugLog(reg);
        debugLog(url);
        debugLog(reg.test(url));
        if (reg.test(url)){
            var onlineUrl = url.replace(reg, v.urlStr);
            onlineUrl = decodeURIComponent(onlineUrl);
            if($.inArray(onlineUrl,result_list) == -1){
                result_list.push(onlineUrl);
            }
        }
    });

    if(result_list.length){
        debugLog('result length ' + result_list.length,2);
        debugLog(result_list,2);
    }else{
        debugLog('no redirect',2);
    }
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

var show_debug_level = 2;
function debugLog(obj,level){
    level = level || 0;
    if(level >= show_debug_level){
        console.log(obj);
    }
}
