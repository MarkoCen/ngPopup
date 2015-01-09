ngPopup.directive("ngPopUp",function($parse,$document,$templateCache, $compile, ngPopupBuilder){

    return{
        restrict: "EA",
        scope:{
            option:"="
        },
        replace:true,
        template:'<div class="ngPopup"></div>',
        link: function(scope, element, attrs){

            var $element = element[0];
            var $option = ngPopupBuilder.getDefaultOptions();
            $option = scope.option;

            scope.$parent.$watch(attrs.option,function(value){
                $element.style.position = 'absolute';
                $element.style.width = $option.width + 'px';
                $element.style.height = $option.height + 'px';
                $element.style.top = $option.position.top + 'px';
                $element.style.left = $option.position.left + 'px';
            },true)

            var modelName = $parse($option.modelName);
            modelName.assign(scope.$parent, ngPopupBuilder.getDefaultMethods(element));



            var html = ngPopupBuilder.layoutInit($option);
            var compiledHtml = $compile(html)(scope.$parent);
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

                    $document.find('body').addClass('unselectable');
                    $document.bind("mousemove", function (event) {

                        $element.style.top = event.pageY - origY + targetTop + "px";
                        $element.style.left = event.pageX - origX + targetLeft + "px";
                        scope.$parent.$eval(attrs.option).position.top =  event.pageY - origY + targetTop;
                        scope.$parent.$eval(attrs.option).position.left = event.pageX - origX + targetLeft;
                        scope.$parent.$apply();
                    })
                }

                if(target.parent().hasClass('resizeCorner')){
                    if($option.resizable == false) { $document.find('body').removeClass('unselectable'); return;}

                    $document.find('body').addClass('unselectable');
                    if(target.hasClass("right-bottom-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.height = event.pageY - $element.offsetTop  + "px";
                            $element.style.width =  event.pageX - $element.offsetLeft + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass("right-top-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass("left-top-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.left = event.pageX + "px";
                            $element.style.top = event.pageY + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass("left-bottom-corner")){
                        $document.bind("mousemove", function (event) {

                            $element.style.left = event.pageX + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }

                }

                if(target.parent().hasClass('resizeBar')){
                    if($option.resizable == false)  { $document.find('body').removeClass('unselectable'); return;}

                    $document.find('body').addClass('unselectable');
                    if(target.hasClass('left-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.left = targetLeft + event.pageX - origX + "px";
                            $element.style.width = targetWidth - event.pageX + origX + "px";
                            scope.$parent.$eval(attrs.option).position.left = event.pageX - origX + targetLeft;
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass('right-bar')){
                        $document.bind("mousemove", function (event) {

                            $element.style.width = targetWidth + event.pageX - origX + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass('top-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.top = event.pageY + "px";
                            $element.style.height = targetHeight - event.pageY + origY + "px";
                            scope.$parent.$eval(attrs.option).position.top =  event.pageY - origY + targetTop;
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                    else if(target.hasClass('bottom-bar')){
                        $document.bind("mousemove", function (event) {
                            $element.style.height = targetHeight + event.pageY - origY + "px";
                            scope.$parent.$eval(attrs.option).width =  $element.offsetWidth;
                            scope.$parent.$eval(attrs.option).height = $element.offsetHeight;
                            scope.$parent.$apply();
                        })
                    }
                }



            });

            element.bind("mouseup", function(event){
                $document.find('body').removeClass('unselectable');
                $document.unbind("mousemove");
            })







        }

    }
});