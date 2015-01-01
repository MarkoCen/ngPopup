#ngPopup
-----
ngPopup is a jQuery-independent modeless dialog, it has only dependency on [AngularJS], it has super easy-to-use options and methods, with fully customized theme.

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
    width: 500,
    height:500,
    templateUrl:"../views/ngPopupContents.html",
    resizable:true,
    draggable:true,
    position: { top : 500, left : 500},
    onOpen: function(){
    	/*Some Logic...*/
    }
}
```
3 Call dialog methods by ```$scope.modelName``` :
```javascript
$scope.myNgPopup.open();
```
##API

####Options
####Methods
####Events
[download]:https://github.com/MarkoCen/ngPopup/tree/master/dist
[Bower]:http://bower.io/
[AngularJS]:https://angularjs.org/
