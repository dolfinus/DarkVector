(function ($) {
    var rtl = $("html").attr("dir") === "rtl";
    $.fn.collapsibleTabs = function (options) {
        if (!this.length) {
            return this;
        }
        var settings = $.extend({}, $.collapsibleTabs.defaults, options);
        this.each(function () {
            var $el = $(this);
            $.collapsibleTabs.instances = $.collapsibleTabs.instances.add($el);
            $el.data("collapsibleTabsSettings", settings);
            $el.children(settings.collapsible).each(function () {
                $.collapsibleTabs.addData($(this));
            });
        });
        if (!$.collapsibleTabs.boundEvent) {
            $(window).on(
                "resize",
                $.debounce(500, function () {
                    $.collapsibleTabs.handleResize();
                })
            );
            $.collapsibleTabs.boundEvent = true;
        }
        $.collapsibleTabs.handleResize();
        return this;
    };
    $.collapsibleTabs = {
        instances: $([]),
        boundEvent: null,
        defaults: {
            expandedContainer: "#p-views ul",
            collapsedContainer: "#p-cactions ul",
            collapsible: "li.collapsible",
            shifting: false,
            expandCondition: function (eleWidth) {
                return $.collapsibleTabs.calculateTabDistance() >= eleWidth + 1;
            },
            collapseCondition: function () {
                return $.collapsibleTabs.calculateTabDistance() < 0;
            },
        },
        addData: function ($collapsible) {
            var settings = $collapsible.parent().data("collapsibleTabsSettings");
            if (settings) {
                $collapsible.data("collapsibleTabsSettings", { expandedContainer: settings.expandedContainer, collapsedContainer: settings.collapsedContainer, expandedWidth: $collapsible.width(), prevElement: $collapsible.prev() });
            }
        },
        getSettings: function ($collapsible) {
            var settings = $collapsible.data("collapsibleTabsSettings");
            if (!settings) {
                $.collapsibleTabs.addData($collapsible);
                settings = $collapsible.data("collapsibleTabsSettings");
            }
            return settings;
        },
        handleResize: function () {
            $.collapsibleTabs.instances.each(function () {
                var $el = $(this),
                    data = $.collapsibleTabs.getSettings($el);
                if (data.shifting) {
                    return;
                }
                if ($el.children(data.collapsible).length > 0 && data.collapseCondition()) {
                    $el.trigger("beforeTabCollapse");
                    $.collapsibleTabs.moveToCollapsed($el.children(data.collapsible + ":last"));
                }
                if ($(data.collapsedContainer + " " + data.collapsible).length > 0 && data.expandCondition($.collapsibleTabs.getSettings($(data.collapsedContainer).children(data.collapsible + ":first")).expandedWidth)) {
                    $el.trigger("beforeTabExpand");
                    $.collapsibleTabs.moveToExpanded(data.collapsedContainer + " " + data.collapsible + ":first");
                }
            });
        },
        moveToCollapsed: function (ele) {
            var outerData,
                expContainerSettings,
                target,
                $moving = $(ele);
            outerData = $.collapsibleTabs.getSettings($moving);
            if (!outerData) {
                return;
            }
            expContainerSettings = $.collapsibleTabs.getSettings($(outerData.expandedContainer));
            if (!expContainerSettings) {
                return;
            }
            expContainerSettings.shifting = true;
            target = outerData.collapsedContainer;
            $moving
                .css("position", "relative")
                .css(rtl ? "left" : "right", 0)
                .animate({ width: "1px" }, "normal", function () {
                    var data, expContainerSettings;
                    $(this).hide();
                    $('<span class="placeholder" style="display: none;"></span>').insertAfter(this);
                    $(this).detach().prependTo(target).data("collapsibleTabsSettings", outerData);
                    $(this).attr("style", "display: list-item;");
                    data = $.collapsibleTabs.getSettings($(ele));
                    if (data) {
                        expContainerSettings = $.collapsibleTabs.getSettings($(data.expandedContainer));
                        if (expContainerSettings) {
                            expContainerSettings.shifting = false;
                            $.collapsibleTabs.handleResize();
                        }
                    }
                });
        },
        moveToExpanded: function (ele) {
            var data,
                expContainerSettings,
                $target,
                expandedWidth,
                $moving = $(ele);
            data = $.collapsibleTabs.getSettings($moving);
            if (!data) {
                return;
            }
            expContainerSettings = $.collapsibleTabs.getSettings($(data.expandedContainer));
            if (!expContainerSettings) {
                return;
            }
            expContainerSettings.shifting = true;
            $target = $(data.expandedContainer).find("span.placeholder:first");
            expandedWidth = data.expandedWidth;
            $moving
                .css("position", "relative")
                .css(rtl ? "right" : "left", 0)
                .css("width", "1px");
            $target.replaceWith(
                $moving
                    .detach()
                    .css("width", "1px")
                    .data("collapsibleTabsSettings", data)
                    .animate({ width: expandedWidth + "px" }, "normal", function () {
                        $(this).attr("style", "display: block;");
                        var data, expContainerSettings;
                        data = $.collapsibleTabs.getSettings($(this));
                        if (data) {
                            expContainerSettings = $.collapsibleTabs.getSettings($(data.expandedContainer));
                            if (expContainerSettings) {
                                expContainerSettings.shifting = false;
                                $.collapsibleTabs.handleResize();
                            }
                        }
                    })
            );
        },
        calculateTabDistance: function () {
            var $leftTab, $rightTab, leftEnd, rightStart;
            if (!rtl) {
                $leftTab = $("#left-navigation");
                $rightTab = $("#right-navigation");
            } else {
                $leftTab = $("#right-navigation");
                $rightTab = $("#left-navigation");
            }
            leftEnd = $leftTab.offset().left + $leftTab.width();
            rightStart = $rightTab.offset().left;
            return rightStart - leftEnd;
        },
    };
})(jQuery);
