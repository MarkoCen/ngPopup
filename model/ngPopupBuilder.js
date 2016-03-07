;(function(){
    angular.module('ngPopup').factory('ngPopupBuilder', NgPopupBuilder);

    NgPopupBuilder.$inject = [
        '$q', '$http', '$log'
    ];

    function NgPopupBuilder($q, $http,$log){
        var eventTrigger = false
            ,tempHeight = 0
            ,tempWidth = 0
            ,lastWindowScrollTop = 0
            ,ngPopupBuilder = {

            layoutInitAsync: __layoutInitAsync,
            getDefaultMethods: __getDefaultMethods,
            getDefaultOptions: __getDefaultOptions,
            updateParentScopeOptions: __updateParentScopeOptions,
            updateElementSize: __updateElementSize,
            updateElementPosition: __updateElementPosition,
            updateBindingValue: __updateBindingValue

        };

        return ngPopupBuilder;

        function __getWindowScrollTop(){
            return  (window.pageYOffset !== undefined) ?
                window.pageYOffset :
                (document.documentElement || document.body.parentNode || document.body).scrollTop;
        }

        function __updateBindingValue(newValue, oldValue, linkParams){
            var scope = linkParams.scope
                ,element = linkParams.element
                ,attrs = linkParams.attrs
                ,$element = element[0];

            if(newValue.pinned){
                $element.style.position = 'fixed';
                lastWindowScrollTop = __getWindowScrollTop();
            }
            else{
                $element.style.position = 'absolute';
                $element.style.top =
                    newValue.position.top + __getWindowScrollTop() - lastWindowScrollTop + 'px';
            }

            if(!scope.option.isMinimized){
                ngPopupBuilder.updateElementSize(element, newValue.width, newValue.height);
            }

            if(newValue.position.top != oldValue.position.top || newValue.position.left != newValue.position.left){
                $element.style.top = newValue.position.top + 'px';
                $element.style.left = newValue.position.left + 'px';
            }


            if(newValue.isShow != oldValue.isShow && !eventTrigger){
                if(newValue.isShow){
                    if(newValue.onOpen){
                        newValue.onOpen();
                    }
                }
                else{
                    if(newValue.onClose)
                    {
                        newValue.onClose();
                    }
                }
            }
            if(((newValue.width != oldValue.width) || (newValue.height != oldValue.height))){
                if(newValue.onResize){
                    newValue.onResize();
                }
            }

            if(newValue.hasTitleBar != oldValue.hasTitleBar){
                scope.option.hasTitleBar = newValue.hasTitleBar;
            }

            eventTrigger = false;
        }

        function __updateElementPosition(element, position){
            var $element = element[0];
            if(typeof(position.top) == 'string') $element.style.top = position.top;
            if(typeof(position.top) == 'number') $element.style.top = position.top + 'px';

            if(typeof(position.left) == 'string') $element.style.left = position.left;
            if(typeof(position.left) == 'number') $element.style.left = position.left + 'px';
        }

        function __updateElementSize(element, width, height){
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
        }

        function __updateParentScopeOptions(options,element){
            var $element = element[0];
            options.position.top =  $element.offsetTop;
            options.position.left = $element.offsetLeft;
            if($element.getElementsByClassName('content')[0].style.display != 'none'){
                options.width = $element.offsetWidth;
                options.height = $element.offsetHeight;
            }
        }

        function __getDefaultOptions(options){

            if(options){
                options.modelName = options.modelName || "ngPopup";
                options.width = options.width || 100;
                options.height = options.height || 100;
                options.template = options.template || '';
                options.templateUrl = options.templateUrl || null;
                options.resizable = (options.resizable == null) ? true : options.resizable;
                options.draggable = (options.draggable == null) ? true : options.draggable;
                options.position = options.position || {top: 0, left: 0};
                options.title = options.title || "Welcome to ngPopup!";
                options.hasTitleBar = (options.hasTitleBar == null) ? true : options.hasTitleBar;
                options.pinned = (options.pinned == null) ? false : options.pinned;
                options.isShow = (options.isShow == null) ? true : options.isShow;
                options.isMinimized = (options.isMinimized == null) ? false : options.isMinimized;
                options.isMaximized = (options.isMaximized == null) ? false : options.isMaximized;
                options.onOpen = options.onOpen || function(){};
                options.onClose = options.onClose || function(){};
                options.onDragStart = options.onDragStart || function () {};
                options.onDragEnd = options.onDragEnd || function(){};
                options.onResize = options.onResize || function () {};
                return options;
            }
            else{
                return {
                    modelName : "myDialog",
                    width : 100,
                    height : 100,
                    template: "",
                    templateUrl : null,
                    resizable : true,
                    draggable : true,
                    position : {
                        top : -1,
                        left : -1
                    },
                    title : "Welcome to ngPopup!",
                    hasTitleBar : true,
                    pinned : false,
                    isShow : true,
                    onOpen : function(){},
                    onClose  : function(){},
                    onDragStart : function(){},
                    onDragEnd : function(){},
                    onResize : function(){}
                }
            }

        }

        function __getDefaultMethods(options,element){
            var $element = element[0];
            return {
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
                    eventTrigger = true;

                },
                maximize: function(isMax){
                    if(!isMax) {
                        tempHeight = $element.offsetHeight;
                        tempWidth  = $element.offsetWidth;
                        $element.getElementsByClassName('content')[0].style.display = 'block';
                        $element.style.top = '5px';
                        $element.style.left = '5px';
                        $element.style.width = 'calc( 100vw - 10px )';
                        $element.style.height = 'calc( 100vh - 10px )';
                        options.position.top = $element.offsetTop;
                        options.position.left = $element.offsetLeft;
                        options.width = $element.offsetWidth;
                        options.height = $element.offsetHeight;
                        angular.element(document.querySelector("#maxBtn")).removeClass('fa-expand').addClass('fa-compress');
                    }
                    else{
                        $element.style.height = tempHeight + "px";
                        $element.style.width = tempWidth + "px";
                        options.width = $element.offsetWidth;
                        options.height = $element.offsetHeight;
                        angular.element(document.querySelector("#maxBtn")).removeClass('fa-compress').addClass('fa-expand');
                    }

                    options.isMaximized = !options.isMaximized;
                    eventTrigger = true;


                },
                minimize: function(isMin){
                    if(!isMin){
                        $element.getElementsByClassName('content')[0].style.display = 'none';
                        $element.style.height = $element.getElementsByClassName('titleBar')[0].style.height;
                        $element.style.width = '200px';
                        angular.element(document.querySelector("#minBtn")).removeClass('fa-minus').addClass('fa-plus');
                    }
                    else{
                        $element.style.height = options.height + 'px';
                        $element.style.width = options.width + 'px';
                        $element.style.top = options.position.top + 'px';
                        $element.style.left = options.position.left + 'px';
                        $element.getElementsByClassName('content')[0].style.display = 'block';
                        angular.element(document.querySelector("#minBtn")).removeClass('fa-plus').addClass('fa-minus');
                        options.position.top =  $element.offsetTop;
                        options.position.left = $element.offsetLeft;
                    }

                    options.isMinimized = !options.isMinimized;
                    eventTrigger = true;

                },

                togglePin: function(){
                    if(options.pinned != true){
                        document.querySelector("#pinBtn").style.color = '#EB5342';
                        options.pinned = true;
                    }
                    else{
                        document.querySelector("#pinBtn").style.color = '';
                        options.pinned = false;
                    }
                    eventTrigger = true;

                },
                isMaximized: function(){
                    return options.isMaximized;
                },
                isMinimized: function(){
                    return options.isMinimized;
                }
            };
        }

        function __layoutInitAsync(option){
            var templateHtml = (option.template) ? option.template : ''
                ,deferred = $q.defer()
                ,html = '<div class="container">' +

                '<div class="resizeCorner">' +
                '<div class="left-top-corner"></div>' +
                '<div class="left-bottom-corner"></div>' +
                '<div class="right-top-corner"></div>' +
                '<div class="right-bottom-corner"></div>' +
                '</div>' +

                '<div class="resizeBar">' +
                '<div class="top-bar"></div>' +
                '<div class="right-bar"></div>' +
                '<div class="bottom-bar"></div>' +
                '<div class="left-bar"></div>' +
                '</div>' +

                '<div class="titleBar" ng-show="option.hasTitleBar">' +
                '<span class="title">{{option.title}}</span>' +
                '<div class="iconGroup">' +
                '<i class="fa fa-minus" ng-click="action.minimize(option.isMinimized)" id="minBtn"></i>' +
                '<i class="fa fa-expand" ng-click="action.maximize(option.isMaximized)" id="maxBtn"></i>' +
                '<i class="fa fa-map-pin" ng-click="action.togglePin($event)" id="pinBtn"></i>' +
                '<i class="fa fa-close" ng-click="action.close($event)" id="closeBtn"></i>' +
                '</div>' +
                '</div>' +

                '<div class="content" ng-class="{contentNoBar:!option.hasTitleBar}">';
            if(option.templateUrl) {
                $http.get(option.templateUrl).then(function(templateUrlHtml){
                    html += templateHtml + templateUrlHtml.data + '</div>' + '</div>';
                    deferred.resolve(html);
                },
                function(reason){
                    $log.error(reason);
                    deferred.reject(reason);
                });

                return deferred.promise;

            }
            else{
                html += templateHtml + '</div>' + '</div>';
                return html;
            }


        }


    }
})();
