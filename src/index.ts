import './styles/styles.css'
import GameController from './GameController';

GameController.getInstance();

function browserInfo() {
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
  }

  function isLiveCameraSupported() {
    let name, version
    [name, version] = browserInfo()
    console.log(name, version)
    switch(name) {
      case 'Chrome':
        if (version.split('.')[0] >= '57')
        break
    }

    return true
  }

  isLiveCameraSupported()

// javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
