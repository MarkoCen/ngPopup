#ngPopup
-----

ngPopup is a jQuery-independent modal / modeless dialog, it has only dependency on AngularJS, it has super easy-to-use options and methods, with fully customized theme.

[Demo]

[API]
##Install

First [download] ```ngPopup.js``` ```ngPopupStyle.css```, or install througth [Bower]
```
bower install ng-popup
```
Include it in your html page :

```html
<link rel='stylesheet' href='ngPopupStyle.css'>
<script src='ngPopup.js'></script>
```


Then add dependency in your AngularJS App :
```javascript
angular.module("yourApp",["ngPopup"]);
```

##Quick-start Example

1 Insert ngPopup directive in DOM, and specify option object by ```option``` attribute :
```html
<ng-pop-up option='ngPopupConfig'></ng-pop-up>
```
2 Define configurations in controller :

```javascript
$scope.ngPopupConfig = {
	modelName: "myNgPopup",
    width: $scope.inputWidth,
    height:$scope.inputHeight,
    templateUrl:"../views/ngPopupContents.html",
    resizable:true,
    draggable:true,
    position: { top : 500, left : 500},
    onOpen: function(){
    	/*Some Logic...*/
    }
}
```
You can also call dialog methods by ```$scope.modelName``` which modelName is the property defined in option :
```javascript
$scope.myNgPopup.open(); $scope.myNgPopup.maximize();
```  
##Two-way Binding  


in ngPopup, the following properties support angular two-way binding (visit Wiki page for full property list):  
* position
* width
* height
* title
* isShow
* draggable
* resizable  
You can bind them to ngModel or set value in controller dynamically, see the two-way binding example in [Demo] page

##License
The MIT License

[download]:https://github.com/MarkoCen/ngPopup/tree/master/dist
[Bower]:http://bower.io/
[AngularJS]:https://angularjs.org/
[Demo]:http://markocen.github.io/#/ngPopup
[API]:https://github.com/MarkoCen/ngPopup/wiki/ngPopup
