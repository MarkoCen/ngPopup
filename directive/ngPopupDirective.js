;(function(){
    angular.module('ngPopup').directive("ngPopUp", NgPopup);

    NgPopup.$inject = [
        '$document', '$timeout', '$q',
        '$compile', 'ngPopupBuilder'
    ];

    function NgPopup(
        $document, $timeout, $q,
        $compile, ngPopupBuilder
    ){
        return{
            restrict: "EA",
            scope:{
                option: "=?"
            },
            replace:true,
            template:'<div class="ngPopup" ng-show="option.isShow"></div>',
            link: function(scope, element, attrs){

                var self = scope
                    ,$element = element[0]
                    ,$option = ngPopupBuilder.getDefaultOptions(self.option)
                    ,dragStartFlag = false
                    ,resizeStartFlag = false
                    ,initDone = false
                    ,linkParams = {
                        scope: self,
                        element: element,
                        attrs: attrs
                    };

                $q.when(ngPopupBuilder.layoutInitAsync($option)).then(function(html){
                    var compiledHtml = $compile(html)(self);
                    element.append(compiledHtml);
                    ngPopupBuilder.updateBindingValue($option, ngPopupBuilder.getDefaultOptions(), linkParams);
                    initDone = true;
                });

                self.$watch('option',function(newValue, oldValue){
                    if(initDone) ngPopupBuilder.updateBindingValue(newValue,oldValue, linkParams);
                },true);

                self.action = ngPopupBuilder.getDefaultMethods($option,element);

                self.mouseMoveHandler = angular.noop;

                self.mouseUpHandler = function mouseUpHandler(){

                    $timeout(function () {
                        if($option.onDragEnd && dragStartFlag){
                            $option.onDragEnd();
                            dragStartFlag = false;
                            resizeStartFlag = false;
                        }
                        $document.find('body').removeClass('unselectable');
                        $document.off("mousemove", self.mouseMoveHandler);
                    });

                };

                self.mouseDownHandler = function mouseDownHandler(event){

                    $timeout(function () {
                        var target = angular.element(event.target)
                            ,targetTop = parseFloat(window.getComputedStyle($element,null)['top'])
                            ,targetLeft = parseFloat(window.getComputedStyle($element,null)['left'])
                            ,targetHeight = parseFloat(window.getComputedStyle($element,null)['height'])
                            ,targetWidth = parseFloat(window.getComputedStyle($element,null)['width'])
                            ,origY = event.pageY
                            ,origX = event.pageX;

                        if(target.hasClass('titleBar')
                            || target.hasClass('title')
                            || target.parent().hasClass('contentNoBar')
                            || target.hasClass('contentNoBar')
                        ) {

                            if($option.draggable == false) return;
                            if($option.onDragStart){
                                $option.onDragStart();
                                dragStartFlag = true;
                            }

                            self.mouseMoveHandler = function (event) {
                                $timeout(function () {
                                    $element.style.top = event.pageY - origY + targetTop + "px";
                                    $element.style.left = event.pageX - origX + targetLeft + "px";
                                    ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                });
                            };

                            $document.find('body').addClass('unselectable');

                            $document.on("mousemove", self.mouseMoveHandler)

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
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.height = targetHeight + event.pageY - origY + "px";
                                        $element.style.width = targetWidth + event.pageX - origX + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass("right-top-corner")){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.top = event.pageY + "px";
                                        $element.style.width = targetWidth + event.pageX - origX + "px";
                                        $element.style.height = targetHeight - event.pageY + origY + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass("left-top-corner")){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.left = targetLeft + event.pageX - origX + "px";
                                        $element.style.top = event.pageY + "px";
                                        $element.style.width = targetWidth - event.pageX + origX + "px";
                                        $element.style.height = targetHeight - event.pageY + origY + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass("left-bottom-corner")){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.left = event.pageX + "px";
                                        $element.style.width = targetWidth - event.pageX + origX + "px";
                                        $element.style.height = targetHeight + event.pageY - origY + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }

                            $document.on("mousemove", self.mouseMoveHandler)
                        }

                        if(target.parent().hasClass('resizeBar')){
                            if($option.resizable == false)  { $document.find('body').removeClass('unselectable'); return;}
                            if($option.onResize){
                                $option.onResize();
                                resizeStartFlag = true;
                            }

                            $document.find('body').addClass('unselectable');

                            if(target.hasClass('left-bar')){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.left = targetLeft + event.pageX - origX + "px";
                                        $element.style.width = targetWidth - event.pageX + origX + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass('right-bar')){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.width = targetWidth + event.pageX - origX + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass('top-bar')){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function () {
                                        $element.style.top = event.pageY + "px";
                                        $element.style.height = targetHeight - event.pageY + origY + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }
                            else if(target.hasClass('bottom-bar')){
                                self.mouseMoveHandler = function (event) {
                                    $timeout(function(){
                                        $element.style.height = targetHeight + event.pageY - origY + "px";
                                        ngPopupBuilder.updateParentScopeOptions(self.option,element);
                                    });
                                }
                            }

                            $document.on("mousemove", self.mouseMoveHandler)
                        }
                    });
                };

                element.on("mousedown", self.mouseDownHandler);

                element.on("mouseup", self.mouseUpHandler);

                self.$on('$destroy', function(){
                    element.off("mousedown", self.mouseDownHandler);
                    element.off("mouseup", self.mouseUpHandler);
                    $document.off("mousemove", self.mouseMoveHandler);
                })

            }

        }
    }
})();

