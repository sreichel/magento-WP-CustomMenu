function wpShowMenuPopup(objMenu, event, popupId)
{
    if (typeof wpCustommenuTimerHide[popupId] != 'undefined') clearTimeout(wpCustommenuTimerHide[popupId]);
    objMenu = $(objMenu.id); var popup = $(popupId); if (!popup) return;
    if (!!wpActiveMenu) {
        wpHideMenuPopup(objMenu, event, wpActiveMenu.popupId, wpActiveMenu.menuId);
    }
    wpActiveMenu = {menuId: objMenu.id, popupId: popupId};
    if (!objMenu.hasClassName('active')) {
        wpCustommenuTimerShow[popupId] = setTimeout(function() {
            objMenu.addClassName('active');
            var popupWidth = CUSTOMMENU_POPUP_WIDTH;
            if (!popupWidth) popupWidth = popup.getWidth();
            var pos = wpPopupPos(objMenu, popupWidth);
            popup.style.top = pos.top + 'px';
            popup.style.left = pos.left + 'px';
            wpSetPopupZIndex(popup);
            if (CUSTOMMENU_POPUP_WIDTH)
                popup.style.width = CUSTOMMENU_POPUP_WIDTH + 'px';
            // --- Static Block width ---
            var block2 = $(popupId).select('div.block2');
            if (typeof block2[0] != 'undefined') {
                var wStart = block2[0].id.indexOf('_w');
                if (wStart > -1) {
                    var w = block2[0].id.substr(wStart+2);
                } else {
                    var w = 0;
                    $(popupId).select('div.block1 div.column').each(function(item) {
                        w += $(item).getWidth();
                    });
                }
                if (w) block2[0].style.width = w + 'px';
            }
            // --- change href ---
            var wpMenuAnchor = $(objMenu.select('a')[0]);
            wpChangeTopMenuHref(wpMenuAnchor);
            // --- show popup ---
            popup.style.display = 'block';
            //jQuery('#' + popupId).stop(true, true).fadeIn();
        }, CUSTOMMENU_POPUP_DELAY_BEFORE_DISPLAYING);
    }
}

function wpHideMenuPopup(element, event, popupId, menuId)
{
    if (typeof wpCustommenuTimerShow[popupId] != 'undefined') clearTimeout(wpCustommenuTimerShow[popupId]);
    var element = $(element); var objMenu = $(menuId) ;var popup = $(popupId); if (!popup) return;
    var wpCurrentMouseTarget = getCurrentMouseTarget(event);
    if (!!wpCurrentMouseTarget) {
        if (!wpIsChildOf(element, wpCurrentMouseTarget) && element != wpCurrentMouseTarget) {
            if (!wpIsChildOf(popup, wpCurrentMouseTarget) && popup != wpCurrentMouseTarget) {
                if (objMenu.hasClassName('active')) {
                    wpCustommenuTimerHide[popupId] = setTimeout(function() {
                        objMenu.removeClassName('active');
                        // --- change href ---
                        var wpMenuAnchor = $(objMenu.select('a')[0]);
                        wpChangeTopMenuHref(wpMenuAnchor);
                        // --- hide popup ---
                        popup.style.display = 'none';
                        //jQuery('#' + popupId).stop(true, true).fadeOut();
                    }, CUSTOMMENU_POPUP_DELAY_BEFORE_HIDING);
                }
            }
        }
    }
}

function wpPopupOver(element, event, popupId, menuId)
{
    if (typeof wpCustommenuTimerHide[popupId] != 'undefined') clearTimeout(wpCustommenuTimerHide[popupId]);
}

function wpPopupPos(objMenu, w)
{
    var pos = objMenu.cumulativeOffset();
    var wraper = $('custommenu');
    var posWraper = wraper.cumulativeOffset();
    var xTop = pos.top - posWraper.top
    if (CUSTOMMENU_POPUP_TOP_OFFSET) {
        xTop += CUSTOMMENU_POPUP_TOP_OFFSET;
    } else {
        xTop += objMenu.getHeight();
    }
    var res = {'top': xTop};
    if (CUSTOMMENU_RTL_MODE) {
        var xLeft = pos.left - posWraper.left - w + objMenu.getWidth();
        if (xLeft < 0) xLeft = 0;
        res.left = xLeft;
    } else {
        var wWraper = wraper.getWidth();
        var xLeft = pos.left - posWraper.left;
        if ((xLeft + w) > wWraper) xLeft = wWraper - w;
        if (xLeft < 0) xLeft = 0;
        res.left = xLeft;
    }
    return res;
}

function wpChangeTopMenuHref(wpMenuAnchor)
{
    var wpValue = wpMenuAnchor.href;
    wpMenuAnchor.href = wpMenuAnchor.rel;
    wpMenuAnchor.rel = wpValue;
}

function wpIsChildOf(parent, child)
{
    if (child != null) {
        while (child.parentNode) {
            if ((child = child.parentNode) == parent) {
                return true;
            }
        }
    }
    return false;
}

function wpSetPopupZIndex(popup)
{
    $$('.wp-custom-menu-popup').each(function(item){
       item.style.zIndex = '9999';
    });
    popup.style.zIndex = '10000';
}

function getCurrentMouseTarget(xEvent)
{
    var wpCurrentMouseTarget = null;
    if (xEvent.toElement) {
        wpCurrentMouseTarget = xEvent.toElement;
    } else if (xEvent.relatedTarget) {
        wpCurrentMouseTarget = xEvent.relatedTarget;
    }
    return wpCurrentMouseTarget;
}
/*
Event.observe(document, 'click', function (event) {
    if (!!wpActiveMenu) {
        var element = event.element();
        if (!!element) {
            var menuObj = $(wpActiveMenu.menuId);
            var popupObj = $(wpActiveMenu.popupId);
            if (!wpIsChildOf(menuObj, element) && menuObj != element) {
                if (!wpIsChildOf(popupObj, element) && popupObj != element) {
                    wpHideMenuPopup(element, event, wpActiveMenu.popupId, wpActiveMenu.menuId);
                    wpActiveMenu = null;
                }
            }
        }
    }
});
*/
