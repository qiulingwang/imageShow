require('styles/main.styl');

import React,{Component} from 'react';

//加载json数据，并为每个json对象赋予imageUrl属性
let imageDatas = require('../data/imageDatas.json');
imageDatas = (function loadUrl(imageDatas) {
  for (let i = 0; i < imageDatas.length; i++) {
    imageDatas[i].imageUrl = require('../images/' + imageDatas[i].fileName);
  }
  return imageDatas;
})(imageDatas);

class ImgFigure extends Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends Component {

  render() {
    let controllerUnits = [],imgFigures=[];
    imageDatas.map((val,index) => {
      imgFigures.push(<ImgFigure data={val} key={index} />)
    })

    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
