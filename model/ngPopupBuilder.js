ngPopup.factory("ngPopupBuilder", function($q, $http){
    var ngPopupBuilder = {
        layoutInit: function(option){
            var templateHtml = (option.template) ? option.template : '';
            var templateUrlHtml = '';
            var html = null;

            if(option.templateUrl) {
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                        templateUrlHtml = xmlHttpRequest.responseText;
                    }
                }
                xmlHttpRequest.open("GET", option.templateUrl, false);
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
            '<span class="glyphicon glyphicon-plus" ng-click=' + option.modelName + '.maximize()></span>' +
            '<span class="glyphicon glyphicon-minus" ng-click=' + option.modelName + '.minimize()></span>' +
            '<span class="glyphicon glyphicon-resize-small" ng-click=' + option.modelName + '.togglePin($event)></span>' +
            '<span class="glyphicon glyphicon-remove" ng-click= ' + option.modelName + '.close()></span>' +
            '</div>' +
            '</div>' +
            '<div class="content">' +
            templateHtml +
            templateUrlHtml +
            '</div>' +
            '</div>';

            return html;


        },
        getDefaultMethods: function(options,element,scope){
            var $element = element[0];
            var fun = {
                open: function(newPosition){
                    if(newPosition != null){
                        $element.style.top = newPosition.top + "px";
                        $element.style.left = newPosition.left + "px";
                    }
                    $element.style.display = 'block';
                },
                close: function(){
                    $element.style.display = 'none';
                },
                maximize: function(){
                    $element.getElementsByClassName('content')[0].style.display = 'block';
                    $element.style.top = window.screenTop ? window.screenTop : window.screenY +10 + "px";
                    $element.style.left = window.screenLeft ? window.screenLeft : window.screenX +10 + "px";
                    $element.style.width = window.innerWidth - 30+ "px";
                    $element.style.height = window.innerHeight - 30 + "px";
                    //this.updateParentScopeOptions(options,$element);
                    options.position.top =  $element.offsetTop;
                    options.position.left = $element.offsetLeft;
                    options.width = $element.offsetWidth;
                    options.height = $element.offsetHeight;
                },
                minimize: function(){
                    $element.getElementsByClassName('content')[0].style.display = 'none';
                    $element.style.height = $element.getElementsByClassName('titleBar')[0].style.height;
                    $element.style.width = '200px';
                    options.position.top =  $element.offsetTop;
                    options.position.left = $element.offsetLeft;
                    options.width = $element.offsetWidth;
                    options.height = $element.offsetHeight;
                },
                togglePin: function(event){
                    if($option.pinned != true){
                        $element.style.position = 'fixed';
                        angular.element(event.target).removeClass('glyphicon-resize-small');
                        angular.element(event.target).addClass('glyphicon-resize-full');
                        $option.pinned = true;
                    }
                    else{
                        $element.style.position = 'absolute';
                        angular.element(event.target).removeClass('glyphicon-resize-full');
                        angular.element(event.target).addClass('glyphicon-resize-small');
                        $option.pinned = false;
                    }

                },
                isOpened: function(){
                    return ($element.style.display != 'none') ? true : false;
                },
                isMaximized: function(){

                },
                isMinimized: function(){
                    return ($element.getElementsByClassName('content')[0].style.display != 'none') ? false : true;
                }
            };

            return fun;
        },
        getDefaultOptions: function(){
            var defaultOption = {
                modelName : "",
                width : 100,
                height : 100,
                template: "123",
                templateUrl : "",
                resizable : true,
                draggable : true,
                position : {
                    top : 100,
                    left : 100
                },
                title : "",
                modal : false,
                pinned : false,
                onOpen : function(){},
                onClose  : function(){},
                onDragStart : function(){},
                onDragEnd : function(){},
                onResize : function(){}

            };

            return defaultOption;
        },
        callParentScopeApply: function(scope){
            if(!scope.$$phase){
                scope.$apply()
            }
        },
        updateParentScopeOptions: function(options,element){
            options.position.top =  element.offsetTop;
            options.position.left = element.offsetLeft;
            options.width = element.offsetWidth;
            options.height = element.offsetHeight;
        }
    };

    return ngPopupBuilder;
});