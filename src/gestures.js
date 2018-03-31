
(function(){
  // all touch objects {1:touchObject1,0:touchObject2};
  var touches  = {}; 
  // all active gestures 
  // [{identifiers:[0,2], name:'swipe', target:targetObject, params: {lastModifiedTime : 1478113115}}]            
  var gestures = []; 
  // get gestres names from string
  var dg = function(str){ 
      return str.split(/\s+/);
  };
  // Create new event
  var ce = function(t,n,p){
      var d = {bubbles: false,cancelable: true}; 
      var e = new CustomEvent(n,d);
      for(var i = 0; i < p.length; i++ )
          e[p[i][0]] = p[i][1];
      t.dispatchEvent(e);
  }
  // save touches @event, @eventKey, @type
  var st = function(e,k,j){
      var t;
      for(var i = 0; i < e[k].length; i++ ){
          t = e[k][i];
          touches[t.identifier] = {type:j,timeStamp: ts(),clientX:t.clientX,clientY:t.clientY,force:t.force,identifier:t.identifier,pageX:t.pageX,pageY:t.pageY,radiusX:t.radiusX,radiusY:t.radiusY,rotationAngle:t.rotationAngle,screenX:t.screenX,screenY:t.screenY};
      }                
  }
  // get event all taches @event
  var at = function(e){ 
      var t = [];
      for(var l = 0; l < e.changedTouches.length; l++ ) t.push(e.changedTouches[l]);
      for(var l = 0; l < e.touches.length; l++ ) t.push(e.touches[l]);
      return t;              
  }
  // get touches @event, @identifiers
  var gt = function(t,i){  
      var l = [];
      for(var j = 0; j < t.length; j++)
          if(i.indexOf(t[j].identifier)>-1)
              l.push(t[j]);
      return l;
  }
  // array column @data, @key
  var ac = function(data, key ){ 
      var keys = [];
      for(var i = 0; i < data.length; i++)
          keys.push(data[i][key]);  
      return keys;
  };
  // gestures indexes @identifiers
  var gi = function( identifiers ){
      var indexes = [];
      var j;
      for(var j = 0; j < gestures.length; j++){
          for(var i = 0; i < gestures[j].identifiers.length; i++){
              if(identifiers.indexOf(gestures[j].identifiers[i]) > -1){
                  if( indexes.indexOf(j) < 0 ){
                      indexes.push(j);
                  }
              }
          }
      }                
      return indexes;   
  };
  // remove gestures @indexes
  var rg = function(indexes){
      var g = [];
      for(var i = 0; i < gestures.length; i++){
          if( indexes.indexOf(i) === -1 )
              g.push(gestures[i]);
      }
      gestures = g;
  };
  // timeStamp
  var ts = function(){
      return Date.now();
  };
  // touch X @touch
  var tx = function(t){
      return t.clientX;  
  };
  // touch Y @touch
  var ty = function(t){
      return t.clientY;  
  };
  // element coordinats @element
  var ec = function (e) { 
      var g = !0;
      var x = 0; var h = e.clientHeight; 
      var y = 0; var w = e.clientWidth;
      while (e || g) {
          if (e.tagName == "BODY") {
              var xScroll = e.scrollLeft || document.documentElement.scrollLeft;
              var yScroll = e.scrollTop || document.documentElement.scrollTop;
              x += (e.offsetLeft - xScroll + e.clientLeft);
              y += (e.offsetTop - yScroll + e.clientTop);
              g = !1;
          } 
          else {
              x += (e.offsetLeft - e.scrollLeft + e.clientLeft);
              y += (e.offsetTop - e.scrollTop + e.clientTop);
          }
          e = e.offsetParent;
      }
      return {x:x,y:y,w:w,h:h};
  };

  // get property
  var gp = function(el,v){
      var st = window.getComputedStyle(el, null);
      return  st.getPropertyValue("-webkit-"+v) ||
              st.getPropertyValue("-moz-"+v) ||
              st.getPropertyValue("-ms-"+v) ||
              st.getPropertyValue("-o-"+v) ||
              st.getPropertyValue(v) || 'none';
  };

  // calculate angle of element
  var ea = function(el){
      var t = gp(el,"transform");
      if( t === 'none') return 0;
      var v = t.split('(')[1].split(')')[0].split(',');
      return Math.round(Math.atan2(v[1], v[0]) * (180/Math.PI));
  };

  // calculate element transform origin
  var eo = function(el){
      var t = gp(el,"transform-origin");
      if( t === 'none') return {x: 0.5,y: 0.5};
      var v = t.match(/[\d]+(\.[\d]+)?/g);
      console.log(v)
      return (t.indexOf('px') > -1) ? 
          {   
              x: v[0]/el.offsetWidth,
              y: v[1]/el.offsetHeight
          } : 
          {   x: v[0]/100,
              y: 100-v[1]/100
          };
  };


  // element touches @element @allTouches
  var et = function(e,t){
      var l = [],x,y,c;
      for(var i = 0; i < t.length; i++){
          x = tx(t[i]); 
          y = ty(t[i]);
          c = ec(e);
          if(x > c.x && y > c.y && x < c.x + c.w && y < c.y + c.h ){
              l.push(t[i]);
          }
      }
      return l;
  };
  
  // calculate аngle
  var ca = function(x1,y1,x2,y2){
      return Math.atan2((y2-y1),(x2-x1))*(180/Math.PI);
  };

  // calculate distance
  var cd = function(x1,y1,x2,y2){
      return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
  };

  // get middle position
  var gm = function(i1,i2){
      return Math.min(i1,i2)+Math.abs(i1-i2)/2;
  };
  
  // gesture functions
  var gf = {
      swipe : {
          // @event @elementTouchees
          start : function(e,t){
              if(t.length == 1 && t.length == 1)
                  return  {identifiers:[t[0].identifier],params:{startedTime:ts(),x: tx(t[0]),y:ty(t[0])}};                        
              return false;
          },
          // @event @gestureTouchees, @gesture, @gestureIndex
          move : function(e, t, g, j){
              // var l = et(e.target, e.touches);
              return ts() - touches[t[0].identifier].timeStamp > 100 ? false : true;
          },
          // @event @gestureTouchees, @gesture, @gestureIndex
          end : function(e, t, g, j) {
              var l = et(g.target, at(e));
              var x1 = tx(t[0])-g.params.x;
              var y1 = ty(t[0])-g.params.y;
              if( l.length < 2 && (ts() - g.params.startedTime < 400) && (Math.abs(x1) > 10 || Math.abs(y1) > 10))
                  ce(g.target,'onswipe',[['x',x1],['y',y1]]);
              return true;
          }
      },
      tap : {
          start : function(e,t){
              if(t.length == 1)
                  return  {identifiers:[t[0].identifier],params:{startedTime:ts(),x: tx(t[0]),y:ty(t[0])}};
              return false;
          },
          move : function(e, t, g, j){return true;},
          end : function(e, t, g, j){
              var l = et(g.target, at(e));
              var x1 = tx(t[0])-g.params.x;
              var y1 = ty(t[0])-g.params.y;
              if( l.length == 1 &&  ts() - g.params.startedTime < 150 && (Math.abs(x1) < 11 && Math.abs(y1) < 11) ) 
                  ce(g.target,'ontap',[]);
              return true;
          }
      },
      tap2 : {
          start : function(e,t){
              if( t.length === 2){
                  var i = touches[t[0].identifier];
                  if(i.type == 'start'){
                      return {identifiers:[t[0].identifier,t[1].identifier],params:{startedTime:i.timeStamp}};
                  }
              }
              return false;
          },
          move : function(e, t, g, j){ return true;},
          end : function(e, t, g, j){
              if( ts() - g.params.startedTime < 700){
                 ce(g.target,'ontap2',[]);
              }
              return true;
          }
      },
      rotate : {
          start : function(e,t){
              if( t.length === 2){

                  var ia = ca(tx(t[0]),ty(t[0]),tx(t[1]),ty(t[1]));
                  var oa = ea(e.target);
                  var oo = eo(e.target);
                  var co = ec(e.target); 

                  // Absolute position of focus of rotation
                  var fx = co.x + oo.x*co.w;
                  var fy = co.y + oo.y*co.h;

                  // Absolute position tached focus
                  var x1 = tx(t[0]), y1 = ty(t[0]), x2 = tx(t[1]), y2 = ty(t[1]);
                  var px = gm(x1,x2), py = gm(y1,y2);

                  // calculate angle
                  var a = ca(fx,fy,px,py);

                  // calculate of sin & cos                            
                  var cs = Math.cos((oa-a)*Math.PI/180); 
                  var sn = Math.sin((oa-a)*Math.PI/180);

                  // radius
                  var r = Math.sqrt((px-fx)*(px-fx) + (py-fy)*(py-fy));

                  var ox = co.x + co.w/2; var oy = co.y + co.h/2;
                  
                  // calculate rotation
                  var rx = fx + cs*r;
                  var ry = fy - sn*r;

                  // calculate of factors by percents
                  var cx = (rx-co.x)*100/co.w;
                  var cy = ((ry-co.y)*100/co.h);

                  return {
                      identifiers:[t[0].identifier,t[1].identifier],
                      params:{
                          angle:oa,
                          lastАngle:ia, 
                          initialAngle: ia,
                          transformOrigin: {x:cx,y:cy},
                          transformDelta : {x:px-ox,y:py-oy}
                      }
                  };
              }
              return false;
          },
          move : function(e, t, g, j){ 
              var p  = g.params;
              var t1 = touches[g.identifiers[0]];
              var t2 = touches[g.identifiers[1]];
              var al = ca(tx(t1),ty(t1),tx(t2),ty(t2));
              p.angle += (al-p.lastАngle);
              ce(g.target,'onrotate',[
                  ['angle' , p.angle],
                  ['angleOffset',al-p.lastАngle],
                  ['transformOrigin',p.transformOrigin],
                  ['transformDelta',p.transformDelta]
              ]);
              p.lastАngle = al;
              return true;
          },
          end : function(e, t, g, j){
              var p  = g.params;
              ce(g.target,'onrotateend',[
                  ['angle' , p.angle],
                  ['angleOffset',0],
                  ['transformOrigin',p.transformOrigin],
                  ['transformDelta',p.transformDelta]
              ]);
              return true;
          }
      },

      singlerotate : {
          start : function(e,t){
              if( t.length === 1){
                  var c = ec(e.target);
                  var x0 = c.x+Math.round(c.w/2), y0 = c.y+Math.round(c.h/2);
                  var x1 = tx(t[0]), y1 = ty(t[0]);
                  var ia = ca(x0,y0,x1,y1);
                  var oa = ea(e.target);
                  return {identifiers:[t[0].identifier],params:{angle:oa,lastАngle:ia,x0:x0,y0:y0}};
              }
              return false;
          },
          move : function(e, t, g, j){ 
              var p = g.params;
              var t = touches[g.identifiers[0]];
              var a = ca(p.x0,p.y0,tx(t),ty(t));

              p.angle += (a-p.lastАngle);
              ce(g.target,'onsinglerotate',[
                  ['аngle',p.angle],
                  ['angleOffset',a-p.lastАngle]
              ]);
              p.lastАngle = a;
              return true;
          },
          end : function(e, t, g, j){
              return true;
          }
      },
      pan : {
          start : function(e,t){
              if(t.length == 1 && t.length == 1)
                  return  {identifiers:[t[0].identifier],params:{startedTime:ts(),x: tx(t[0]),y:ty(t[0]),x0: tx(t[0]),y0:ty(t[0])}};                        
              return false;
          },
          move : function(e, t, g, j){
              var p = g.params;
              var x = tx(t[0]);
              var y = ty(t[0]);
                  ce(g.target,'onpan',[['x0',p.x0],['y0',p.y0],['deltaX',x-p.x],['deltaY',y-p.y]]);
              p.x = x;
              p.y = y;
              return true;
          },
          end : function(e, t, g, j) {
              return true;
          }
      },
      pinch : {
          start : function(e,t){
              if( t.length === 2){
                  var x1 = tx(t[0]), y1 = ty(t[0]), x2 = tx(t[1]), y2 = ty(t[1]);
                  var px = gm(x1,x2);
                  var py = gm(y1,y2);
                  return {identifiers:[t[0].identifier,t[1].identifier],params:{px:px,py:py,x10:tx(t[0]),y10:ty(t[0]),x20:tx(t[1]),y20:ty(t[1]),x1:tx(t[0]),y1:ty(t[0]),x2:tx(t[1]),y2:ty(t[1]),distanceInitial:cd(x1,y1,x2,y2)}};
              }
              return false;
          },
          move : function(e, t, g, j){
              var p = g.params, c = ec(g.target);
              var t1 = touches[g.identifiers[0]],t2 = touches[g.identifiers[1]];
              var x1 = tx(t1), y1 = ty(t1), x2 = tx(t2), y2 = ty(t2);
              var d1 = cd(p.x1,p.y1,p.x2,p.y2), d2 = cd(x1,y1,x2,y2);
              var px = gm(x1,x2), py = gm(y1,y2); 
                  ce(g.target,'onpinch',[
                      ['focus',{x:px,y:py}],
                      ['focusOffset',{x:px-p.px,y:py-p.py}],
                      ['distance',d2],
                      ['distanceOffset',d2-d1],
                      ['distanceInitial',p.distanceInitial],
                      ['factor',d2/p.distance],
                      ['factorOffset',d2/d1],
                      ['targetFocus',{x:((px-c.x)/c.w),y:((py-c.y)/c.h)}]]
                  );
              p.x1 = x1; p.y1 = y1;p.x2 = x2;p.y2 = y2;
              p.px = px; p.py = py;

              return true;
          },
          end : function(e, t, g, j){
              return true;
          }
      },
      press : {
          start : function(e,t){
              if(t.length == 1)
                  return  {identifiers:[t[0].identifier],params:{startedTime:ts(),x: tx(t[0]),y:ty(t[0])}};
              setTimeout(function(){

              });
              return false;
          },
          move : function(e, t, g, j){return true;},
          end : function(e, t, g, j){
              var l = et(g.target, at(e));
              var x1 = tx(t[0])-g.params.x;
              var y1 = ty(t[0])-g.params.y;
              if( l.length == 1 && ((ts() - g.params.startedTime) > 150) && (Math.abs(x1) < 11 && Math.abs(y1) < 11) ) 
                  ce(g.target,'onpress',[]);
              return true;
          }
      }
  };

  document.addEventListener("touchstart", function(e){
      var b = true,el = e.target; 
      var o,g;
      while( el !== null && b ){
          if( typeof el.dataset.gestures !== 'undefined' ){
              var n = dg(el.dataset.gestures);
              for(var j = 0; j < n.length; j++ ){
                  g = n[j];
                  if (g === 'none') {
                      e.preventDefault();b = !1;break;
                  }
                  else if( typeof g !== 'undefined' ){
                      if( gf.hasOwnProperty(g) ){
                          var t = e.target === el ? e.targetTouches : et(el, e.touches);
                          e.target = el;
                          o = gf[g].start(e, t);
                          if( typeof o === 'object' ){
                              gestures.push({ identifiers : o.identifiers, name: g, target: el, params: o.params });
                              if( typeof el.dataset.gesturesBubbling !== 'undefined' && el.dataset.gesturesBubbling === 'false' ){
                                  e.preventDefault();b = !1;
                              }
                          }
                      }
                  }   
              }
          }
          el = typeof el.parentNode.dataset === 'undefined' ? null : el.parentNode;
      }
      st(e,'changedTouches','start');
  });    

  document.addEventListener("touchmove", function(e){
      var d = [];
      var i = gi( ac(e.changedTouches, 'identifier'));                
      for(var j = 0; j < i.length; j++ ){
          var g = gestures[i[j]];
          if(!gf[g.name].move(e, gt(e.touches,g.identifiers),g,i[j])){
              d.push( i[j] );
          }
      }
      if(d.length) rg(d);
      if (i.length>0) e.preventDefault();

      st(e,'changedTouches','move');
  }); 

  document.addEventListener("touchend", function(e){
      var d = [];
      var i = gi( ac(e.changedTouches, 'identifier'));
      for(var j = 0; j < i.length; j++){
          var g = gestures[i[j]];
          if(gf[g.name].end(e,gt( at(e),g.identifiers),g,i[j])){
              d.push(i[j]);
          }
      }
      for(var l = 0; l < e.changedTouches.length; l++ ){
          delete touches[e.changedTouches[l].identifier];
      }
      if(d.length) rg(d);
  });             
}());
