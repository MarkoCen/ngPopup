var ngPopup = angular.module("ngPopup",[ ]); ngPopup.directive("ngPopUp",function($parse,$document,$templateCache, $compile, ngPopupBuilder){

    return{
        restrict: "EA",
        scope:true,
        replace:true,
        template:'<div class="ngPopup" ng-show="_option.isShow"></div>',
        link: function(scope, element, attrs){

            var $element = element[0];
            var $option = (scope.$parent.$eval(attrs.option) == null) ? ngPopupBuilder.getDefaultOptions() : scope.$parent.$eval(attrs.option);
            var modelName = $parse($option.modelName);
            var dragStartFlag = false;
            var resizeStartFlag = false;
            var html = ngPopupBuilder.layoutInit($option,attrs.option);
            var compiledHtml = $compile(html)(scope.$parent);

            scope._option = $option;
            scope.$watch(attrs.option,function(newValue, oldValue){
                $element.style.position = 'absolute';
                if(!scope.$parent.$eval($option.modelName).isMinimized()){
                    ngPopupBuilder.updateElementSize(element, newValue.width, newValue.height);
                }
                $element.style.top = newValue.position.top + 'px';
                $element.style.left = newValue.position.left + 'px';
                $element.getElementsByClassName('title')[0].innerHTML = newValue.title;
                if(newValue.isShow != oldValue.isShow){
                    if(newValue.isShow){
                        newValue.onOpen();
                    }
                    else{
                        newValue.onClose();
                    }
                }
                if(((newValue.width != oldValue.width) || (newValue.height != oldValue.height))){
                    if(newValue.onResize){
                        newValue.onResize();
                    }
                }
                if(newValue.hasTitleBar != oldValue.hasTitleBar){
                    var html = ngPopupBuilder.layoutInit($option,attrs.option);
                    var compiledHtml = $compile(html)(scope.$parent);
                    element.empty();
                    element.append(compiledHtml);
                }
            },true);

            modelName.assign(scope.$parent, ngPopupBuilder.getDefaultMethods($option,element,scope.$parent));

            element.append(compiledHtml);

            element.bind("mousedown", function(event){

                var target = angular.element(event.target);
                //var targetTop = $element.offsetTop;
                //var targetLeft = $element.offsetLeft;
                var targetTop = parseFloat(window.getComputedStyle($element,null)['top']);
                var targetLeft = parseFloat(window.getComputedStyle($element,null)['left']);
                var targetHeight = parseFloat(window.getComputedStyle($element,null)['height']);
                var targetWidth = parseFloat(window.getComputedStyle($element,null)['width']);
                var origY = event.pageY;
                var origX = event.pageX;

                if(target.hasClass('titleBar') || target.hasClass('title') || target.parent().hasClass('contentNoBar')) {

                    if($option.draggable == false) return;
                    if($option.onDragStart){
                        $option.onDragStart();
                        dragStartFlag = true;
                    }
                    $document.find('body').addClass('unselectable');
                    $document.bind("mousemove", function (event) {

                        $element.style.top = event.pageY - origY + targetTop + "px";
                        $element.style.left = event.pageX - origX + targetLeft + "px";
                        ngPopupBuilder.updateParentScopeOptions($option,element);
                        ngPopupBuilder.callParentScopeApply(scope.$parent);
                    })
                }

                if(target.parent().hasClass('resizeCorner')){
                    if($option.resizable == false) {
                        $document.find('body').removeClass('unselectable');

                        return;
                    }
                    if($option.onResize){
                        $option.onResize();
                        resizeStartFlag = true;
                    }

                    $document.find('body').addClass('unselectable');
                    if(target.hasClass("right-bottom-corner")){
                        $document.bind("mousemove", function (event) {
                            $element.style.height = event.pageY - targetTop  + "px";
                            $element.style.width =  event.pageX - targetLeft + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("right-top-corner")){
                        $document.bind("mousemove", function (event) {
                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("left-top-corner")){
                        $document.bind("mousemove", function (event) {
                            $element.style.left = event.pageX + "px";
                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("left-bottom-corner")){
                        $document.bind("mousemove", function (event) {
                            $element.style.left = event.pageX + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }

                }

                if(target.parent().hasClass('resizeBar')){
                    if($option.resizable == false)  { $document.find('body').removeClass('unselectable'); return;}
                    if($option.onResize){
                        $option.onResize();
                        resizeStartFlag = true;
                    }
                    $document.find('body').addClass('unselectable');
                    if(target.hasClass('left-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.left = targetLeft + event.pageX - origX + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass('right-bar')){
                        $document.bind("mousemove", function (event) {

                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);

                        })
                    }
                    else if(target.hasClass('top-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.top = event.pageY + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass('bottom-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                }



            });

            element.bind("mouseup", function(event){
                if($option.onDragEnd && dragStartFlag){
                    $option.onDragEnd();
                    dragStartFlag = false;
                    resizeStartFlag = false;
                }



                $document.find('body').removeClass('unselectable');
                $document.unbind("mousemove");
            })







        }

    }
}); ngPopup.factory("ngPopupBuilder", function($q, $http){
    var ngPopupBuilder = {
        layoutInit: function(option,optionName){
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
            '<div class="titleBar" ng-show="{{' + optionName + '.hasTitleBar || !' + optionName +'.hasOwnProperty(&quot;hasTitleBar&quot;)}}">' +
                '<span class="title">'+option.title+'</span>' +
            '<div class="iconGroup">' +
            '<span class="glyphicon glyphicon-minus" ng-click=' + option.modelName + '.minimize($event)></span>' +
            '<span class="glyphicon glyphicon-fullscreen" ng-click=' + option.modelName + '.maximize()></span>' +
            '<span class="glyphicon glyphicon-resize-small" ng-click=' + option.modelName + '.togglePin($event)></span>' +
            '<span class="glyphicon glyphicon-remove" ng-click= ' + option.modelName + '.close()></span>' +
            '</div>' +
            '</div>' +
            '<div class="content" ng-class="{'+'contentNoBar'+':{{!' + optionName+'.hasTitleBar &&' + optionName +'.hasOwnProperty(&quot;hasTitleBar&quot;)}} }">' +
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
        },
        updateElementSize: function(element, width, height){
            var $element = element[0];
            if(typeof(width) == 'string') $element.style.width = width;
            if(typeof(width) == 'number') $element.style.width = width + 'px';

            if(typeof(height) == 'string') $element.style.height = height;
            if(typeof(height) == 'number') $element.style.height = height + 'px';
        },
        updateElementPosition: function(element, position){
            var $element = element[0];
            if(typeof(position.top) == 'string') $element.style.top = position.top;
            if(typeof(position.top) == 'number') $element.style.top = position.top + 'px';

            if(typeof(position.left) == 'string') $element.style.left = position.left;
            if(typeof(position.left) == 'number') $element.style.left = position.left + 'px';
        }
    };

    return ngPopupBuilder;
});