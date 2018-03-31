
JavaScript Gestures Detector
==========

## Getting started

Initialize this script then open code inspector and follow your console logs.
This library works only for mobile mode

```html
<script src="./src/gestures.js"></script>
```

### Swipe

```html
<div id="swipe-example"data-gestures="swipe">
    Swipe Me
</div>
<script>
    var elm = document.getElementById('swipe-example');
    elm.addEventListener("onswipe",function(e){
    });
</script>
```

### Tap & Double Tap (Tapping with two fingers)

```html
 <div id="tap-example" data-gestures="tap" >
    Tap Me
</div>
<div id="tap2-example" data-gestures="tap2" >
    Double Tap Me
</div>
<script>
    var elm1 = document.getElementById('tap-example');
    elm1.addEventListener("ontap",function(e){
    });    

    var elm2 = document.getElementById('tap2-example');
    elm2.addEventListener("ontap2",function(e){

    });
</script>
```

### Rotate With Two Fingers

```html
<div id="rotate-example" data-gestures="rotate" >
    Rotate Me
</div>

<script>
    var elm = document.getElementById('rotate-example');
    elm.addEventListener("onrotate",function(e){            
    });
</script>
```


### Rotate With Single Finger

```html
<div id="rotate-single-example" data-gestures="singlerotate" >
    Rotate Me
</div>
<script>
    var elm = document.getElementById('rotate-single-example');
    elm.addEventListener("onsinglerotate",function(e){
    });
</script>
```

### Pan

```html
<div id="pan-example" data-gestures="pan" >
    Pin Me
</div>

<script>
    var elm = document.getElementById('pan-example');
    elm.addEventListener("onpan",function(e){
    });
</script>
```


### Pinch

```html
<div id="pinch-example" data-gestures="pinch" >
    Pinch Me
</div>

<script>
    var elm = document.getElementById('pinch');
        elm.addEventListener("onpinch",function(e){
    });
</script>
```

### Press

```html
<div id="press-example" data-gestures="press" >
    Press Me
</div>

<script>
    var elm = document.getElementById('press');
        elm.addEventListener("onpinch",function(e){
    });
</script>
```