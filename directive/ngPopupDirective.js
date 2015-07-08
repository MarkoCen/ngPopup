ngPopup.directive("ngPopUp",[

    '$parse', '$document', '$templateCache', '$compile', 'ngPopupBuilder',

    function($parse,$document,$templateCache, $compile, ngPopupBuilder){

        return{
            restrict: "EA",
            scope:{
                option: "=?"
            },
            replace:true,
            template:'<div class="ngPopup" ng-show="option.isShow"></div>',
            link: function(scope, element, attrs){

                var $element = element[0]
                var $option = ngPopupBuilder.getDefaultOptions(scope.option)
                var modelName = $option.modelName
                var dragStartFlag = false
                var resizeStartFlag = false
                var initDone = false
                var linkParams = {
                        scope: scope,
                        element: element,
                        attrs: attrs
                    };

                ngPopupBuilder.layoutInitAsync($option).then(function(html){
                    var compiledHtml = $compile(html)(scope);
                    element.append(compiledHtml);
                    ngPopupBuilder.updateBindingValue($option, ngPopupBuilder.getDefaultOptions(), linkParams);
                    initDone = true;
                });

                scope.$watch('option',function(newValue, oldValue){
                    if(initDone) ngPopupBuilder.updateBindingValue(newValue,oldValue, linkParams);
                },true);

                scope.action = ngPopupBuilder.getDefaultMethods($option,element);

                element.bind("mousedown", function(event){


                    var target = angular.element(event.target)
                        ,targetTop = parseFloat(window.getComputedStyle($element,null)['top'])
                        ,targetLeft = parseFloat(window.getComputedStyle($element,null)['left'])
                        ,targetHeight = parseFloat(window.getComputedStyle($element,null)['height'])
                        ,targetWidth = parseFloat(window.getComputedStyle($element,null)['width'])
                        ,origY = event.pageY
                        ,origX = event.pageX;

                    if(target.hasClass('titleBar') || target.hasClass('title') || target.parent().hasClass('contentNoBar') || target.hasClass('contentNoBar')) {

                        if($option.draggable == false) return;
                        if($option.onDragStart){
                            $option.onDragStart();
                            dragStartFlag = true;
                        }
                        $document.find('body').addClass('unselectable');
                        $document.bind("mousemove", function (event) {

                            $element.style.top = event.pageY - origY + targetTop + "px";
                            $element.style.left = event.pageX - origX + targetLeft + "px";
                            ngPopupBuilder.updateParentScopeOptions(scope.option,element);
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
                                $element.style.height = targetHeight + event.pageY - origY + "px";
                                $element.style.width = targetWidth + event.pageX - origX + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                        else if(target.hasClass("right-top-corner")){
                            $document.bind("mousemove", function (event) {
                                $element.style.top = event.pageY + "px";
                                $element.style.width = targetWidth + event.pageX - origX + "px";
                                $element.style.height = targetHeight - event.pageY + origY + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                        else if(target.hasClass("left-top-corner")){
                            $document.bind("mousemove", function (event) {
                                $element.style.left = targetLeft + event.pageX - origX + "px";
                                $element.style.top = event.pageY + "px";
                                $element.style.width = targetWidth - event.pageX + origX + "px";
                                $element.style.height = targetHeight - event.pageY + origY + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                        else if(target.hasClass("left-bottom-corner")){
                            $document.bind("mousemove", function (event) {
                                $element.style.left = event.pageX + "px";
                                $element.style.width = targetWidth - event.pageX + origX + "px";
                                $element.style.height = targetHeight + event.pageY - origY + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
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
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                        else if(target.hasClass('right-bar')){
                            $document.bind("mousemove", function (event) {

                                $element.style.width = targetWidth + event.pageX - origX + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);

                            })
                        }
                        else if(target.hasClass('top-bar')){
                            $document.bind("mousemove", function (event) {
                                $element.style.top = event.pageY + "px";
                                $element.style.height = targetHeight - event.pageY + origY + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                        else if(target.hasClass('bottom-bar')){
                            $document.bind("mousemove", function (event) {
                                $element.style.height = targetHeight + event.pageY - origY + "px";
                                ngPopupBuilder.updateParentScopeOptions(scope.option,element);
                                ngPopupBuilder.callParentScopeApply(scope.$parent);
                            })
                        }
                    }

                    ngPopupBuilder.callParentScopeApply(scope.$parent);

                });

                element.bind("mouseup", function(event){
                    if($option.onDragEnd && dragStartFlag){
                        $option.onDragEnd();
                        dragStartFlag = false;
                        resizeStartFlag = false;
                    }

                    $document.find('body').removeClass('unselectable');
                    $document.unbind("mousemove");

                    ngPopupBuilder.callParentScopeApply(scope.$parent);
                })

            }

        }
}]);
