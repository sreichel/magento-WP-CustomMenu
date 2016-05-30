var wpMenuLoaded = false;
var wpMobileMenuLoaded = false;

function wpInitPopupContent()
{
    if (wpMenuLoaded) return;
    var xMenu = $('custommenu');
    if (typeof wpPopupMenuContent != 'undefined') xMenu.innerHTML = wpPopupMenuContent + xMenu.innerHTML;
    wpMenuLoaded = true;
}

function wpInitMobileMenuContent()
{
    if (wpMobileMenuLoaded) return;
    var xMenu = $('menu-content');
    if (typeof wpMobileMenuContent != 'undefined') xMenu.innerHTML = wpMobileMenuContent;
    wpMobileMenuLoaded = true;
}

function wpShowMenuPopup(objMenu, event, popupId)
{
    wpInitPopupContent();
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
            wpChangeTopMenuHref(wpMenuAnchor, true);
            // --- show popup ---
            if (typeof jQuery == 'undefined') {
                popup.style.display = 'block';
            } else {
                jQuery('#' + popupId).stop(true, true).fadeIn();
            }
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
                        wpChangeTopMenuHref(wpMenuAnchor, false);
                        // --- hide popup ---
                        if (typeof jQuery == 'undefined') {
                            popup.style.display = 'none';
                        } else {
                            jQuery('#' + popupId).stop(true, true).fadeOut();
                        }
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

function wpChangeTopMenuHref(wpMenuAnchor, state)
{
    if (state) {
        wpMenuAnchor.href = wpMenuAnchor.rel;
    } else {
        wpMenuAnchor.href = 'javascript:void(0);';
    }
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

function getCurrentMouseTargetMobile(xEvent)
{
    if (!xEvent) var xEvent = window.event;
    var wpCurrentMouseTarget = null;
    if (xEvent.target) wpCurrentMouseTarget = xEvent.target;
        else if (xEvent.srcElement) wpCurrentMouseTarget = xEvent.srcElement;
    if (wpCurrentMouseTarget.nodeType == 3) // defeat Safari bug
        wpCurrentMouseTarget = wpCurrentMouseTarget.parentNode;
    return wpCurrentMouseTarget;
}

/* Mobile */
function wpMenuButtonToggle()
{
    $('menu-content').toggle();
}

function wpGetMobileSubMenuLevel(id)
{
    var rel = $(id).readAttribute('rel');
    return parseInt(rel.replace('level', ''));
}

function wpSubMenuToggle(obj, activeMenuId, activeSubMenuId)
{
    var currLevel = wpGetMobileSubMenuLevel(activeSubMenuId);
    // --- hide submenus ---
    $$('.wp-custom-menu-submenu').each(function(item) {
        if (item.id == activeSubMenuId) return;
        var xLevel = wpGetMobileSubMenuLevel(item.id);
        if (xLevel >= currLevel) {
            $(item).hide();
        }
    });
    // --- reset button state ---
    $('custommenu-mobile').select('span.button').each(function(xItem) {
        var subMenuId = $(xItem).readAttribute('rel');
        if (!$(subMenuId).visible()) {
            $(xItem).removeClassName('open');
        }
    });
    // ---
    if ($(activeSubMenuId).getStyle('display') == 'none') {
        $(activeSubMenuId).show();
        $(obj).addClassName('open');
    } else {
        $(activeSubMenuId).hide();
        $(obj).removeClassName('open');
    }
}

function wpResetMobileMenuState()
{
    if ($('menu-content') != undefined) $('menu-content').hide();
    $$('.wp-custom-menu-submenu').each(function(item) {
        $(item).hide();
    });
    if ($('custommenu-mobile') != undefined) {
        $('custommenu-mobile').select('span.button').each(function(item) {
            $(item).removeClassName('open');
        });
    }
}

function wpCustomMenuMobileToggle()
{
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    if (wpMobileMenuEnabled && CUSTOMMENU_MOBILE_MENU_WIDTH_INIT > x) {

        wpInitMobileMenuContent();
        if ($('custommenu') != undefined) $('custommenu').hide();
        if ($('custommenu-mobile') != undefined) $('custommenu-mobile').show();
        // --- ajax load ---
        if (wpMoblieMenuAjaxUrl) {
            new Ajax.Request(
                wpMoblieMenuAjaxUrl, {
                    asynchronous: true,
                    method: 'post',
                    onSuccess: function(transport) {
                        if (transport && transport.responseText) {
                            try {
                                response = eval('(' + transport.responseText + ')');
                            } catch (e) {
                                response = {};
                            }
                        }
                        wpMobileMenuContent = response;
                        wpMobileMenuLoaded = false;
                        wpInitMobileMenuContent();
                    }
                }
            );
            wpMoblieMenuAjaxUrl = null;
        }

    } else {

        if ($('custommenu-mobile') != undefined) $('custommenu-mobile').hide();
        wpResetMobileMenuState();
        if ($('custommenu') != undefined) $('custommenu').show();
        // --- ajax load ---
        if (wpMenuAjaxUrl) {
            new Ajax.Request(
                wpMenuAjaxUrl, {
                    asynchronous: true,
                    method: 'post',
                    onSuccess: function(transport) {
                        if (transport && transport.responseText) {
                            try {
                                response = eval('(' + transport.responseText + ')');
                            } catch (e) {
                                response = {};
                            }
                        }
                        if ($('custommenu') != undefined) $('custommenu').update(response.topMenu);
                        wpPopupMenuContent = response.popupMenu;
                    }
                }
            );
            wpMenuAjaxUrl = null;
        }

    }

    if ($('custommenu-loading') != undefined) $('custommenu-loading').remove();
}
