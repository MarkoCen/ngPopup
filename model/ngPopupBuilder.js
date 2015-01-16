ngPopup.factory("ngPopupBuilder", function($q, $http){
    var isMax = false;
    var isMin = false;
    var tempHeight = 0;
    var tempWidth = 0;
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
            '<span class="glyphicon glyphicon-resize-full" ng-click=' + option.modelName + '.maximize($event)></span>' +
            '<span class="glyphicon glyphicon-pushpin" ng-click=' + option.modelName + '.togglePin($event)></span>' +
            '<span class="glyphicon glyphicon-remove" ng-click= ' + option.modelName + '.close($event)></span>' +
            '</div>' +
            '</div>' +
            '<div class="content" ng-class="{'+'contentNoBar'+':{{!' + optionName+'.hasTitleBar &&' + optionName +'.hasOwnProperty(&quot;hasTitleBar&quot;)}} }">' +
            templateHtml +
            templateUrlHtml +
            '</div>' +
            '</div>';

            var tempHeight = option.height;
            var tempWidth = option.width;
            return html;


        },
        getDefaultMethods: function(options,element){
            var $element = element[0];
            var fun = {
                open: function(newPosition){
                    if(newPosition != null){
                        $element.style.top = newPosition.top + "px";
                        $element.style.left = newPosition.left + "px";
                        options.position.top = newPosition.top;
                        options.position.left = newPosition.left;
                    }
                    if(options.onOpen){
                        options.onOpen();
                    }
                    options.isShow = true;

                },
                close: function($event){
                    if(options.onClose){
                        options.onClose();
                    }
                    options.isShow = false;

                },
                maximize: function(event){
                    if(!isMax) {
                        tempHeight = $element.offsetHeight;
                        tempWidth  = $element.offsetWidth;
                        $element.getElementsByClassName('content')[0].style.display = 'block';
                        $element.style.top = window.screenTop ? window.screenTop : window.screenY + 10 + "px";
                        $element.style.left = window.screenLeft ? window.screenLeft : window.screenX + 10 + "px";
                        $element.style.width = window.innerWidth - 30 + "px";
                        $element.style.height = window.innerHeight - 30 + "px";
                        options.position.top = $element.offsetTop;
                        options.position.left = $element.offsetLeft;
                        options.width = $element.offsetWidth;
                        options.height = $element.offsetHeight;
                        isMax = true;
                        angular.element(event.target).removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
                    }
                    else{
                        $element.style.height = tempHeight + "px";
                        $element.style.width = tempWidth + "px";
                        options.width = $element.offsetWidth;
                        options.height = $element.offsetHeight;
                        isMax = false;
                        angular.element(event.target).removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
                    }


                },
                minimize: function(event){
                    if($element.getElementsByClassName('content')[0].style.display != 'none'){
                        $element.getElementsByClassName('content')[0].style.display = 'none';
                        $element.style.height = $element.getElementsByClassName('titleBar')[0].style.height;
                        $element.style.width = '200px';
                        angular.element(event.target).removeClass('glyphicon-minus').addClass('glyphicon-plus');
                        isMin = true;
                    }
                    else{
                        $element.style.height = options.height + 'px';
                        $element.style.width = options.width + 'px';
                        $element.style.top = options.position.top + 'px';
                        $element.style.left = options.position.left + 'px';
                        $element.getElementsByClassName('content')[0].style.display = 'block';
                        angular.element(event.target).removeClass('glyphicon-plus').addClass('glyphicon-minus');
                        options.position.top =  $element.offsetTop;
                        options.position.left = $element.offsetLeft;
                        isMin = false;
                    }
                },

                togglePin: function(event){
                    if(options.pinned != true){
                        $element.style.position = 'fixed';
                        event.target.style.color = '#EB5342';
                        options.pinned = true;
                    }
                    else{
                        $element.style.position = 'absolute';
                        event.target.style.color = '';
                        options.pinned = false;
                    }

                },
                setTitle: function(newTitle){
                    $element.getElementsByClassName('title')[0].innerHTML = newTitle;
                },
                isMaximized: function(){
                    return isMax;
                },
                isMinimized: function(){
                    return isMin;
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
            if(typeof(width) == 'string'){
                if(width.slice(-1) == "%"){
                    $element.style.width = width;
                }else{
                    $element.style.width = parseInt(width, 10) + "px";
                }
            }
            if(typeof(width) == 'number') $element.style.width = width + 'px';

            if(typeof(height) == 'string'){
                if(height.slice(-1) == "%"){
                    $element.style.height = height;
                }else{
                    $element.style.height = parseInt(height, 10) + "px";
                }
            }
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