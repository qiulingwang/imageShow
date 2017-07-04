require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let imageDatas = require('../data/imageDatas.json');
imageDatas =(function loadUrl(imageDatas){
  for(let i=0;i<imageDatas.length;i++){
    imageDatas[i].iamgeUrl = require('../images/'+imageDatas[i].fileName);
  }
})(imageDatas);



let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
