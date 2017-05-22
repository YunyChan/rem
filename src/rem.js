;(function (oWin, oDoc) {
    var oHtml = oDoc.documentElement;
    var tid;
    var oREMMeta = oDoc.getElementById("remMeta");
    var maxWidth = oREMMeta.getAttribute('data-max-width') - 0; // 视觉稿宽度
    var minWidth = (oREMMeta.getAttribute('data-min-width') || 1) - 0; // 屏幕要适配的最小分辨率宽度
    var maxFontSize = oREMMeta.getAttribute('data-max-font') - 0; // 视觉稿宽度所对应根字号基值
    var step = maxWidth / maxFontSize;
    var minFontSize = Math.floor(minWidth / step);
    var DPR = setDPR();
    var scale = setViewPort();

    oWin.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(setRootFontSize, 300);
    }, false);
    setRootFontSize();

    function setDPR() {
        var nDPR = 1;
        var isIPhone = oWin.navigator.appVersion.match(/iphone/gi);
        if(isIPhone){
            nDPR = Math.ceil(oWin.devicePixelRatio) || 1;
            if(nDPR > 3){
                nDPR = 3;
            }
        }
        oHtml.setAttribute('data-dpr', nDPR);
        return nDPR;
    }

    function setViewPort() {
        var nScale = (1 / DPR);
        var sContent = 'width=device-width, initial-scale=' + nScale + ', maximum-scale=' + nScale + ', minimum-scale=' + nScale + ', user-scalable=no';

        var oMeta = oDoc.getElementById("viewPortMeta");
        if(oMeta){
            oMeta.setAttribute('content', sContent);
        }else{
            oMeta = oDoc.createElement('meta');
            oMeta.setAttribute('id', 'viewPortMeta');
            oMeta.setAttribute('name', 'viewport');
            oMeta.setAttribute('content', sContent);
            appendDom(oMeta);
        }
        return nScale;
    }

    function setRootFontSize(){
        var clientPhysicalWidth = oHtml.getBoundingClientRect().width;
        var clientVirtualWidth = clientPhysicalWidth * scale;

        var rootFontSize = 0;
        if(clientVirtualWidth >= maxWidth){
            // rootFontSize = Math.floor(clientVirtualWidth / step);
            rootFontSize = maxFontSize;
        }else if(clientVirtualWidth <= minWidth){
            rootFontSize = minFontSize;
        }else{
            rootFontSize = Math.floor(clientVirtualWidth / step);
        }
        rootFontSize *= DPR;

        var oStyle = oDoc.getElementById("rootFontSize");
        if(oStyle){
            oStyle.innerHTML = "html{font-size: " + rootFontSize + "px !important;}";
        }else{
            oStyle = oDoc.createElement('style');
            oStyle.setAttribute('id', 'rootFontSize');
            oStyle.innerHTML = "html{font-size: " + rootFontSize + "px !important;}";
            appendDom(oStyle);
        }
    }

    function loadCSS() {
        var aMeta = oHtml.querySelectorAll('meta[name="remCSS"]');
        var nTargetDPR = DPR > maxDPR ? maxDPR : DPR;
        var oMeta = null;
        var sSrc = '';
        var sTargetSrc = '';
        var oLink = null;
        for(var cnt = 0, length = aMeta.length; cnt < length; cnt ++){
            oMeta = aMeta[cnt];
            sSrc = oMeta.getAttribute('data-src');
            sTargetSrc = isDev ? sSrc : sSrc.split('.css')[0] + '@' + nTargetDPR + '.css';
            oLink = oDoc.createElement('link');
            oLink.setAttribute('rel', 'stylesheet');
            oLink.setAttribute('href', sTargetSrc);
            appendDom(oLink);
        }
    }

    function appendDom(oDom) {
        var oHead = oHtml.getElementsByTagName('head')[0];
        if(oHead){
            oHead.appendChild(oDom);
        }
    }
})(window, document);