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
                '<span class="title">'+option.title+'</span>' +
            '<div class="iconGroup">' +
            '<span class="glyphicon glyphicon-minus" ng-click=' + option.modelName + '.minimize($event)></span>' +
            '<span class="glyphicon glyphicon-fullscreen" ng-click=' + option.modelName + '.maximize()></span>' +
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
        getDefaultMethods: function(options,element){
            var $element = element[0];
            var fun = {
                open: function(newPosition){
                    if(newPosition != null){
                        $element.style.top = newPosition.top + "px";
                        $element.style.left = newPosition.left + "px";
                    }
                    if(options.onOpen){
                        options.onOpen();
                    }
                    options.isShow = true;

                },
                close: function(){
                    if(options.onClose){
                        options.onClose();
                    }
                    options.isShow = false;

                },
                maximize: function(){
                    $element.getElementsByClassName('content')[0].style.display = 'block';
                    $element.style.top = window.screenTop ? window.screenTop : window.screenY +10 + "px";
                    $element.style.left = window.screenLeft ? window.screenLeft : window.screenX +10 + "px";
                    $element.style.width = window.innerWidth - 30+ "px";
                    $element.style.height = window.innerHeight - 30 + "px";
                    options.position.top =  $element.offsetTop;
                    options.position.left = $element.offsetLeft;
                    options.width = $element.offsetWidth;
                    options.height = $element.offsetHeight;

                },
                minimize: function(event){
                    if($element.getElementsByClassName('content')[0].style.display != 'none'){
                        $element.getElementsByClassName('content')[0].style.display = 'none';
                        $element.style.height = $element.getElementsByClassName('titleBar')[0].style.height;
                        $element.style.width = '200px';
                        angular.element(event.target).removeClass('glyphicon-minus');
                        angular.element(event.target).addClass('glyphicon-plus');
                    }
                    else{
                        $element.style.height = options.height + 'px';
                        $element.style.width = options.width + 'px';
                        $element.style.top = options.position.top + 'px';
                        $element.style.left = options.position.left + 'px';
                        $element.getElementsByClassName('content')[0].style.display = 'block';
                        angular.element(event.target).removeClass('glyphicon-plus');
                        angular.element(event.target).addClass('glyphicon-minus');
                        options.position.top =  $element.offsetTop;
                        options.position.left = $element.offsetLeft;
                    }
                },

                togglePin: function(event){
                    if($option.pinned != true){
                        $element.style.position = 'fixed';
                        angular.element(event.target).removeClass('glyphicon-resize-small');
                        angular.element(event.target).addClass('glyphicon-resize-full');
                        options.pinned = true;
                    }
                    else{
                        $element.style.position = 'absolute';
                        angular.element(event.target).removeClass('glyphicon-resize-full');
                        angular.element(event.target).addClass('glyphicon-resize-small');
                        options.pinned = false;
                    }

                },
                setTitle: function(newTitle){
                    $element.getElementsByClassName('title')[0].innerHTML = newTitle;
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
                isShow : true,
                effect : 'fade',
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
            var $element = element[0]
            options.position.top =  $element.offsetTop;
            options.position.left = $element.offsetLeft;
            if($element.getElementsByClassName('content')[0].style.display != 'none'){
                options.width = $element.offsetWidth;
                options.height = $element.offsetHeight;
            }
        }
    };

    return ngPopupBuilder;
});