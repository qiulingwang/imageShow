require('styles/main.styl');

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

//加载json数据，并为每个json对象赋予imageUrl属性
let imageDatas = require('../data/imageDatas.json');
imageDatas = (function loadUrl(imageDatas) {
    for (let i = 0; i < imageDatas.length; i++) {
        imageDatas[i].imageUrl = require('../images/' + imageDatas[i].fileName);
    }
    return imageDatas;
})(imageDatas);

//获取区间内的一个随机值
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
//获取0-30°之间一个任意正负值
let get30DegRandom = () => (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30)

class ImgFigure extends Component {

    handleClick = e => {
        e.stopPropagation();
        e.preventDefault();
        if (this.props.arrange.isCenter) {
            this.props.inverse()
        } else {
            this.props.center()
        }
    }

    render() {
        let styleObj = {};
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos
        }

        if (this.props.arrange.rotate) {
            (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
                styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            })
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        let imgClassName = "img-figure"
        imgClassName += this.props.arrange.isInverse ? " is-inverse" : ""

        return (
            <figure className={imgClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.title}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class ControllerUnit extends Component {
    constructor(props) {
        super(props);
    }
    handleClick = e => {
        e.stopPropagation();
        e.preventDefault();
        if (this.props.arrange.isCenter) {
            this.props.inverse()
        } else {
            this.props.center()
        }
    }
    render() {
        let controllerUnitClassName = 'controller-unit';
        //如果对应的是居中的图片，显示控制按钮的居中态
        if (this.props.arrange.isCenter) {
            controllerUnitClassName += ' is-center ';
            //如果翻转显示翻转状态
            if (this.props.arrange.isInverse) {
                controllerUnitClassName += 'is-inverse'
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        )
    }
}


class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {     //水平方向取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {     //垂直方向的取值范围
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: [
                // {
                //   pos: {
                //     left: '0',
                //     top: '0'
                //   },
                //   rotate: 0, //旋转角度
                //   isInverse: false,//正反面
                //   isCenter: false //图片是否居中
                // }
            ]
        }
    }

    //翻转图片的函数
    inverse(index) {
        return () => {
            let imgsArrangArr = this.state.imgsArrangeArr;
            imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangArr
            })
        }
    }

    center(index) {
        return () => {
            this.rearrange(index)
        }
    }

    //重新布局所有图片
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangTopArr = [],

            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpiceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //首先居中centerIndex图片 ,centerIndex图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        }
        //取出要布局上测的图片的状态信息
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
        //布局位于上侧的图片
        imgsArrangTopArr.forEach((value, index) => {
            imgsArrangTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        //布局左两侧的图片
        // k = 7
        for (let i = 0, k = imgsArrangeArr.length / 2; i < imgsArrangeArr.length; i++) {
            let hPosRangeLORX = null;

            //前半部分布局左边,右边部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX
            }
            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        }
        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
            imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    componentDidMount() {
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        //计算左侧,右侧区域图片排布的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;
        //计算上测区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        let num = Math.floor(Math.random() * imageDatas.length);
        this.rearrange(num);
    }

    render() {
        let controllerUnits = [], imgFigures = [];
        imageDatas.map((val, index) => {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={val} key={index} ref={'imgFigure' + index}
                                       arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                       center={this.center(index)}/>)
            controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                                 center={this.center(index)}/>)
        })

        return (
            <section className="stage" ref="stage">
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
