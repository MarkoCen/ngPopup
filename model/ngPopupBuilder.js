ngPopup.factory("ngPopupBuilder", function($q, $http){
    var ngPopupBuilder = {
        init: function(templateUrl, template, actions){
            var templateHtml = (template) ? template : '';
            var templateUrlHtml = '';
            var html = null;

            if(templateUrl) {
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                        templateUrlHtml = xmlHttpRequest.responseText;
                    }
                }
                xmlHttpRequest.open("GET", templateUrl, false);
                xmlHttpRequest.send(null);
            }

            html = '<div class="container">' +
                '<div class="resizeCorner">' +
                '<div class="left-top-corner"></div>' + '<div class="left-bottom-corner"></div>' + '<div class="right-top-corner"></div>' + '<div class="right-bottom-corner"></div>' +
                '</div>' +
                '<div class="resizeBar">' +
                '<div class="top-bar"></div>' + '<div class="right-bar"></div>' + '<div class="bottom-bar"></div>' + '<div class="left-bar"></div>' +
                '</div>' +
                '<div class="titleBar">' +
                '<div class="iconGroup">' +
                '<span class="glyphicon glyphicon-plus" ng-click=' + actions + '.maximize()></span>' +
                '<span class="glyphicon glyphicon-minus" ng-click=' + actions + '.minimize()></span>' +
                '<span class="glyphicon glyphicon-resize-small" ng-click=' + actions + '.togglePin($event)></span>' +
                '<span class="glyphicon glyphicon-remove" ng-click= ' + actions + '.close()></span>' +
                '</div>' +
                '</div>' +
                '<div class="content">' +
                    templateHtml +
                    templateUrlHtml +
                '</div>' +
                '</div>';

            return html;


        }
    }

    return ngPopupBuilder;
})