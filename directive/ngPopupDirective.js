ngPopup.directive("ngPopUp",function($parse,$document,$templateCache, $compile, ngPopupBuilder){

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
            var html = ngPopupBuilder.layoutInit($option);
            var compiledHtml = $compile(html)(scope.$parent);

            scope._option = $option;
            scope.$watch(attrs.option,function(newValue, oldValue){
                $element.style.position = 'absolute';
                $element.style.width = newValue.width + 'px';
                $element.style.height = newValue.height + 'px';
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
            },true);

            modelName.assign(scope.$parent, ngPopupBuilder.getDefaultMethods($option,element,scope.$parent));

            element.append(compiledHtml);

            element.bind("mousedown", function(event){

                var target = angular.element(event.target);
                var targetTop = $element.offsetTop;
                var targetLeft = $element.offsetLeft;
                var targetHeight = parseInt($element.style.height, 10);
                var targetWidth = parseInt($element.style.width,10);
                var origY = event.pageY;
                var origX = event.pageX;

                if(target.hasClass('titleBar')) {
                    if($option.draggable == false) return;
                    if($option.onDragStart){
                        $option.onDragStart();
                        dragStartFlag = true;
                    }
                    $document.find('body').addClass('unselectable');
                    $document.bind("mousemove", function (event) {

                        $element.style.top = event.pageY - origY + targetTop + "px";
                        $element.style.left = event.pageX - origX + targetLeft + "px";
                        ngPopupBuilder.updateParentScopeOptions($option,$element);
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

                            $element.style.height = event.pageY - $element.offsetTop  + "px";
                            $element.style.width =  event.pageX - $element.offsetLeft + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("right-top-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("left-top-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.left = event.pageX + "px";
                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass("left-bottom-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.left = event.pageX + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
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
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass('right-bar')){
                        $document.bind("mousemove", function (event) {

                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);

                        })
                    }
                    else if(target.hasClass('top-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.top = event.pageY + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
                            ngPopupBuilder.callParentScopeApply(scope.$parent);
                        })
                    }
                    else if(target.hasClass('bottom-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            ngPopupBuilder.updateParentScopeOptions($option,$element);
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
});