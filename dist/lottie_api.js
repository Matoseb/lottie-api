(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.lottie_api = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Renderer = require('../renderer/Renderer');
var layer_api = require('../helpers/layerAPIBuilder');

function AnimationItemFactory(animation) {

	var state = {
		animation: animation,
		elements: animation.renderer.elements.map((item) => layer_api(item, animation)),
		boundingRect: null,
		scaleData: null
	}

	function getCurrentFrame() {
		return animation.currentFrame;
	}

	function getCurrentTime() {
		return animation.currentFrame / animation.frameRate;
	}

	function addValueCallback(properties, value) {
		var i, len = properties.length;
		for (i = 0; i < len; i += 1) {
			properties.getPropertyAtIndex(i).setValue(value);
		}
	}

	function toKeypathLayerPoint(properties, point) {
		var i, len = properties.length;
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).toKeypathLayerPoint(point));
		}
		if(points.length === 1) {
			return points[0];
		}
		return points;
	}

	function fromKeypathLayerPoint(properties, point) {
		var i, len = properties.length;
		var points = [];
		for (i = 0; i < len; i += 1) {
			points.push(properties.getPropertyAtIndex(i).fromKeypathLayerPoint(point));
		}
		if(points.length === 1) {
			return points[0];
		}
		return points;
	}

	function calculateScaleData(boundingRect) {
		var compWidth = animation.animationData.w;
        var compHeight = animation.animationData.h;
		var compRel = compWidth / compHeight;
        var elementWidth = boundingRect.width;
        var elementHeight = boundingRect.height;
        var elementRel = elementWidth / elementHeight;
        var scale,scaleXOffset,scaleYOffset;
        var xAlignment, yAlignment, scaleMode;
        var aspectRatio = animation.renderer.renderConfig.preserveAspectRatio.split(' ');
        if(aspectRatio[1] === 'meet') {
        	scale = elementRel > compRel ? elementHeight / compHeight : elementWidth / compWidth;
        } else {
        	scale = elementRel > compRel ? elementWidth / compWidth : elementHeight / compHeight;
        }
        xAlignment = aspectRatio[0].substr(0,4);
        yAlignment = aspectRatio[0].substr(4);
        if(xAlignment === 'xMin') {
        	scaleXOffset = 0;
        } else if(xAlignment === 'xMid') {
        	scaleXOffset = (elementWidth - compWidth * scale) / 2;
        } else {
        	scaleXOffset = (elementWidth - compWidth * scale);
        }

        if(yAlignment === 'YMin') {
	        scaleYOffset = 0;
        } else if(yAlignment === 'YMid') {
	        scaleYOffset = (elementHeight - compHeight * scale) / 2;
        } else {
	        scaleYOffset = (elementHeight - compHeight * scale);
        }
        return {
        	scaleYOffset: scaleYOffset,
        	scaleXOffset: scaleXOffset,
        	scale: scale
        }
	}

	function recalculateSize(container) {
		var container = animation.wrapper;
		state.boundingRect = container.getBoundingClientRect();
		state.scaleData = calculateScaleData(state.boundingRect);
	}

	function toContainerPoint(point) {
		if(!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if(!state.boundingRect) {
			recalculateSize();
		}

		var boundingRect = state.boundingRect;
		var newPoint = [point[0] - boundingRect.left, point[1] - boundingRect.top];
		var scaleData = state.scaleData;

        newPoint[0] = (newPoint[0] - scaleData.scaleXOffset) / scaleData.scale;
        newPoint[1] = (newPoint[1] - scaleData.scaleYOffset) / scaleData.scale;

		return newPoint;
	}

	function fromContainerPoint(point) {
		if(!animation.wrapper || !animation.wrapper.getBoundingClientRect) {
			return point;
		}
		if(!state.boundingRect) {
			recalculateSize();
		}
		var boundingRect = state.boundingRect;
		var scaleData = state.scaleData;

		var newPoint = [point[0] * scaleData.scale + scaleData.scaleXOffset, point[1] * scaleData.scale + scaleData.scaleYOffset];

		var newPoint = [newPoint[0] + boundingRect.left, newPoint[1] + boundingRect.top];
		return newPoint;
	}

	function getScaleData() {
		return state.scaleData;
	}

	var methods = {
		recalculateSize: recalculateSize,
		getScaleData: getScaleData,
		toContainerPoint: toContainerPoint,
		fromContainerPoint: fromContainerPoint,
		getCurrentFrame: getCurrentFrame,
		getCurrentTime: getCurrentTime,
		addValueCallback: addValueCallback,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}

	return Object.assign({}, Renderer(state), methods);
}

module.exports = AnimationItemFactory;
},{"../helpers/layerAPIBuilder":6,"../renderer/Renderer":42}],2:[function(require,module,exports){
module.exports = ',';
},{}],3:[function(require,module,exports){
module.exports = {
	 0: 0,
	 1: 1,
	 2: 2,
	 3: 3,
	 4: 4,
	 5: 5,
	 13: 13,
	'comp': 0,
	'composition': 0,
	'solid': 1,
	'image': 2,
	'null': 3,
	'shape': 4,
	'text': 5,
	'camera': 13
}
},{}],4:[function(require,module,exports){
module.exports = {
	LAYER_TRANSFORM: 'transform'
}
},{}],5:[function(require,module,exports){
var key_path_separator = require('../enums/key_path_separator');
var sanitizeString = require('./stringSanitizer');

module.exports = function(propertyPath) {
	var keyPathSplit = propertyPath.split(key_path_separator);
	var selector = keyPathSplit.shift();
	return {
		selector: sanitizeString(selector),
		propertyPath: keyPathSplit.join(key_path_separator)
	}
}
},{"../enums/key_path_separator":2,"./stringSanitizer":7}],6:[function(require,module,exports){
var TextElement = require('../layer/text/TextElement');
var ShapeElement = require('../layer/shape/Shape');
var NullElement = require('../layer/null_element/NullElement');
var SolidElement = require('../layer/solid/SolidElement');
var ImageElement = require('../layer/image/ImageElement');
var CameraElement = require('../layer/camera/Camera');
var LayerBase = require('../layer/LayerBase');


module.exports = function getLayerApi(element, parent) {
	var layerType = element.data.ty;
	var Composition = require('../layer/composition/Composition');
	switch(layerType) {
		case 0:
		return Composition(element, parent);
		case 1:
		return SolidElement(element, parent);
		case 2:
		return ImageElement(element, parent);
		case 3:
		return NullElement(element, parent);
		case 4:
		return ShapeElement(element, parent, element.data.shapes, element.itemsData);
		case 5:
		return TextElement(element, parent);
		case 13:
		return CameraElement(element, parent);
		default:
		return LayerBase(element, parent);
	}
}
},{"../layer/LayerBase":13,"../layer/camera/Camera":15,"../layer/composition/Composition":16,"../layer/image/ImageElement":20,"../layer/null_element/NullElement":21,"../layer/shape/Shape":22,"../layer/solid/SolidElement":35,"../layer/text/TextElement":38}],7:[function(require,module,exports){
function sanitizeString(string) {
	return string.trim();
}

module.exports = sanitizeString
},{}],8:[function(require,module,exports){
var createTypedArray = require('./typedArrays')

/*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.
 *
 * All values are handled as floating point values.
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - shear y
 * @prop {number} c - shear x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
 * @constructor
 */

var Matrix = (function(){

    var _cos = Math.cos;
    var _sin = Math.sin;
    var _tan = Math.tan;
    var _rnd = Math.round;

    function reset(){
        this.props[0] = 1;
        this.props[1] = 0;
        this.props[2] = 0;
        this.props[3] = 0;
        this.props[4] = 0;
        this.props[5] = 1;
        this.props[6] = 0;
        this.props[7] = 0;
        this.props[8] = 0;
        this.props[9] = 0;
        this.props[10] = 1;
        this.props[11] = 0;
        this.props[12] = 0;
        this.props[13] = 0;
        this.props[14] = 0;
        this.props[15] = 1;
        return this;
    }

    function rotate(angle) {
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
    }

    function rotateX(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin,  mCos, 0, 0, 0, 0, 1);
    }

    function rotateY(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos,  0,  mSin, 0, 0, 1, 0, 0, -mSin,  0,  mCos, 0, 0, 0, 0, 1);
    }

    function rotateZ(angle){
        if(angle === 0){
            return this;
        }
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
    }

    function shear(sx,sy){
        return this._t(1, sy, sx, 1, 0, 0);
    }

    function skew(ax, ay){
        return this.shear(_tan(ax), _tan(ay));
    }

    function skewFromAxis(ax, angle){
        var mCos = _cos(angle);
        var mSin = _sin(angle);
        return this._t(mCos, mSin,  0, 0, -mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1)
            ._t(1, 0,  0, 0, _tan(ax),  1, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1)
            ._t(mCos, -mSin,  0, 0, mSin,  mCos, 0, 0, 0,  0,  1, 0, 0, 0, 0, 1);
        //return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }

    function scale(sx, sy, sz) {
        sz = isNaN(sz) ? 1 : sz;
        if(sx == 1 && sy == 1 && sz == 1){
            return this;
        }
        return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }

    function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        this.props[0] = a;
        this.props[1] = b;
        this.props[2] = c;
        this.props[3] = d;
        this.props[4] = e;
        this.props[5] = f;
        this.props[6] = g;
        this.props[7] = h;
        this.props[8] = i;
        this.props[9] = j;
        this.props[10] = k;
        this.props[11] = l;
        this.props[12] = m;
        this.props[13] = n;
        this.props[14] = o;
        this.props[15] = p;
        return this;
    }

    function translate(tx, ty, tz) {
        tz = tz || 0;
        if(tx !== 0 || ty !== 0 || tz !== 0){
            return this._t(1,0,0,0,0,1,0,0,0,0,1,0,tx,ty,tz,1);
        }
        return this;
    }

    function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {

        var _p = this.props;

        if(a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0){
            //NOTE: commenting this condition because TurboFan deoptimizes code when present
            //if(m2 !== 0 || n2 !== 0 || o2 !== 0){
                _p[12] = _p[12] * a2 + _p[15] * m2;
                _p[13] = _p[13] * f2 + _p[15] * n2;
                _p[14] = _p[14] * k2 + _p[15] * o2;
                _p[15] = _p[15] * p2;
            //}
            this._identityCalculated = false;
            return this;
        }

        var a1 = _p[0];
        var b1 = _p[1];
        var c1 = _p[2];
        var d1 = _p[3];
        var e1 = _p[4];
        var f1 = _p[5];
        var g1 = _p[6];
        var h1 = _p[7];
        var i1 = _p[8];
        var j1 = _p[9];
        var k1 = _p[10];
        var l1 = _p[11];
        var m1 = _p[12];
        var n1 = _p[13];
        var o1 = _p[14];
        var p1 = _p[15];

        /* matrix order (canvas compatible):
         * ace
         * bdf
         * 001
         */
        _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
        _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2 ;
        _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2 ;
        _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2 ;

        _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2 ;
        _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2 ;
        _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2 ;
        _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2 ;

        _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2 ;
        _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2 ;
        _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2 ;
        _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2 ;

        _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2 ;
        _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2 ;
        _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2 ;
        _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2 ;

        this._identityCalculated = false;
        return this;
    }

    function isIdentity() {
        if(!this._identityCalculated){
            this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
            this._identityCalculated = true;
        }
        return this._identity;
    }

    function equals(matr){
        var i = 0;
        while (i < 16) {
            if(matr.props[i] !== this.props[i]) {
                return false;
            }
            i+=1;
        }
        return true;
    }

    function clone(matr){
        var i;
        for(i=0;i<16;i+=1){
            matr.props[i] = this.props[i];
        }
    }

    function cloneFromProps(props){
        var i;
        for(i=0;i<16;i+=1){
            this.props[i] = props[i];
        }
    }

    function applyToPoint(x, y, z) {

        return {
            x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
            y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
            z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
        };
        /*return {
         x: x * me.a + y * me.c + me.e,
         y: x * me.b + y * me.d + me.f
         };*/
    }
    function applyToX(x, y, z) {
        return x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12];
    }
    function applyToY(x, y, z) {
        return x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13];
    }
    function applyToZ(x, y, z) {
        return x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14];
    }

    function inversePoint(pt) {
        var determinant = this.props[0] * this.props[5] - this.props[1] * this.props[4];
        var a = this.props[5]/determinant;
        var b = - this.props[1]/determinant;
        var c = - this.props[4]/determinant;
        var d = this.props[0]/determinant;
        var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12])/determinant;
        var f = - (this.props[0] * this.props[13] - this.props[1] * this.props[12])/determinant;
        return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }

    function inversePoints(pts){
        var i, len = pts.length, retPts = [];
        for(i=0;i<len;i+=1){
            retPts[i] = inversePoint(pts[i]);
        }
        return retPts;
    }

    function applyToTriplePoints(pt1, pt2, pt3) {
        var arr = createTypedArray('float32', 6);
        if(this.isIdentity()) {
            arr[0] = pt1[0];
            arr[1] = pt1[1];
            arr[2] = pt2[0];
            arr[3] = pt2[1];
            arr[4] = pt3[0];
            arr[5] = pt3[1];
        } else {
            var p0 = this.props[0], p1 = this.props[1], p4 = this.props[4], p5 = this.props[5], p12 = this.props[12], p13 = this.props[13];
            arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
            arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
            arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
            arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
            arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
            arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
        }
        return arr;
    }

    function applyToPointArray(x,y,z){
        var arr;
        if(this.isIdentity()) {
            arr = [x,y,z];
        } else {
            arr = [x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]];
        }
        return arr;
    }

    function applyToPointStringified(x, y) {
        if(this.isIdentity()) {
            return x + ',' + y;
        }
        return (x * this.props[0] + y * this.props[4] + this.props[12])+','+(x * this.props[1] + y * this.props[5] + this.props[13]);
    }

    function toCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var i = 0;
        var props = this.props;
        var cssValue = 'matrix3d(';
        var v = 10000;
        while(i<16){
            cssValue += _rnd(props[i]*v)/v;
            cssValue += i === 15 ? ')':',';
            i += 1;
        }
        return cssValue;
    }

    function to2dCSS() {
        //Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
        /*if(this.isIdentity()) {
            return '';
        }*/
        var v = 10000;
        var props = this.props;
        return "matrix(" + _rnd(props[0]*v)/v + ',' + _rnd(props[1]*v)/v + ',' + _rnd(props[4]*v)/v + ',' + _rnd(props[5]*v)/v + ',' + _rnd(props[12]*v)/v + ',' + _rnd(props[13]*v)/v + ")";
    }

    function MatrixInstance(){
        this.reset = reset;
        this.rotate = rotate;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
        this.skew = skew;
        this.skewFromAxis = skewFromAxis;
        this.shear = shear;
        this.scale = scale;
        this.setTransform = setTransform;
        this.translate = translate;
        this.transform = transform;
        this.applyToPoint = applyToPoint;
        this.applyToX = applyToX;
        this.applyToY = applyToY;
        this.applyToZ = applyToZ;
        this.applyToPointArray = applyToPointArray;
        this.applyToTriplePoints = applyToTriplePoints;
        this.applyToPointStringified = applyToPointStringified;
        this.toCSS = toCSS;
        this.to2dCSS = to2dCSS;
        this.clone = clone;
        this.cloneFromProps = cloneFromProps;
        this.equals = equals;
        this.inversePoints = inversePoints;
        this.inversePoint = inversePoint;
        this._t = this.transform;
        this.isIdentity = isIdentity;
        this._identity = true;
        this._identityCalculated = false;

        this.props = createTypedArray('float32', 16);
        this.reset();
    };

    return function() {
        return new MatrixInstance()
    }
}());

module.exports = Matrix;
},{"./typedArrays":9}],9:[function(require,module,exports){
var createTypedArray = (function(){
	function createRegularArray(type, len){
		var i = 0, arr = [], value;
		switch(type) {
			case 'int16':
			case 'uint8c':
				value = 1;
				break;
			default:
				value = 1.1;
				break;
		}
		for(i = 0; i < len; i += 1) {
			arr.push(value);
		}
		return arr;
	}
	function createTypedArray(type, len){
		if(type === 'float32') {
			return new Float32Array(len);
		} else if(type === 'int16') {
			return new Int16Array(len);
		} else if(type === 'uint8c') {
			return new Uint8ClampedArray(len);
		}
	}
	if(typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
		return createTypedArray;
	} else {
		return createRegularArray;
	}
}());

module.exports = createTypedArray;

},{}],10:[function(require,module,exports){
var AnimationItem = require('./animation/AnimationItem');

function createAnimationApi(anim) {
	return Object.assign({}, AnimationItem(anim));
}

module.exports = {
	createAnimationApi : createAnimationApi
}
},{"./animation/AnimationItem":1}],11:[function(require,module,exports){
var keyPathBuilder = require('../helpers/keyPathBuilder');
var layer_types = require('../enums/layer_types');

function KeyPathList(elements, node_type) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.getTargetLayer().data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
			return element.getTargetLayer().data.nm === name;
		});
	}

	function _filterLayerByProperty(elements, name) {
		return elements.filter(function(element) {
			if(element.hasProperty(name)) {
				return element.getProperty(name);
			}
			return false;
		});
	}

	function getLayersByType(selector) {
		return KeyPathList(_filterLayerByType(elements, selector), 'layer');
	}

	function getLayersByName(selector) {
		return KeyPathList(_filterLayerByName(elements, selector), 'layer');
	}

	function getPropertiesBySelector(selector) {
		return KeyPathList(elements.filter(function(element) {
			return element.hasProperty(selector);
		}).map(function(element) {
			return element.getProperty(selector);
		}), 'property');
	}

	function getLayerProperty(selector) {
		var layers = _filterLayerByProperty(elements, selector);
		var properties = layers.map(function(element){
			return element.getProperty(selector);
		})
		return KeyPathList(properties, 'property');
	}

	function getKeyPath(propertyPath) {
		var keyPathData = keyPathBuilder(propertyPath);
		var selector = keyPathData.selector;
		var nodesByName, nodesByType, selectedNodes;
		if (node_type === 'renderer' || node_type === 'layer') {
			nodesByName = getLayersByName(selector);
			nodesByType = getLayersByType(selector);
			if (nodesByName.length === 0 && nodesByType.length === 0) {
				selectedNodes = getLayerProperty(selector);
				
			} else {
				selectedNodes = nodesByName.concat(nodesByType);
			}
			if (keyPathData.propertyPath) {
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				return selectedNodes;
			}
		} else if(node_type === 'property') {
			selectedNodes = getPropertiesBySelector(selector);
			if (keyPathData.propertyPath) {
				
				return selectedNodes.getKeyPath(keyPathData.propertyPath);
			} else {
				
				return selectedNodes;
			}
		}
	}

	function concat(nodes) {
		var nodesElements = nodes.getElements();
		return KeyPathList(elements.concat(nodesElements), node_type);
	}

	function getElements() {
		return elements;
	}

	function getPropertyAtIndex(index) {
		return elements[index];
	}

	var methods = {
		getKeyPath: getKeyPath,
		concat: concat,
		getElements: getElements,
		getPropertyAtIndex: getPropertyAtIndex
	}

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});

	return methods;
}

module.exports = KeyPathList;
},{"../enums/layer_types":3,"../helpers/keyPathBuilder":5}],12:[function(require,module,exports){
var key_path_separator = require('../enums/key_path_separator');
var property_names = require('../enums/property_names');

function KeyPathNode(state) {

	function getPropertyByPath(selector, propertyPath) {
		var instanceProperties = state.properties || [];
		var i = 0, len = instanceProperties.length;
		while(i < len) {
			if(instanceProperties[i].name === selector) {
				return instanceProperties[i].value;
			}
			i += 1;
		}
		return null;

	}

	function hasProperty(selector) {
		return !!getPropertyByPath(selector);
	}

	function getProperty(selector) {
		return getPropertyByPath(selector);
	}

	function fromKeypathLayerPoint(point) {
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		return state.parent.toKeypathLayerPoint(point);
	}

	var methods = {
		hasProperty: hasProperty,
		getProperty: getProperty,
		fromKeypathLayerPoint: fromKeypathLayerPoint,
		toKeypathLayerPoint: toKeypathLayerPoint
	}
	return methods;
}

module.exports = KeyPathNode;
},{"../enums/key_path_separator":2,"../enums/property_names":4}],13:[function(require,module,exports){
var KeyPathNode = require('../key_path/KeyPathNode');
var Transform = require('./transform/Transform');
var Effects = require('./effects/Effects');
var Matrix = require('../helpers/transformationMatrix');

function LayerBase(state) {

	var transform = Transform(state.element.finalTransform.mProp, state);
	var effects = Effects(state.element.effectsManager.effectElements || [], state);

	function _buildPropertyMap() {
		state.properties.push({
			name: 'transform',
			value: transform
		},{
			name: 'Transform',
			value: transform
		},{
			name: 'Effects',
			value: effects
		},{
			name: 'effects',
			value: effects
		})
	}

    function getElementToPoint(point) {
    }

	function toKeypathLayerPoint(point) {
		var element = state.element;
    	if(state.parent.toKeypathLayerPoint) {
        	point = state.parent.toKeypathLayerPoint(point);
        }
    	var toWorldMat = Matrix();
        var transformMat = state.getProperty('Transform').getTargetTransform();
        transformMat.applyToMatrix(toWorldMat);
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
                element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
        }
        return toWorldMat.inversePoint(point);
	}

	function fromKeypathLayerPoint(point) {
		var element = state.element;
		var toWorldMat = Matrix();
        var transformMat = state.getProperty('Transform').getTargetTransform();
        transformMat.applyToMatrix(toWorldMat);
        if(element.hierarchy && element.hierarchy.length){
            var i, len = element.hierarchy.length;
            for(i=0;i<len;i+=1){
                element.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
            }
        }
        point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
        if(state.parent.fromKeypathLayerPoint) {
        	return state.parent.fromKeypathLayerPoint(point);
        } else {
        	return point;
        }
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer,
		toKeypathLayerPoint: toKeypathLayerPoint,
		fromKeypathLayerPoint: fromKeypathLayerPoint
	}

	_buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods);
}

module.exports = LayerBase;
},{"../helpers/transformationMatrix":8,"../key_path/KeyPathNode":12,"./effects/Effects":19,"./transform/Transform":39}],14:[function(require,module,exports){
var layer_types = require('../enums/layer_types');
var layer_api = require('../helpers/layerAPIBuilder');

function LayerList(elements) {

	function _getLength() {
		return elements.length;
	}

	function _filterLayerByType(elements, type) {
		return elements.filter(function(element) {
			return element.data.ty === layer_types[type];
		});
	}

	function _filterLayerByName(elements, name) {
		return elements.filter(function(element) {
			return element.data.nm === name;
		});
	}

	function getLayers() {
		 return LayerList(elements);
	}

	function getLayersByType(type) {
		var elementsList = _filterLayerByType(elements, type);
		return LayerList(elementsList);
	}

	function getLayersByName(type) {
		var elementsList = _filterLayerByName(elements, type);
		return LayerList(elementsList);
	}

	function layer(index) {
		if (index >= elements.length) {
			return [];
		}
		return layer_api(elements[parseInt(index)]);
	}

	function addIteratableMethods(iteratableMethods, list) {
		iteratableMethods.reduce(function(accumulator, value){
			var _value = value;
			accumulator[value] = function() {
				var _arguments = arguments;
				return elements.map(function(element){
					var layer = layer_api(element);
					if(layer[_value]) {
						return layer[_value].apply(null, _arguments);
					}
					return null;
				});
			}
			return accumulator;
		}, methods);
	}

	function getTargetElements() {
		return elements;
	}

	function concat(list) {
		return elements.concat(list.getTargetElements());
	}

	var methods = {
		getLayers: getLayers,
		getLayersByType: getLayersByType,
		getLayersByName: getLayersByName,
		layer: layer,
		concat: concat,
		getTargetElements: getTargetElements
	};

	addIteratableMethods(['setTranslate', 'getType', 'getDuration']);
	addIteratableMethods(['setText', 'getText', 'setDocumentData', 'canResizeFont', 'setMinimumFontSize']);

	Object.defineProperty(methods, 'length', {
		get: _getLength
	});
	return methods;
}

module.exports = LayerList;
},{"../enums/layer_types":3,"../helpers/layerAPIBuilder":6}],15:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Camera(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Point of Interest',
				value: Property(element.a, parent)
			},
			{
				name: 'Zoom',
				value: Property(element.pe, parent)
			},
			{
				name: 'Position',
				value: Property(element.p, parent)
			},
			{
				name: 'X Rotation',
				value: Property(element.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(element.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(element.rz, parent)
			},
			{
				name: 'Orientation',
				value: Property(element.or, parent)
			}
		]
	}

	function getTargetLayer() {
		return state.element;
	}

	var methods = {
		getTargetLayer: getTargetLayer
	}

	return Object.assign(instance, KeyPathNode(state), methods);
}

module.exports = Camera;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],16:[function(require,module,exports){
var KeyPathList = require('../../key_path/KeyPathList');
var LayerBase = require('../LayerBase');
var layer_api = require('../../helpers/layerAPIBuilder');
var Property = require('../../property/Property');
var TimeRemap = require('./TimeRemap');

function Composition(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function buildLayerApi(layer, index) {
		var _layerApi = null;
		var ob = {
			name: layer.nm
		}

		function getLayerApi() {
			if(!_layerApi) {
				_layerApi = layer_api(element.elements[index], state)
			}
			return _layerApi
		}

		Object.defineProperty(ob, 'value', {
			get : getLayerApi
		})
		return ob;
	}

	
	function _buildPropertyMap() {
		var compositionLayers = element.layers.map(buildLayerApi)
		return [
			{
				name: 'Time Remap',
				value: TimeRemap(element.tm)
			}
		].concat(compositionLayers)
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), KeyPathList(state.elements, 'layer'), methods);
}

module.exports = Composition;
},{"../../helpers/layerAPIBuilder":6,"../../key_path/KeyPathList":11,"../../property/Property":40,"../LayerBase":13,"./TimeRemap":17}],17:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var ValueProperty = require('../../property/ValueProperty');

function TimeRemap(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	var _isCallbackAdded = false;
	var currentSegmentInit = 0;
	var currentSegmentEnd = 0;
	var previousTime = 0, currentTime = 0;
	var initTime = 0;
	var _loop = true;
	var _loopCount = 0;
	var _speed = 1;
	var _paused = false;
	var _isDebugging = false;
	var queuedSegments = [];
	var _destroyFunction;
	var enterFrameCallback = null;
	var enterFrameEvent = {
		time: -1
	}

	function playSegment(init, end, clear) {
		_paused = false;
		if(clear) {
			clearQueue();
			currentTime = init;
		}
		if(_isDebugging) {
			console.log(init, end);
		}
		_loopCount = 0;
		previousTime = Date.now();
		currentSegmentInit = init;
		currentSegmentEnd = end;
		addCallback();
	}

	function playQueuedSegment() {
		var newSegment = queuedSegments.shift();
		playSegment(newSegment[0], newSegment[1]);
	}

	function queueSegment(init, end) {
		queuedSegments.push([init, end]);
	}

	function clearQueue() {
		queuedSegments.length = 0;
	}

	function _segmentPlayer(currentValue) {
		if(currentSegmentInit === currentSegmentEnd) {
			currentTime = currentSegmentInit;
		} else if(!_paused) {
			var nowTime = Date.now();
			var elapsedTime = _speed * (nowTime - previousTime) / 1000;
			previousTime = nowTime;
			if(currentSegmentInit < currentSegmentEnd) {
				currentTime += elapsedTime;
				if(currentTime > currentSegmentEnd) {
					_loopCount += 1;
					if(queuedSegments.length) {
						playQueuedSegment();
					} else if(!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						/*currentTime -= Math.floor(currentTime / (currentSegmentEnd - currentSegmentInit)) * (currentSegmentEnd - currentSegmentInit);
						currentTime = currentSegmentInit + currentTime;*/
						currentTime = currentTime % (currentSegmentEnd - currentSegmentInit);
						//currentTime = currentSegmentInit + (currentTime);
						//currentTime = currentSegmentInit + (currentTime - currentSegmentEnd);
						 //console.log('CT: ', currentTime) 
					}
				}
			} else {
				currentTime -= elapsedTime;
				if(currentTime < currentSegmentEnd) {
					_loopCount += 1;
					if(queuedSegments.length) {
						playQueuedSegment();
					} else if(!_loop) {
						currentTime = currentSegmentEnd;
					} else {
						currentTime = currentSegmentInit - (currentSegmentEnd - currentTime);
					}
				}
			}
			if(_isDebugging) {
				console.log(currentTime)
			}
		}
		if(instance.onEnterFrame && enterFrameEvent.time !== currentTime) {
			enterFrameEvent.time = currentTime;
			instance.onEnterFrame(enterFrameEvent);
		}
		return currentTime;
	}

	function addCallback() {
		if(!_isCallbackAdded) {
			_isCallbackAdded = true;
			_destroyFunction = instance.setValue(_segmentPlayer, _isDebugging)
		}
	}

	function playTo(end, clear) {
		_paused = false;
		if(clear) {
			clearQueue();
		}
		addCallback();
		currentSegmentEnd = end;
	}

	function getCurrentTime() {
		if(_isCallbackAdded) {
			return currentTime;
		} else {
			return property.v / property.mult;
		}
	}

	function setLoop(flag) {
		_loop = flag;
	}

	function setSpeed(value) {
		_speed = value;
	}

	function setDebugging(flag) {
		_isDebugging = flag;
	}

	function pause() {
		_paused = true;
	}

	function destroy() {
		if(_destroyFunction) {
			_destroyFunction();
			state.property = null;
			state.parent = null;
		}
	}

	var methods = {
		playSegment: playSegment,
		playTo: playTo,
		queueSegment: queueSegment,
		clearQueue: clearQueue,
		setLoop: setLoop,
		setSpeed: setSpeed,
		pause: pause,
		setDebugging: setDebugging,
		getCurrentTime: getCurrentTime,
		onEnterFrame: null,
		destroy: destroy
	}

	var instance = {}

	return Object.assign(instance, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = TimeRemap;
},{"../../key_path/KeyPathNode":12,"../../property/ValueProperty":41}],18:[function(require,module,exports){
var Property = require('../../property/Property');

function EffectElement(effect, parent) {

	return Property(effect.p, parent);
}

module.exports = EffectElement;
},{"../../property/Property":40}],19:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var EffectElement = require('./EffectElement');

function Effects(effects, parent) {

	var state = {
		parent: parent,
		properties: buildProperties()
	}

	function getValue(effectData, index) {
		var nm = effectData.data ? effectData.data.nm : index.toString();
		var effectElement = effectData.data ? Effects(effectData.effectElements, parent) : Property(effectData.p, parent);
		return {
			name: nm,
			value: effectElement
		}
	}

	function buildProperties() {
		var i, len = effects.length;
		var arr = [];
		for (i = 0; i < len; i += 1) {
			arr.push(getValue(effects[i], i));
		}
		return arr;
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Effects;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./EffectElement":18}],20:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Image(element) {

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}
	
	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Image;
},{"../LayerBase":13}],21:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function NullElement(element, parent) {

	var instance = {};

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}

	var methods = {
	}

	return Object.assign(instance, LayerBase(state), methods);
}

module.exports = NullElement;
},{"../LayerBase":13}],22:[function(require,module,exports){
var LayerBase = require('../LayerBase');
var ShapeContents = require('./ShapeContents');

function Shape(element, parent) {

	var state = {
		properties: [],
		parent: parent,
		element: element
	}
	var shapeContents = ShapeContents(element.data.shapes, element.itemsData, state);

	

	function _buildPropertyMap() {
		state.properties.push(
			{
				name: 'Contents',
				value: shapeContents
			}
		)
	}

	var methods = {
	}

	_buildPropertyMap();

	return Object.assign(state, LayerBase(state), methods);
}

module.exports = Shape;
},{"../LayerBase":13,"./ShapeContents":23}],23:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var ShapeRectangle = require('./ShapeRectangle');
var ShapeFill = require('./ShapeFill');
var ShapeStroke = require('./ShapeStroke');
var ShapeEllipse = require('./ShapeEllipse');
var ShapeGradientFill = require('./ShapeGradientFill');
var ShapeGradientStroke = require('./ShapeGradientStroke');
var ShapeTrimPaths = require('./ShapeTrimPaths');
var ShapeRepeater = require('./ShapeRepeater');
var ShapePolystar = require('./ShapePolystar');
var ShapeRoundCorners = require('./ShapeRoundCorners');
var ShapePath = require('./ShapePath');
var Transform = require('../transform/Transform');
var Matrix = require('../../helpers/transformationMatrix');

function ShapeContents(shapesData, shapes, parent) {
	var state = {
		properties: _buildPropertyMap(),
		parent: parent
	}

	var cachedShapeProperties = [];

	function buildShapeObject(shape, index) {
		var ob = {
			name: shape.nm
		}
		Object.defineProperty(ob, 'value', {
		   get() {
		   	if(cachedShapeProperties[index]) {
		   		return cachedShapeProperties[index];
		   	} else {
		   		var property;
		   	}
	   		if(shape.ty === 'gr') {
	   			property = ShapeContents(shapesData[index].it, shapes[index].it, state);
	   		} else if(shape.ty === 'rc') {
	   			property = ShapeRectangle(shapes[index], state);
	   		} else if(shape.ty === 'el') {
	   			property = ShapeEllipse(shapes[index], state);
	   		} else if(shape.ty === 'fl') {
	   			property = ShapeFill(shapes[index], state);
	   		} else if(shape.ty === 'st') {
	   			property = ShapeStroke(shapes[index], state);
	   		} else if(shape.ty === 'gf') {
	   			property = ShapeGradientFill(shapes[index], state);
	   		} else if(shape.ty === 'gs') {
	   			property = ShapeGradientStroke(shapes[index], state);
	   		} else if(shape.ty === 'tm') {
	   			property = ShapeTrimPaths(shapes[index], state);
	   		} else if(shape.ty === 'rp') {
	   			property = ShapeRepeater(shapes[index], state);
	   		} else if(shape.ty === 'sr') {
	   			property = ShapePolystar(shapes[index], state);
	   		} else if(shape.ty === 'rd') {
	   			property = ShapeRoundCorners(shapes[index], state);
	   		} else if(shape.ty === 'sh') {
	   			property = ShapePath(shapes[index], state);
	   		} else if(shape.ty === 'tr') {
	   			property = Transform(shapes[index].transform.mProps, state);
	   		} else {
	   			console.log(shape.ty);
	   		}
	   		cachedShapeProperties[index] = property;
	   		return property;
		   }
		});
		return ob
	}

	function _buildPropertyMap() {
		return shapesData.map(function(shape, index) {
			return buildShapeObject(shape, index)
		});
	}

	function fromKeypathLayerPoint(point) {
		if(state.hasProperty('Transform')) {
    		var toWorldMat = Matrix();
        	var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
        	point = toWorldMat.applyToPointArray(point[0],point[1],point[2]||0);
		}
		return state.parent.fromKeypathLayerPoint(point);
	}

	function toKeypathLayerPoint(point) {
		point = state.parent.toKeypathLayerPoint(point);
		if(state.hasProperty('Transform')) {
    		var toWorldMat = Matrix();
        	var transformMat = state.getProperty('Transform').getTargetTransform();
			transformMat.applyToMatrix(toWorldMat);
        	point = toWorldMat.inversePoint(point);
		}
		return point;
	}

	var methods = {
		fromKeypathLayerPoint: fromKeypathLayerPoint,
		toKeypathLayerPoint: toKeypathLayerPoint
	}

	//state.properties = _buildPropertyMap();

	return Object.assign(state, KeyPathNode(state), methods)
}

module.exports = ShapeContents;
},{"../../helpers/transformationMatrix":8,"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39,"./ShapeEllipse":24,"./ShapeFill":25,"./ShapeGradientFill":26,"./ShapeGradientStroke":27,"./ShapePath":28,"./ShapePolystar":29,"./ShapeRectangle":30,"./ShapeRepeater":31,"./ShapeRoundCorners":32,"./ShapeStroke":33,"./ShapeTrimPaths":34}],24:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeEllipse(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: Property(element.sh.s, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeEllipse;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],25:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Color',
				value: Property(element.c, parent)
			},
			{
				name: 'Opacity',
				value: {
					setValue: Property(element.o, parent)
				}
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],26:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientFill(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: Property(element.s, parent)
			},
			{
				name: 'End Point',
				value: Property(element.s, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			},
			{
				name: 'Highlight Length',
				value: Property(element.h, parent)
			},
			{
				name: 'Highlight Angle',
				value: Property(element.a, parent)
			},
			{
				name: 'Colors',
				value: Property(element.g.prop, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientFill;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],27:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeGradientStroke(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start Point',
				value: Property(element.s, parent)
			},
			{
				name: 'End Point',
				value: Property(element.e, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			},
			{
				name: 'Highlight Length',
				value: Property(element.h, parent)
			},
			{
				name: 'Highlight Angle',
				value: Property(element.a, parent)
			},
			{
				name: 'Colors',
				value: Property(element.g.prop, parent)
			},
			{
				name: 'Stroke Width',
				value: Property(element.w, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeGradientStroke;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],28:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePath(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function setPath(value) {
		Property(element.sh).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'path',
				value:Property(element.sh, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePath;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],29:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapePolystar(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Points',
				value: Property(element.sh.pt, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			},
			{
				name: 'Rotation',
				value: Property(element.sh.r, parent)
			},
			{
				name: 'Inner Radius',
				value: Property(element.sh.ir, parent)
			},
			{
				name: 'Outer Radius',
				value: Property(element.sh.or, parent)
			},
			{
				name: 'Inner Roundness',
				value: Property(element.sh.is, parent)
			},
			{
				name: 'Outer Roundness',
				value: Property(element.sh.os, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapePolystar;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],30:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRectangle(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Size',
				value: Property(element.sh.s, parent)
			},
			{
				name: 'Position',
				value: Property(element.sh.p, parent)
			},
			{
				name: 'Roundness',
				value: Property(element.sh.r, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRectangle;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],31:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var Transform = require('../transform/Transform');

function ShapeRepeater(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Copies',
				value: Property(element.c, parent)
			},
			{
				name: 'Offset',
				value: Property(element.o, parent)
			},
			{
				name: 'Transform',
				value: Transform(element.tr, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRepeater;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"../transform/Transform":39}],32:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeRoundCorners(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Radius',
				value: Property(element.rd, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeRoundCorners;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],33:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeStroke(element, parent) {
	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Color',
				value: Property(element.c, parent)
			},
			{
				name: 'Stroke Width',
				value: Property(element.w, parent)
			},
			{
				name: 'Opacity',
				value: Property(element.o, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeStroke
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],34:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function ShapeTrimPaths(element, parent) {

	var state = {
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Start',
				value: Property(element.s, parent)
			},
			{
				name: 'End',
				value: Property(element.e, parent)
			},
			{
				name: 'Offset',
				value: Property(element.o, parent)
			}
		]
	}

	var methods = {
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = ShapeTrimPaths;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],35:[function(require,module,exports){
var LayerBase = require('../LayerBase');

function Solid(element, parent) {

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
		]
	}

	var methods = {
	}

	return Object.assign({}, LayerBase(state), methods);
}

module.exports = Solid;
},{"../LayerBase":13}],36:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');
var TextAnimator = require('./TextAnimator');

function Text(element, parent) {

	var instance = {}

	var state = {
		element: element,
		parent: parent,
		properties: _buildPropertyMap()
	}

	function setDocumentData(_function) {
		var previousValue;
		var textDocumentUpdater = function(data) {
			var newValue = _function(element.textProperty.currentData);
			if (previousValue !== newValue) {
				previousValue = newValue;
				return Object.assign({}, data, newValue, {__complete: false});
			}
			return data
		}
		element.textProperty.addEffect(textDocumentUpdater);
	}

	function addAnimators() {
		var animatorProperties = [];
		var animators = element.textAnimator._animatorsData;
		var i, len = animators.length;
		var textAnimator;
		for (i = 0; i < len; i += 1) {
			textAnimator = TextAnimator(animators[i])
			animatorProperties.push({
				name: element.textAnimator._textData.a[i].nm || 'Animator ' + (i+1), //Fallback for old animations
				value: textAnimator
			})
		}
		return animatorProperties;
	}

	function _buildPropertyMap() {
		return [
			{
				name:'Source',
				value: {
					setValue: setDocumentData
				}
			}
		].concat(addAnimators())
	}

	var methods = {
	}

	return Object.assign(instance, methods, KeyPathNode(state));

}

module.exports = Text;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40,"./TextAnimator":37}],37:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function TextAnimator(animator) {

	var instance = {}

	var state = {
		properties: _buildPropertyMap()
	}

	function setAnchorPoint(value) {
		Property(animator.a.a).setValue(value);
	}

	function setFillBrightness(value) {
		Property(animator.a.fb).setValue(value);
	}

	function setFillColor(value) {
		Property(animator.a.fc).setValue(value);
	}

	function setFillHue(value) {
		Property(animator.a.fh).setValue(value);
	}

	function setFillSaturation(value) {
		Property(animator.a.fs).setValue(value);
	}

	function setFillOpacity(value) {
		Property(animator.a.fo).setValue(value);
	}

	function setOpacity(value) {
		Property(animator.a.o).setValue(value);
	}

	function setPosition(value) {
		Property(animator.a.p).setValue(value);
	}

	function setRotation(value) {
		Property(animator.a.r).setValue(value);
	}

	function setRotationX(value) {
		Property(animator.a.rx).setValue(value);
	}

	function setRotationY(value) {
		Property(animator.a.ry).setValue(value);
	}

	function setScale(value) {
		Property(animator.a.s).setValue(value);
	}

	function setSkewAxis(value) {
		Property(animator.a.sa).setValue(value);
	}

	function setStrokeColor(value) {
		Property(animator.a.sc).setValue(value);
	}

	function setSkew(value) {
		Property(animator.a.sk).setValue(value);
	}

	function setStrokeOpacity(value) {
		Property(animator.a.so).setValue(value);
	}

	function setStrokeWidth(value) {
		Property(animator.a.sw).setValue(value);
	}

	function setStrokeBrightness(value) {
		Property(animator.a.sb).setValue(value);
	}

	function setStrokeHue(value) {
		Property(animator.a.sh).setValue(value);
	}

	function setStrokeSaturation(value) {
		Property(animator.a.ss).setValue(value);
	}

	function setTrackingAmount(value) {
		Property(animator.a.t).setValue(value);
	}

	function _buildPropertyMap() {
		return [
			{
				name:'Anchor Point',
				value: {
					setValue: setAnchorPoint
				}
			},
			{
				name:'Fill Brightness',
				value: {
					setValue: setFillBrightness
				}
			},
			{
				name:'Fill Color',
				value: {
					setValue: setFillColor
				}
			},
			{
				name:'Fill Hue',
				value: {
					setValue: setFillHue
				}
			},
			{
				name:'Fill Saturation',
				value: {
					setValue: setFillSaturation
				}
			},
			{
				name:'Fill Opacity',
				value: {
					setValue: setFillOpacity
				}
			},
			{
				name:'Opacity',
				value: {
					setValue: setOpacity
				}
			},
			{
				name:'Position',
				value: {
					setValue: setPosition
				}
			},
			{
				name:'Rotation X',
				value: {
					setValue: setRotationX
				}
			},
			{
				name:'Rotation Y',
				value: {
					setValue: setRotationY
				}
			},
			{
				name:'Scale',
				value: {
					setValue: setScale
				}
			},
			{
				name:'Skew Axis',
				value: {
					setValue: setSkewAxis
				}
			},
			{
				name:'Stroke Color',
				value: {
					setValue: setStrokeColor
				}
			},
			{
				name:'Skew',
				value: {
					setValue: setSkew
				}
			},
			{
				name:'Stroke Width',
				value: {
					setValue: setStrokeWidth
				}
			},
			{
				name:'Tracking Amount',
				value: {
					setValue: setTrackingAmount
				}
			},
			{
				name:'Stroke Opacity',
				value: {
					setValue: setStrokeOpacity
				}
			},
			{
				name:'Stroke Brightness',
				value: {
					setValue: setStrokeBrightness
				}
			},
			{
				name:'Stroke Saturation',
				value: {
					setValue: setStrokeSaturation
				}
			},
			{
				name:'Stroke Hue',
				value: {
					setValue: setStrokeHue
				}
			},
			
		]
	}

	var methods = {
	}

	return Object.assign(instance, methods, KeyPathNode(state));

}

module.exports = TextAnimator;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],38:[function(require,module,exports){
var LayerBase = require('../LayerBase');
var Text = require('./Text');

function TextElement(element) {

	var instance = {};

	var TextProperty = Text(element);
	var state = {
		element: element,
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'text',
				value: TextProperty
			},
			{
				name: 'Text',
				value: TextProperty
			}
		]
	}

	function getText() {
		return element.textProperty.currentData.t;
	}

	function setText(value, index) {
		setDocumentData({t: value}, index);
	}

	function setDocumentData(data, index) {
		return element.updateDocumentData(data, index);
	}
	
	function canResizeFont(_canResize) {
		return element.canResizeFont(_canResize);
	}

	function setMinimumFontSize(_fontSize) {
		return element.setMinimumFontSize(_fontSize);
	}

	var methods = {
		getText: getText,
		setText: setText,
		canResizeFont: canResizeFont,
		setDocumentData: setDocumentData,
		setMinimumFontSize: setMinimumFontSize
	}

	return Object.assign(instance, LayerBase(state), methods);

}

module.exports = TextElement;
},{"../LayerBase":13,"./Text":36}],39:[function(require,module,exports){
var KeyPathNode = require('../../key_path/KeyPathNode');
var Property = require('../../property/Property');

function Transform(props, parent) {
	var state = {
		properties: _buildPropertyMap()
	}

	function _buildPropertyMap() {
		return [
			{
				name: 'Anchor Point',
				value: Property(props.a, parent)
			},
			{
				name: 'Point of Interest',
				value: Property(props.a, parent)
			},
			{
				name: 'Position',
				value: Property(props.p, parent)
			},
			{
				name: 'Scale',
				value: Property(props.s, parent)
			},
			{
				name: 'Rotation',
				value: Property(props.r, parent)
			},
			{
				name: 'X Position',
				value: Property(props.px, parent)
			},
			{
				name: 'Y Position',
				value: Property(props.py, parent)
			},
			{
				name: 'Z Position',
				value: Property(props.pz, parent)
			},
			{
				name: 'X Rotation',
				value: Property(props.rx, parent)
			},
			{
				name: 'Y Rotation',
				value: Property(props.ry, parent)
			},
			{
				name: 'Z Rotation',
				value: Property(props.rz, parent)
			},
			{
				name: 'Opacity',
				value: Property(props.o, parent)
			}
		]
	}

	function getTargetTransform() {
		return props;
	}

	var methods = {
		getTargetTransform: getTargetTransform
	}

	return Object.assign(methods, KeyPathNode(state));
}

module.exports = Transform;
},{"../../key_path/KeyPathNode":12,"../../property/Property":40}],40:[function(require,module,exports){
var KeyPathNode = require('../key_path/KeyPathNode');
var ValueProperty = require('./ValueProperty');

function Property(property, parent) {
	var state = {
		property: property,
		parent: parent
	}

	function destroy() {
		state.property = null;
		state.parent = null;
	}

	var methods = {
		destroy: destroy
	}

	return Object.assign({}, methods, ValueProperty(state), KeyPathNode(state));
}

module.exports = Property;
},{"../key_path/KeyPathNode":12,"./ValueProperty":41}],41:[function(require,module,exports){
function ValueProperty(state) {
	
	function setValue(value) {
		var property = state.property;
		if(!property || !property.addEffect) {
			return;
		}
		if (typeof value === 'function') {
			return property.addEffect(value);
		} else if (property.propType === 'multidimensional' && typeof value === 'object' && value.length === 2) {
			return property.addEffect(function(){return value});
		} else if (property.propType === 'unidimensional' && typeof value === 'number') {
			return property.addEffect(function(){return value});
		}
	}

	function getValue() {
		return state.property.v;
	}

	var methods = {
		setValue: setValue,
		getValue: getValue
	}

	return methods;
}

module.exports = ValueProperty;
},{}],42:[function(require,module,exports){
var LayerList = require('../layer/LayerList');
var KeyPathList = require('../key_path/KeyPathList');

function Renderer(state) {

	state._type = 'renderer';

	function getRendererType() {
		return state.animation.animType;
	}

	return Object.assign({
		getRendererType: getRendererType
	}, LayerList(state.elements), KeyPathList(state.elements, 'renderer'));
}

module.exports = Renderer;
},{"../key_path/KeyPathList":11,"../layer/LayerList":14}]},{},[10])(10)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0uanMiLCJzcmMvZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yLmpzIiwic3JjL2VudW1zL2xheWVyX3R5cGVzLmpzIiwic3JjL2VudW1zL3Byb3BlcnR5X25hbWVzLmpzIiwic3JjL2hlbHBlcnMva2V5UGF0aEJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9sYXllckFQSUJ1aWxkZXIuanMiLCJzcmMvaGVscGVycy9zdHJpbmdTYW5pdGl6ZXIuanMiLCJzcmMvaGVscGVycy90cmFuc2Zvcm1hdGlvbk1hdHJpeC5qcyIsInNyYy9oZWxwZXJzL3R5cGVkQXJyYXlzLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhMaXN0LmpzIiwic3JjL2tleV9wYXRoL0tleVBhdGhOb2RlLmpzIiwic3JjL2xheWVyL0xheWVyQmFzZS5qcyIsInNyYy9sYXllci9MYXllckxpc3QuanMiLCJzcmMvbGF5ZXIvY2FtZXJhL0NhbWVyYS5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9Db21wb3NpdGlvbi5qcyIsInNyYy9sYXllci9jb21wb3NpdGlvbi9UaW1lUmVtYXAuanMiLCJzcmMvbGF5ZXIvZWZmZWN0cy9FZmZlY3RFbGVtZW50LmpzIiwic3JjL2xheWVyL2VmZmVjdHMvRWZmZWN0cy5qcyIsInNyYy9sYXllci9pbWFnZS9JbWFnZUVsZW1lbnQuanMiLCJzcmMvbGF5ZXIvbnVsbF9lbGVtZW50L051bGxFbGVtZW50LmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlQ29udGVudHMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVFbGxpcHNlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlRmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50RmlsbC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZUdyYWRpZW50U3Ryb2tlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUGF0aC5qcyIsInNyYy9sYXllci9zaGFwZS9TaGFwZVBvbHlzdGFyLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVjdGFuZ2xlLmpzIiwic3JjL2xheWVyL3NoYXBlL1NoYXBlUmVwZWF0ZXIuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVSb3VuZENvcm5lcnMuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVTdHJva2UuanMiLCJzcmMvbGF5ZXIvc2hhcGUvU2hhcGVUcmltUGF0aHMuanMiLCJzcmMvbGF5ZXIvc29saWQvU29saWRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RleHQvVGV4dC5qcyIsInNyYy9sYXllci90ZXh0L1RleHRBbmltYXRvci5qcyIsInNyYy9sYXllci90ZXh0L1RleHRFbGVtZW50LmpzIiwic3JjL2xheWVyL3RyYW5zZm9ybS9UcmFuc2Zvcm0uanMiLCJzcmMvcHJvcGVydHkvUHJvcGVydHkuanMiLCJzcmMvcHJvcGVydHkvVmFsdWVQcm9wZXJ0eS5qcyIsInNyYy9yZW5kZXJlci9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgUmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9SZW5kZXJlcicpO1xudmFyIGxheWVyX2FwaSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvbGF5ZXJBUElCdWlsZGVyJyk7XG5cbmZ1bmN0aW9uIEFuaW1hdGlvbkl0ZW1GYWN0b3J5KGFuaW1hdGlvbikge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRhbmltYXRpb246IGFuaW1hdGlvbixcblx0XHRlbGVtZW50czogYW5pbWF0aW9uLnJlbmRlcmVyLmVsZW1lbnRzLm1hcCgoaXRlbSkgPT4gbGF5ZXJfYXBpKGl0ZW0sIGFuaW1hdGlvbikpLFxuXHRcdGJvdW5kaW5nUmVjdDogbnVsbCxcblx0XHRzY2FsZURhdGE6IG51bGxcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRGcmFtZSgpIHtcblx0XHRyZXR1cm4gYW5pbWF0aW9uLmN1cnJlbnRGcmFtZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEN1cnJlbnRUaW1lKCkge1xuXHRcdHJldHVybiBhbmltYXRpb24uY3VycmVudEZyYW1lIC8gYW5pbWF0aW9uLmZyYW1lUmF0ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFZhbHVlQ2FsbGJhY2socHJvcGVydGllcywgdmFsdWUpIHtcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG5cdFx0XHRwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwcm9wZXJ0aWVzLCBwb2ludCkge1xuXHRcdHZhciBpLCBsZW4gPSBwcm9wZXJ0aWVzLmxlbmd0aDtcblx0XHR2YXIgcG9pbnRzID0gW107XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG5cdFx0XHRwb2ludHMucHVzaChwcm9wZXJ0aWVzLmdldFByb3BlcnR5QXRJbmRleChpKS50b0tleXBhdGhMYXllclBvaW50KHBvaW50KSk7XG5cdFx0fVxuXHRcdGlmKHBvaW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHJldHVybiBwb2ludHNbMF07XG5cdFx0fVxuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiBmcm9tS2V5cGF0aExheWVyUG9pbnQocHJvcGVydGllcywgcG9pbnQpIHtcblx0XHR2YXIgaSwgbGVuID0gcHJvcGVydGllcy5sZW5ndGg7XG5cdFx0dmFyIHBvaW50cyA9IFtdO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuXHRcdFx0cG9pbnRzLnB1c2gocHJvcGVydGllcy5nZXRQcm9wZXJ0eUF0SW5kZXgoaSkuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KSk7XG5cdFx0fVxuXHRcdGlmKHBvaW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdHJldHVybiBwb2ludHNbMF07XG5cdFx0fVxuXHRcdHJldHVybiBwb2ludHM7XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjdWxhdGVTY2FsZURhdGEoYm91bmRpbmdSZWN0KSB7XG5cdFx0dmFyIGNvbXBXaWR0aCA9IGFuaW1hdGlvbi5hbmltYXRpb25EYXRhLnc7XG4gICAgICAgIHZhciBjb21wSGVpZ2h0ID0gYW5pbWF0aW9uLmFuaW1hdGlvbkRhdGEuaDtcblx0XHR2YXIgY29tcFJlbCA9IGNvbXBXaWR0aCAvIGNvbXBIZWlnaHQ7XG4gICAgICAgIHZhciBlbGVtZW50V2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgICAgIHZhciBlbGVtZW50SGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcbiAgICAgICAgdmFyIGVsZW1lbnRSZWwgPSBlbGVtZW50V2lkdGggLyBlbGVtZW50SGVpZ2h0O1xuICAgICAgICB2YXIgc2NhbGUsc2NhbGVYT2Zmc2V0LHNjYWxlWU9mZnNldDtcbiAgICAgICAgdmFyIHhBbGlnbm1lbnQsIHlBbGlnbm1lbnQsIHNjYWxlTW9kZTtcbiAgICAgICAgdmFyIGFzcGVjdFJhdGlvID0gYW5pbWF0aW9uLnJlbmRlcmVyLnJlbmRlckNvbmZpZy5wcmVzZXJ2ZUFzcGVjdFJhdGlvLnNwbGl0KCcgJyk7XG4gICAgICAgIGlmKGFzcGVjdFJhdGlvWzFdID09PSAnbWVldCcpIHtcbiAgICAgICAgXHRzY2FsZSA9IGVsZW1lbnRSZWwgPiBjb21wUmVsID8gZWxlbWVudEhlaWdodCAvIGNvbXBIZWlnaHQgOiBlbGVtZW50V2lkdGggLyBjb21wV2lkdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIFx0c2NhbGUgPSBlbGVtZW50UmVsID4gY29tcFJlbCA/IGVsZW1lbnRXaWR0aCAvIGNvbXBXaWR0aCA6IGVsZW1lbnRIZWlnaHQgLyBjb21wSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHhBbGlnbm1lbnQgPSBhc3BlY3RSYXRpb1swXS5zdWJzdHIoMCw0KTtcbiAgICAgICAgeUFsaWdubWVudCA9IGFzcGVjdFJhdGlvWzBdLnN1YnN0cig0KTtcbiAgICAgICAgaWYoeEFsaWdubWVudCA9PT0gJ3hNaW4nKSB7XG4gICAgICAgIFx0c2NhbGVYT2Zmc2V0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmKHhBbGlnbm1lbnQgPT09ICd4TWlkJykge1xuICAgICAgICBcdHNjYWxlWE9mZnNldCA9IChlbGVtZW50V2lkdGggLSBjb21wV2lkdGggKiBzY2FsZSkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBcdHNjYWxlWE9mZnNldCA9IChlbGVtZW50V2lkdGggLSBjb21wV2lkdGggKiBzY2FsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih5QWxpZ25tZW50ID09PSAnWU1pbicpIHtcblx0ICAgICAgICBzY2FsZVlPZmZzZXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYoeUFsaWdubWVudCA9PT0gJ1lNaWQnKSB7XG5cdCAgICAgICAgc2NhbGVZT2Zmc2V0ID0gKGVsZW1lbnRIZWlnaHQgLSBjb21wSGVpZ2h0ICogc2NhbGUpIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBzY2FsZVlPZmZzZXQgPSAoZWxlbWVudEhlaWdodCAtIGNvbXBIZWlnaHQgKiBzY2FsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgXHRzY2FsZVlPZmZzZXQ6IHNjYWxlWU9mZnNldCxcbiAgICAgICAgXHRzY2FsZVhPZmZzZXQ6IHNjYWxlWE9mZnNldCxcbiAgICAgICAgXHRzY2FsZTogc2NhbGVcbiAgICAgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVjYWxjdWxhdGVTaXplKGNvbnRhaW5lcikge1xuXHRcdHZhciBjb250YWluZXIgPSBhbmltYXRpb24ud3JhcHBlcjtcblx0XHRzdGF0ZS5ib3VuZGluZ1JlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0c3RhdGUuc2NhbGVEYXRhID0gY2FsY3VsYXRlU2NhbGVEYXRhKHN0YXRlLmJvdW5kaW5nUmVjdCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b0NvbnRhaW5lclBvaW50KHBvaW50KSB7XG5cdFx0aWYoIWFuaW1hdGlvbi53cmFwcGVyIHx8ICFhbmltYXRpb24ud3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcblx0XHRcdHJldHVybiBwb2ludDtcblx0XHR9XG5cdFx0aWYoIXN0YXRlLmJvdW5kaW5nUmVjdCkge1xuXHRcdFx0cmVjYWxjdWxhdGVTaXplKCk7XG5cdFx0fVxuXG5cdFx0dmFyIGJvdW5kaW5nUmVjdCA9IHN0YXRlLmJvdW5kaW5nUmVjdDtcblx0XHR2YXIgbmV3UG9pbnQgPSBbcG9pbnRbMF0gLSBib3VuZGluZ1JlY3QubGVmdCwgcG9pbnRbMV0gLSBib3VuZGluZ1JlY3QudG9wXTtcblx0XHR2YXIgc2NhbGVEYXRhID0gc3RhdGUuc2NhbGVEYXRhO1xuXG4gICAgICAgIG5ld1BvaW50WzBdID0gKG5ld1BvaW50WzBdIC0gc2NhbGVEYXRhLnNjYWxlWE9mZnNldCkgLyBzY2FsZURhdGEuc2NhbGU7XG4gICAgICAgIG5ld1BvaW50WzFdID0gKG5ld1BvaW50WzFdIC0gc2NhbGVEYXRhLnNjYWxlWU9mZnNldCkgLyBzY2FsZURhdGEuc2NhbGU7XG5cblx0XHRyZXR1cm4gbmV3UG9pbnQ7XG5cdH1cblxuXHRmdW5jdGlvbiBmcm9tQ29udGFpbmVyUG9pbnQocG9pbnQpIHtcblx0XHRpZighYW5pbWF0aW9uLndyYXBwZXIgfHwgIWFuaW1hdGlvbi53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xuXHRcdFx0cmV0dXJuIHBvaW50O1xuXHRcdH1cblx0XHRpZighc3RhdGUuYm91bmRpbmdSZWN0KSB7XG5cdFx0XHRyZWNhbGN1bGF0ZVNpemUoKTtcblx0XHR9XG5cdFx0dmFyIGJvdW5kaW5nUmVjdCA9IHN0YXRlLmJvdW5kaW5nUmVjdDtcblx0XHR2YXIgc2NhbGVEYXRhID0gc3RhdGUuc2NhbGVEYXRhO1xuXG5cdFx0dmFyIG5ld1BvaW50ID0gW3BvaW50WzBdICogc2NhbGVEYXRhLnNjYWxlICsgc2NhbGVEYXRhLnNjYWxlWE9mZnNldCwgcG9pbnRbMV0gKiBzY2FsZURhdGEuc2NhbGUgKyBzY2FsZURhdGEuc2NhbGVZT2Zmc2V0XTtcblxuXHRcdHZhciBuZXdQb2ludCA9IFtuZXdQb2ludFswXSArIGJvdW5kaW5nUmVjdC5sZWZ0LCBuZXdQb2ludFsxXSArIGJvdW5kaW5nUmVjdC50b3BdO1xuXHRcdHJldHVybiBuZXdQb2ludDtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFNjYWxlRGF0YSgpIHtcblx0XHRyZXR1cm4gc3RhdGUuc2NhbGVEYXRhO1xuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdFx0cmVjYWxjdWxhdGVTaXplOiByZWNhbGN1bGF0ZVNpemUsXG5cdFx0Z2V0U2NhbGVEYXRhOiBnZXRTY2FsZURhdGEsXG5cdFx0dG9Db250YWluZXJQb2ludDogdG9Db250YWluZXJQb2ludCxcblx0XHRmcm9tQ29udGFpbmVyUG9pbnQ6IGZyb21Db250YWluZXJQb2ludCxcblx0XHRnZXRDdXJyZW50RnJhbWU6IGdldEN1cnJlbnRGcmFtZSxcblx0XHRnZXRDdXJyZW50VGltZTogZ2V0Q3VycmVudFRpbWUsXG5cdFx0YWRkVmFsdWVDYWxsYmFjazogYWRkVmFsdWVDYWxsYmFjayxcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50LFxuXHRcdGZyb21LZXlwYXRoTGF5ZXJQb2ludDogZnJvbUtleXBhdGhMYXllclBvaW50XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgUmVuZGVyZXIoc3RhdGUpLCBtZXRob2RzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb25JdGVtRmFjdG9yeTsiLCJtb2R1bGUuZXhwb3J0cyA9ICcsJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0IDA6IDAsXG5cdCAxOiAxLFxuXHQgMjogMixcblx0IDM6IDMsXG5cdCA0OiA0LFxuXHQgNTogNSxcblx0IDEzOiAxMyxcblx0J2NvbXAnOiAwLFxuXHQnY29tcG9zaXRpb24nOiAwLFxuXHQnc29saWQnOiAxLFxuXHQnaW1hZ2UnOiAyLFxuXHQnbnVsbCc6IDMsXG5cdCdzaGFwZSc6IDQsXG5cdCd0ZXh0JzogNSxcblx0J2NhbWVyYSc6IDEzXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdExBWUVSX1RSQU5TRk9STTogJ3RyYW5zZm9ybSdcbn0iLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJyk7XG52YXIgc2FuaXRpemVTdHJpbmcgPSByZXF1aXJlKCcuL3N0cmluZ1Nhbml0aXplcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHByb3BlcnR5UGF0aCkge1xuXHR2YXIga2V5UGF0aFNwbGl0ID0gcHJvcGVydHlQYXRoLnNwbGl0KGtleV9wYXRoX3NlcGFyYXRvcik7XG5cdHZhciBzZWxlY3RvciA9IGtleVBhdGhTcGxpdC5zaGlmdCgpO1xuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdG9yOiBzYW5pdGl6ZVN0cmluZyhzZWxlY3RvciksXG5cdFx0cHJvcGVydHlQYXRoOiBrZXlQYXRoU3BsaXQuam9pbihrZXlfcGF0aF9zZXBhcmF0b3IpXG5cdH1cbn0iLCJ2YXIgVGV4dEVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci90ZXh0L1RleHRFbGVtZW50Jyk7XG52YXIgU2hhcGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vbGF5ZXIvc2hhcGUvU2hhcGUnKTtcbnZhciBOdWxsRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL251bGxfZWxlbWVudC9OdWxsRWxlbWVudCcpO1xudmFyIFNvbGlkRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL3NvbGlkL1NvbGlkRWxlbWVudCcpO1xudmFyIEltYWdlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2xheWVyL2ltYWdlL0ltYWdlRWxlbWVudCcpO1xudmFyIENhbWVyYUVsZW1lbnQgPSByZXF1aXJlKCcuLi9sYXllci9jYW1lcmEvQ2FtZXJhJyk7XG52YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vbGF5ZXIvTGF5ZXJCYXNlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRMYXllckFwaShlbGVtZW50LCBwYXJlbnQpIHtcblx0dmFyIGxheWVyVHlwZSA9IGVsZW1lbnQuZGF0YS50eTtcblx0dmFyIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi4vbGF5ZXIvY29tcG9zaXRpb24vQ29tcG9zaXRpb24nKTtcblx0c3dpdGNoKGxheWVyVHlwZSkge1xuXHRcdGNhc2UgMDpcblx0XHRyZXR1cm4gQ29tcG9zaXRpb24oZWxlbWVudCwgcGFyZW50KTtcblx0XHRjYXNlIDE6XG5cdFx0cmV0dXJuIFNvbGlkRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xuXHRcdGNhc2UgMjpcblx0XHRyZXR1cm4gSW1hZ2VFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XG5cdFx0Y2FzZSAzOlxuXHRcdHJldHVybiBOdWxsRWxlbWVudChlbGVtZW50LCBwYXJlbnQpO1xuXHRcdGNhc2UgNDpcblx0XHRyZXR1cm4gU2hhcGVFbGVtZW50KGVsZW1lbnQsIHBhcmVudCwgZWxlbWVudC5kYXRhLnNoYXBlcywgZWxlbWVudC5pdGVtc0RhdGEpO1xuXHRcdGNhc2UgNTpcblx0XHRyZXR1cm4gVGV4dEVsZW1lbnQoZWxlbWVudCwgcGFyZW50KTtcblx0XHRjYXNlIDEzOlxuXHRcdHJldHVybiBDYW1lcmFFbGVtZW50KGVsZW1lbnQsIHBhcmVudCk7XG5cdFx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gTGF5ZXJCYXNlKGVsZW1lbnQsIHBhcmVudCk7XG5cdH1cbn0iLCJmdW5jdGlvbiBzYW5pdGl6ZVN0cmluZyhzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FuaXRpemVTdHJpbmciLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vdHlwZWRBcnJheXMnKVxuXG4vKiFcbiBUcmFuc2Zvcm1hdGlvbiBNYXRyaXggdjIuMFxuIChjKSBFcGlzdGVtZXggMjAxNC0yMDE1XG4gd3d3LmVwaXN0ZW1leC5jb21cbiBCeSBLZW4gRnlyc3RlbmJlcmdcbiBDb250cmlidXRpb25zIGJ5IGxlZW9uaXlhLlxuIExpY2Vuc2U6IE1JVCwgaGVhZGVyIHJlcXVpcmVkLlxuICovXG5cbi8qKlxuICogMkQgdHJhbnNmb3JtYXRpb24gbWF0cml4IG9iamVjdCBpbml0aWFsaXplZCB3aXRoIGlkZW50aXR5IG1hdHJpeC5cbiAqXG4gKiBUaGUgbWF0cml4IGNhbiBzeW5jaHJvbml6ZSBhIGNhbnZhcyBjb250ZXh0IGJ5IHN1cHBseWluZyB0aGUgY29udGV4dFxuICogYXMgYW4gYXJndW1lbnQsIG9yIGxhdGVyIGFwcGx5IGN1cnJlbnQgYWJzb2x1dGUgdHJhbnNmb3JtIHRvIGFuXG4gKiBleGlzdGluZyBjb250ZXh0LlxuICpcbiAqIEFsbCB2YWx1ZXMgYXJlIGhhbmRsZWQgYXMgZmxvYXRpbmcgcG9pbnQgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBbY29udGV4dF0gLSBPcHRpb25hbCBjb250ZXh0IHRvIHN5bmMgd2l0aCBNYXRyaXhcbiAqIEBwcm9wIHtudW1iZXJ9IGEgLSBzY2FsZSB4XG4gKiBAcHJvcCB7bnVtYmVyfSBiIC0gc2hlYXIgeVxuICogQHByb3Age251bWJlcn0gYyAtIHNoZWFyIHhcbiAqIEBwcm9wIHtudW1iZXJ9IGQgLSBzY2FsZSB5XG4gKiBAcHJvcCB7bnVtYmVyfSBlIC0gdHJhbnNsYXRlIHhcbiAqIEBwcm9wIHtudW1iZXJ9IGYgLSB0cmFuc2xhdGUgeVxuICogQHByb3Age0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRHxudWxsfSBbY29udGV4dD1udWxsXSAtIHNldCBvciBnZXQgY3VycmVudCBjYW52YXMgY29udGV4dFxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxudmFyIE1hdHJpeCA9IChmdW5jdGlvbigpe1xuXG4gICAgdmFyIF9jb3MgPSBNYXRoLmNvcztcbiAgICB2YXIgX3NpbiA9IE1hdGguc2luO1xuICAgIHZhciBfdGFuID0gTWF0aC50YW47XG4gICAgdmFyIF9ybmQgPSBNYXRoLnJvdW5kO1xuXG4gICAgZnVuY3Rpb24gcmVzZXQoKXtcbiAgICAgICAgdGhpcy5wcm9wc1swXSA9IDE7XG4gICAgICAgIHRoaXMucHJvcHNbMV0gPSAwO1xuICAgICAgICB0aGlzLnByb3BzWzJdID0gMDtcbiAgICAgICAgdGhpcy5wcm9wc1szXSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHNbNF0gPSAwO1xuICAgICAgICB0aGlzLnByb3BzWzVdID0gMTtcbiAgICAgICAgdGhpcy5wcm9wc1s2XSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHNbN10gPSAwO1xuICAgICAgICB0aGlzLnByb3BzWzhdID0gMDtcbiAgICAgICAgdGhpcy5wcm9wc1s5XSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHNbMTBdID0gMTtcbiAgICAgICAgdGhpcy5wcm9wc1sxMV0gPSAwO1xuICAgICAgICB0aGlzLnByb3BzWzEyXSA9IDA7XG4gICAgICAgIHRoaXMucHJvcHNbMTNdID0gMDtcbiAgICAgICAgdGhpcy5wcm9wc1sxNF0gPSAwO1xuICAgICAgICB0aGlzLnByb3BzWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZShhbmdsZSkge1xuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAtbVNpbiwgIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZVgoYW5nbGUpe1xuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdCgxLCAwLCAwLCAwLCAwLCBtQ29zLCAtbVNpbiwgMCwgMCwgbVNpbiwgIG1Db3MsIDAsIDAsIDAsIDAsIDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZVkoYW5nbGUpe1xuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAgMCwgIG1TaW4sIDAsIDAsIDEsIDAsIDAsIC1tU2luLCAgMCwgIG1Db3MsIDAsIDAsIDAsIDAsIDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZVooYW5nbGUpe1xuICAgICAgICBpZihhbmdsZSA9PT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbUNvcyA9IF9jb3MoYW5nbGUpO1xuICAgICAgICB2YXIgbVNpbiA9IF9zaW4oYW5nbGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdChtQ29zLCAtbVNpbiwgIDAsIDAsIG1TaW4sICBtQ29zLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNoZWFyKHN4LHN5KXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3QoMSwgc3ksIHN4LCAxLCAwLCAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBza2V3KGF4LCBheSl7XG4gICAgICAgIHJldHVybiB0aGlzLnNoZWFyKF90YW4oYXgpLCBfdGFuKGF5KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2tld0Zyb21BeGlzKGF4LCBhbmdsZSl7XG4gICAgICAgIHZhciBtQ29zID0gX2NvcyhhbmdsZSk7XG4gICAgICAgIHZhciBtU2luID0gX3NpbihhbmdsZSk7XG4gICAgICAgIHJldHVybiB0aGlzLl90KG1Db3MsIG1TaW4sICAwLCAwLCAtbVNpbiwgIG1Db3MsIDAsIDAsIDAsICAwLCAgMSwgMCwgMCwgMCwgMCwgMSlcbiAgICAgICAgICAgIC5fdCgxLCAwLCAgMCwgMCwgX3RhbihheCksICAxLCAwLCAwLCAwLCAgMCwgIDEsIDAsIDAsIDAsIDAsIDEpXG4gICAgICAgICAgICAuX3QobUNvcywgLW1TaW4sICAwLCAwLCBtU2luLCAgbUNvcywgMCwgMCwgMCwgIDAsICAxLCAwLCAwLCAwLCAwLCAxKTtcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5fdChtQ29zLCBtU2luLCAtbVNpbiwgbUNvcywgMCwgMCkuX3QoMSwgMCwgX3RhbihheCksIDEsIDAsIDApLl90KG1Db3MsIC1tU2luLCBtU2luLCBtQ29zLCAwLCAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZShzeCwgc3ksIHN6KSB7XG4gICAgICAgIHN6ID0gaXNOYU4oc3opID8gMSA6IHN6O1xuICAgICAgICBpZihzeCA9PSAxICYmIHN5ID09IDEgJiYgc3ogPT0gMSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fdChzeCwgMCwgMCwgMCwgMCwgc3ksIDAsIDAsIDAsIDAsIHN6LCAwLCAwLCAwLCAwLCAxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUcmFuc2Zvcm0oYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSwgaiwgaywgbCwgbSwgbiwgbywgcCkge1xuICAgICAgICB0aGlzLnByb3BzWzBdID0gYTtcbiAgICAgICAgdGhpcy5wcm9wc1sxXSA9IGI7XG4gICAgICAgIHRoaXMucHJvcHNbMl0gPSBjO1xuICAgICAgICB0aGlzLnByb3BzWzNdID0gZDtcbiAgICAgICAgdGhpcy5wcm9wc1s0XSA9IGU7XG4gICAgICAgIHRoaXMucHJvcHNbNV0gPSBmO1xuICAgICAgICB0aGlzLnByb3BzWzZdID0gZztcbiAgICAgICAgdGhpcy5wcm9wc1s3XSA9IGg7XG4gICAgICAgIHRoaXMucHJvcHNbOF0gPSBpO1xuICAgICAgICB0aGlzLnByb3BzWzldID0gajtcbiAgICAgICAgdGhpcy5wcm9wc1sxMF0gPSBrO1xuICAgICAgICB0aGlzLnByb3BzWzExXSA9IGw7XG4gICAgICAgIHRoaXMucHJvcHNbMTJdID0gbTtcbiAgICAgICAgdGhpcy5wcm9wc1sxM10gPSBuO1xuICAgICAgICB0aGlzLnByb3BzWzE0XSA9IG87XG4gICAgICAgIHRoaXMucHJvcHNbMTVdID0gcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKHR4LCB0eSwgdHopIHtcbiAgICAgICAgdHogPSB0eiB8fCAwO1xuICAgICAgICBpZih0eCAhPT0gMCB8fCB0eSAhPT0gMCB8fCB0eiAhPT0gMCl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdCgxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCx0eCx0eSx0eiwxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm0oYTIsIGIyLCBjMiwgZDIsIGUyLCBmMiwgZzIsIGgyLCBpMiwgajIsIGsyLCBsMiwgbTIsIG4yLCBvMiwgcDIpIHtcblxuICAgICAgICB2YXIgX3AgPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmKGEyID09PSAxICYmIGIyID09PSAwICYmIGMyID09PSAwICYmIGQyID09PSAwICYmIGUyID09PSAwICYmIGYyID09PSAxICYmIGcyID09PSAwICYmIGgyID09PSAwICYmIGkyID09PSAwICYmIGoyID09PSAwICYmIGsyID09PSAxICYmIGwyID09PSAwKXtcbiAgICAgICAgICAgIC8vTk9URTogY29tbWVudGluZyB0aGlzIGNvbmRpdGlvbiBiZWNhdXNlIFR1cmJvRmFuIGRlb3B0aW1pemVzIGNvZGUgd2hlbiBwcmVzZW50XG4gICAgICAgICAgICAvL2lmKG0yICE9PSAwIHx8IG4yICE9PSAwIHx8IG8yICE9PSAwKXtcbiAgICAgICAgICAgICAgICBfcFsxMl0gPSBfcFsxMl0gKiBhMiArIF9wWzE1XSAqIG0yO1xuICAgICAgICAgICAgICAgIF9wWzEzXSA9IF9wWzEzXSAqIGYyICsgX3BbMTVdICogbjI7XG4gICAgICAgICAgICAgICAgX3BbMTRdID0gX3BbMTRdICogazIgKyBfcFsxNV0gKiBvMjtcbiAgICAgICAgICAgICAgICBfcFsxNV0gPSBfcFsxNV0gKiBwMjtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhMSA9IF9wWzBdO1xuICAgICAgICB2YXIgYjEgPSBfcFsxXTtcbiAgICAgICAgdmFyIGMxID0gX3BbMl07XG4gICAgICAgIHZhciBkMSA9IF9wWzNdO1xuICAgICAgICB2YXIgZTEgPSBfcFs0XTtcbiAgICAgICAgdmFyIGYxID0gX3BbNV07XG4gICAgICAgIHZhciBnMSA9IF9wWzZdO1xuICAgICAgICB2YXIgaDEgPSBfcFs3XTtcbiAgICAgICAgdmFyIGkxID0gX3BbOF07XG4gICAgICAgIHZhciBqMSA9IF9wWzldO1xuICAgICAgICB2YXIgazEgPSBfcFsxMF07XG4gICAgICAgIHZhciBsMSA9IF9wWzExXTtcbiAgICAgICAgdmFyIG0xID0gX3BbMTJdO1xuICAgICAgICB2YXIgbjEgPSBfcFsxM107XG4gICAgICAgIHZhciBvMSA9IF9wWzE0XTtcbiAgICAgICAgdmFyIHAxID0gX3BbMTVdO1xuXG4gICAgICAgIC8qIG1hdHJpeCBvcmRlciAoY2FudmFzIGNvbXBhdGlibGUpOlxuICAgICAgICAgKiBhY2VcbiAgICAgICAgICogYmRmXG4gICAgICAgICAqIDAwMVxuICAgICAgICAgKi9cbiAgICAgICAgX3BbMF0gPSBhMSAqIGEyICsgYjEgKiBlMiArIGMxICogaTIgKyBkMSAqIG0yO1xuICAgICAgICBfcFsxXSA9IGExICogYjIgKyBiMSAqIGYyICsgYzEgKiBqMiArIGQxICogbjIgO1xuICAgICAgICBfcFsyXSA9IGExICogYzIgKyBiMSAqIGcyICsgYzEgKiBrMiArIGQxICogbzIgO1xuICAgICAgICBfcFszXSA9IGExICogZDIgKyBiMSAqIGgyICsgYzEgKiBsMiArIGQxICogcDIgO1xuXG4gICAgICAgIF9wWzRdID0gZTEgKiBhMiArIGYxICogZTIgKyBnMSAqIGkyICsgaDEgKiBtMiA7XG4gICAgICAgIF9wWzVdID0gZTEgKiBiMiArIGYxICogZjIgKyBnMSAqIGoyICsgaDEgKiBuMiA7XG4gICAgICAgIF9wWzZdID0gZTEgKiBjMiArIGYxICogZzIgKyBnMSAqIGsyICsgaDEgKiBvMiA7XG4gICAgICAgIF9wWzddID0gZTEgKiBkMiArIGYxICogaDIgKyBnMSAqIGwyICsgaDEgKiBwMiA7XG5cbiAgICAgICAgX3BbOF0gPSBpMSAqIGEyICsgajEgKiBlMiArIGsxICogaTIgKyBsMSAqIG0yIDtcbiAgICAgICAgX3BbOV0gPSBpMSAqIGIyICsgajEgKiBmMiArIGsxICogajIgKyBsMSAqIG4yIDtcbiAgICAgICAgX3BbMTBdID0gaTEgKiBjMiArIGoxICogZzIgKyBrMSAqIGsyICsgbDEgKiBvMiA7XG4gICAgICAgIF9wWzExXSA9IGkxICogZDIgKyBqMSAqIGgyICsgazEgKiBsMiArIGwxICogcDIgO1xuXG4gICAgICAgIF9wWzEyXSA9IG0xICogYTIgKyBuMSAqIGUyICsgbzEgKiBpMiArIHAxICogbTIgO1xuICAgICAgICBfcFsxM10gPSBtMSAqIGIyICsgbjEgKiBmMiArIG8xICogajIgKyBwMSAqIG4yIDtcbiAgICAgICAgX3BbMTRdID0gbTEgKiBjMiArIG4xICogZzIgKyBvMSAqIGsyICsgcDEgKiBvMiA7XG4gICAgICAgIF9wWzE1XSA9IG0xICogZDIgKyBuMSAqIGgyICsgbzEgKiBsMiArIHAxICogcDIgO1xuXG4gICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0lkZW50aXR5KCkge1xuICAgICAgICBpZighdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkKXtcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5ID0gISh0aGlzLnByb3BzWzBdICE9PSAxIHx8IHRoaXMucHJvcHNbMV0gIT09IDAgfHwgdGhpcy5wcm9wc1syXSAhPT0gMCB8fCB0aGlzLnByb3BzWzNdICE9PSAwIHx8IHRoaXMucHJvcHNbNF0gIT09IDAgfHwgdGhpcy5wcm9wc1s1XSAhPT0gMSB8fCB0aGlzLnByb3BzWzZdICE9PSAwIHx8IHRoaXMucHJvcHNbN10gIT09IDAgfHwgdGhpcy5wcm9wc1s4XSAhPT0gMCB8fCB0aGlzLnByb3BzWzldICE9PSAwIHx8IHRoaXMucHJvcHNbMTBdICE9PSAxIHx8IHRoaXMucHJvcHNbMTFdICE9PSAwIHx8IHRoaXMucHJvcHNbMTJdICE9PSAwIHx8IHRoaXMucHJvcHNbMTNdICE9PSAwIHx8IHRoaXMucHJvcHNbMTRdICE9PSAwIHx8IHRoaXMucHJvcHNbMTVdICE9PSAxKTtcbiAgICAgICAgICAgIHRoaXMuX2lkZW50aXR5Q2FsY3VsYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkZW50aXR5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVxdWFscyhtYXRyKXtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IDE2KSB7XG4gICAgICAgICAgICBpZihtYXRyLnByb3BzW2ldICE9PSB0aGlzLnByb3BzW2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSs9MTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZShtYXRyKXtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvcihpPTA7aTwxNjtpKz0xKXtcbiAgICAgICAgICAgIG1hdHIucHJvcHNbaV0gPSB0aGlzLnByb3BzW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmVGcm9tUHJvcHMocHJvcHMpe1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yKGk9MDtpPDE2O2krPTEpe1xuICAgICAgICAgICAgdGhpcy5wcm9wc1tpXSA9IHByb3BzW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50KHgsIHksIHopIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHogKiB0aGlzLnByb3BzWzhdICsgdGhpcy5wcm9wc1sxMl0sXG4gICAgICAgICAgICB5OiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSxcbiAgICAgICAgICAgIHo6IHggKiB0aGlzLnByb3BzWzJdICsgeSAqIHRoaXMucHJvcHNbNl0gKyB6ICogdGhpcy5wcm9wc1sxMF0gKyB0aGlzLnByb3BzWzE0XVxuICAgICAgICB9O1xuICAgICAgICAvKnJldHVybiB7XG4gICAgICAgICB4OiB4ICogbWUuYSArIHkgKiBtZS5jICsgbWUuZSxcbiAgICAgICAgIHk6IHggKiBtZS5iICsgeSAqIG1lLmQgKyBtZS5mXG4gICAgICAgICB9OyovXG4gICAgfVxuICAgIGZ1bmN0aW9uIGFwcGx5VG9YKHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuIHggKiB0aGlzLnByb3BzWzBdICsgeSAqIHRoaXMucHJvcHNbNF0gKyB6ICogdGhpcy5wcm9wc1s4XSArIHRoaXMucHJvcHNbMTJdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhcHBseVRvWSh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiB4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXBwbHlUb1ooeCwgeSwgeikge1xuICAgICAgICByZXR1cm4geCAqIHRoaXMucHJvcHNbMl0gKyB5ICogdGhpcy5wcm9wc1s2XSArIHogKiB0aGlzLnByb3BzWzEwXSArIHRoaXMucHJvcHNbMTRdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmVyc2VQb2ludChwdCkge1xuICAgICAgICB2YXIgZGV0ZXJtaW5hbnQgPSB0aGlzLnByb3BzWzBdICogdGhpcy5wcm9wc1s1XSAtIHRoaXMucHJvcHNbMV0gKiB0aGlzLnByb3BzWzRdO1xuICAgICAgICB2YXIgYSA9IHRoaXMucHJvcHNbNV0vZGV0ZXJtaW5hbnQ7XG4gICAgICAgIHZhciBiID0gLSB0aGlzLnByb3BzWzFdL2RldGVybWluYW50O1xuICAgICAgICB2YXIgYyA9IC0gdGhpcy5wcm9wc1s0XS9kZXRlcm1pbmFudDtcbiAgICAgICAgdmFyIGQgPSB0aGlzLnByb3BzWzBdL2RldGVybWluYW50O1xuICAgICAgICB2YXIgZSA9ICh0aGlzLnByb3BzWzRdICogdGhpcy5wcm9wc1sxM10gLSB0aGlzLnByb3BzWzVdICogdGhpcy5wcm9wc1sxMl0pL2RldGVybWluYW50O1xuICAgICAgICB2YXIgZiA9IC0gKHRoaXMucHJvcHNbMF0gKiB0aGlzLnByb3BzWzEzXSAtIHRoaXMucHJvcHNbMV0gKiB0aGlzLnByb3BzWzEyXSkvZGV0ZXJtaW5hbnQ7XG4gICAgICAgIHJldHVybiBbcHRbMF0gKiBhICsgcHRbMV0gKiBjICsgZSwgcHRbMF0gKiBiICsgcHRbMV0gKiBkICsgZiwgMF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52ZXJzZVBvaW50cyhwdHMpe1xuICAgICAgICB2YXIgaSwgbGVuID0gcHRzLmxlbmd0aCwgcmV0UHRzID0gW107XG4gICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XG4gICAgICAgICAgICByZXRQdHNbaV0gPSBpbnZlcnNlUG9pbnQocHRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0UHRzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5VG9UcmlwbGVQb2ludHMocHQxLCBwdDIsIHB0Mykge1xuICAgICAgICB2YXIgYXJyID0gY3JlYXRlVHlwZWRBcnJheSgnZmxvYXQzMicsIDYpO1xuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xuICAgICAgICAgICAgYXJyWzBdID0gcHQxWzBdO1xuICAgICAgICAgICAgYXJyWzFdID0gcHQxWzFdO1xuICAgICAgICAgICAgYXJyWzJdID0gcHQyWzBdO1xuICAgICAgICAgICAgYXJyWzNdID0gcHQyWzFdO1xuICAgICAgICAgICAgYXJyWzRdID0gcHQzWzBdO1xuICAgICAgICAgICAgYXJyWzVdID0gcHQzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHAwID0gdGhpcy5wcm9wc1swXSwgcDEgPSB0aGlzLnByb3BzWzFdLCBwNCA9IHRoaXMucHJvcHNbNF0sIHA1ID0gdGhpcy5wcm9wc1s1XSwgcDEyID0gdGhpcy5wcm9wc1sxMl0sIHAxMyA9IHRoaXMucHJvcHNbMTNdO1xuICAgICAgICAgICAgYXJyWzBdID0gcHQxWzBdICogcDAgKyBwdDFbMV0gKiBwNCArIHAxMjtcbiAgICAgICAgICAgIGFyclsxXSA9IHB0MVswXSAqIHAxICsgcHQxWzFdICogcDUgKyBwMTM7XG4gICAgICAgICAgICBhcnJbMl0gPSBwdDJbMF0gKiBwMCArIHB0MlsxXSAqIHA0ICsgcDEyO1xuICAgICAgICAgICAgYXJyWzNdID0gcHQyWzBdICogcDEgKyBwdDJbMV0gKiBwNSArIHAxMztcbiAgICAgICAgICAgIGFycls0XSA9IHB0M1swXSAqIHAwICsgcHQzWzFdICogcDQgKyBwMTI7XG4gICAgICAgICAgICBhcnJbNV0gPSBwdDNbMF0gKiBwMSArIHB0M1sxXSAqIHA1ICsgcDEzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50QXJyYXkoeCx5LHope1xuICAgICAgICB2YXIgYXJyO1xuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xuICAgICAgICAgICAgYXJyID0gW3gseSx6XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyciA9IFt4ICogdGhpcy5wcm9wc1swXSArIHkgKiB0aGlzLnByb3BzWzRdICsgeiAqIHRoaXMucHJvcHNbOF0gKyB0aGlzLnByb3BzWzEyXSx4ICogdGhpcy5wcm9wc1sxXSArIHkgKiB0aGlzLnByb3BzWzVdICsgeiAqIHRoaXMucHJvcHNbOV0gKyB0aGlzLnByb3BzWzEzXSx4ICogdGhpcy5wcm9wc1syXSArIHkgKiB0aGlzLnByb3BzWzZdICsgeiAqIHRoaXMucHJvcHNbMTBdICsgdGhpcy5wcm9wc1sxNF1dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlUb1BvaW50U3RyaW5naWZpZWQoeCwgeSkge1xuICAgICAgICBpZih0aGlzLmlzSWRlbnRpdHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHggKyAnLCcgKyB5O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoeCAqIHRoaXMucHJvcHNbMF0gKyB5ICogdGhpcy5wcm9wc1s0XSArIHRoaXMucHJvcHNbMTJdKSsnLCcrKHggKiB0aGlzLnByb3BzWzFdICsgeSAqIHRoaXMucHJvcHNbNV0gKyB0aGlzLnByb3BzWzEzXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9DU1MoKSB7XG4gICAgICAgIC8vRG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgdG8gYWRkIHRoaXMgb3B0aW1pemF0aW9uLiBJZiBpdCBpcyBhbiBpZGVudGl0eSBtYXRyaXgsIGl0J3MgdmVyeSBsaWtlbHkgdGhpcyB3aWxsIGdldCBjYWxsZWQgb25seSBvbmNlIHNpbmNlIGl0IHdvbid0IGJlIGtleWZyYW1lZC5cbiAgICAgICAgLyppZih0aGlzLmlzSWRlbnRpdHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9Ki9cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgY3NzVmFsdWUgPSAnbWF0cml4M2QoJztcbiAgICAgICAgdmFyIHYgPSAxMDAwMDtcbiAgICAgICAgd2hpbGUoaTwxNil7XG4gICAgICAgICAgICBjc3NWYWx1ZSArPSBfcm5kKHByb3BzW2ldKnYpL3Y7XG4gICAgICAgICAgICBjc3NWYWx1ZSArPSBpID09PSAxNSA/ICcpJzonLCc7XG4gICAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNzc1ZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvMmRDU1MoKSB7XG4gICAgICAgIC8vRG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgdG8gYWRkIHRoaXMgb3B0aW1pemF0aW9uLiBJZiBpdCBpcyBhbiBpZGVudGl0eSBtYXRyaXgsIGl0J3MgdmVyeSBsaWtlbHkgdGhpcyB3aWxsIGdldCBjYWxsZWQgb25seSBvbmNlIHNpbmNlIGl0IHdvbid0IGJlIGtleWZyYW1lZC5cbiAgICAgICAgLyppZih0aGlzLmlzSWRlbnRpdHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9Ki9cbiAgICAgICAgdmFyIHYgPSAxMDAwMDtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIFwibWF0cml4KFwiICsgX3JuZChwcm9wc1swXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxXSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s0XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1s1XSp2KS92ICsgJywnICsgX3JuZChwcm9wc1sxMl0qdikvdiArICcsJyArIF9ybmQocHJvcHNbMTNdKnYpL3YgKyBcIilcIjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBNYXRyaXhJbnN0YW5jZSgpe1xuICAgICAgICB0aGlzLnJlc2V0ID0gcmVzZXQ7XG4gICAgICAgIHRoaXMucm90YXRlID0gcm90YXRlO1xuICAgICAgICB0aGlzLnJvdGF0ZVggPSByb3RhdGVYO1xuICAgICAgICB0aGlzLnJvdGF0ZVkgPSByb3RhdGVZO1xuICAgICAgICB0aGlzLnJvdGF0ZVogPSByb3RhdGVaO1xuICAgICAgICB0aGlzLnNrZXcgPSBza2V3O1xuICAgICAgICB0aGlzLnNrZXdGcm9tQXhpcyA9IHNrZXdGcm9tQXhpcztcbiAgICAgICAgdGhpcy5zaGVhciA9IHNoZWFyO1xuICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XG4gICAgICAgIHRoaXMuc2V0VHJhbnNmb3JtID0gc2V0VHJhbnNmb3JtO1xuICAgICAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgICAgIHRoaXMuYXBwbHlUb1BvaW50ID0gYXBwbHlUb1BvaW50O1xuICAgICAgICB0aGlzLmFwcGx5VG9YID0gYXBwbHlUb1g7XG4gICAgICAgIHRoaXMuYXBwbHlUb1kgPSBhcHBseVRvWTtcbiAgICAgICAgdGhpcy5hcHBseVRvWiA9IGFwcGx5VG9aO1xuICAgICAgICB0aGlzLmFwcGx5VG9Qb2ludEFycmF5ID0gYXBwbHlUb1BvaW50QXJyYXk7XG4gICAgICAgIHRoaXMuYXBwbHlUb1RyaXBsZVBvaW50cyA9IGFwcGx5VG9UcmlwbGVQb2ludHM7XG4gICAgICAgIHRoaXMuYXBwbHlUb1BvaW50U3RyaW5naWZpZWQgPSBhcHBseVRvUG9pbnRTdHJpbmdpZmllZDtcbiAgICAgICAgdGhpcy50b0NTUyA9IHRvQ1NTO1xuICAgICAgICB0aGlzLnRvMmRDU1MgPSB0bzJkQ1NTO1xuICAgICAgICB0aGlzLmNsb25lID0gY2xvbmU7XG4gICAgICAgIHRoaXMuY2xvbmVGcm9tUHJvcHMgPSBjbG9uZUZyb21Qcm9wcztcbiAgICAgICAgdGhpcy5lcXVhbHMgPSBlcXVhbHM7XG4gICAgICAgIHRoaXMuaW52ZXJzZVBvaW50cyA9IGludmVyc2VQb2ludHM7XG4gICAgICAgIHRoaXMuaW52ZXJzZVBvaW50ID0gaW52ZXJzZVBvaW50O1xuICAgICAgICB0aGlzLl90ID0gdGhpcy50cmFuc2Zvcm07XG4gICAgICAgIHRoaXMuaXNJZGVudGl0eSA9IGlzSWRlbnRpdHk7XG4gICAgICAgIHRoaXMuX2lkZW50aXR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faWRlbnRpdHlDYWxjdWxhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5wcm9wcyA9IGNyZWF0ZVR5cGVkQXJyYXkoJ2Zsb2F0MzInLCAxNik7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeEluc3RhbmNlKClcbiAgICB9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDsiLCJ2YXIgY3JlYXRlVHlwZWRBcnJheSA9IChmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiBjcmVhdGVSZWd1bGFyQXJyYXkodHlwZSwgbGVuKXtcblx0XHR2YXIgaSA9IDAsIGFyciA9IFtdLCB2YWx1ZTtcblx0XHRzd2l0Y2godHlwZSkge1xuXHRcdFx0Y2FzZSAnaW50MTYnOlxuXHRcdFx0Y2FzZSAndWludDhjJzpcblx0XHRcdFx0dmFsdWUgPSAxO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHZhbHVlID0gMS4xO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcblx0XHRcdGFyci5wdXNoKHZhbHVlKTtcblx0XHR9XG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVUeXBlZEFycmF5KHR5cGUsIGxlbil7XG5cdFx0aWYodHlwZSA9PT0gJ2Zsb2F0MzInKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShsZW4pO1xuXHRcdH0gZWxzZSBpZih0eXBlID09PSAnaW50MTYnKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEludDE2QXJyYXkobGVuKTtcblx0XHR9IGVsc2UgaWYodHlwZSA9PT0gJ3VpbnQ4YycpIHtcblx0XHRcdHJldHVybiBuZXcgVWludDhDbGFtcGVkQXJyYXkobGVuKTtcblx0XHR9XG5cdH1cblx0aWYodHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBGbG9hdDMyQXJyYXkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gY3JlYXRlVHlwZWRBcnJheTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gY3JlYXRlUmVndWxhckFycmF5O1xuXHR9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVR5cGVkQXJyYXk7XG4iLCJ2YXIgQW5pbWF0aW9uSXRlbSA9IHJlcXVpcmUoJy4vYW5pbWF0aW9uL0FuaW1hdGlvbkl0ZW0nKTtcblxuZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uQXBpKGFuaW0pIHtcblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIEFuaW1hdGlvbkl0ZW0oYW5pbSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlQW5pbWF0aW9uQXBpIDogY3JlYXRlQW5pbWF0aW9uQXBpXG59IiwidmFyIGtleVBhdGhCdWlsZGVyID0gcmVxdWlyZSgnLi4vaGVscGVycy9rZXlQYXRoQnVpbGRlcicpO1xudmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcblxuZnVuY3Rpb24gS2V5UGF0aExpc3QoZWxlbWVudHMsIG5vZGVfdHlwZSkge1xuXG5cdGZ1bmN0aW9uIF9nZXRMZW5ndGgoKSB7XG5cdFx0cmV0dXJuIGVsZW1lbnRzLmxlbmd0aDtcblx0fVxuXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSkge1xuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0VGFyZ2V0TGF5ZXIoKS5kYXRhLnR5ID09PSBsYXllcl90eXBlc1t0eXBlXTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9maWx0ZXJMYXllckJ5TmFtZShlbGVtZW50cywgbmFtZSkge1xuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0VGFyZ2V0TGF5ZXIoKS5kYXRhLm5tID09PSBuYW1lO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgbmFtZSkge1xuXHRcdHJldHVybiBlbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0aWYoZWxlbWVudC5oYXNQcm9wZXJ0eShuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudC5nZXRQcm9wZXJ0eShuYW1lKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZShzZWxlY3Rvcikge1xuXHRcdHJldHVybiBLZXlQYXRoTGlzdChfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHNlbGVjdG9yKSwgJ2xheWVyJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRMYXllcnNCeU5hbWUoc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBzZWxlY3RvciksICdsYXllcicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0UHJvcGVydGllc0J5U2VsZWN0b3Ioc2VsZWN0b3IpIHtcblx0XHRyZXR1cm4gS2V5UGF0aExpc3QoZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50Lmhhc1Byb3BlcnR5KHNlbGVjdG9yKTtcblx0XHR9KS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQuZ2V0UHJvcGVydHkoc2VsZWN0b3IpO1xuXHRcdH0pLCAncHJvcGVydHknKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldExheWVyUHJvcGVydHkoc2VsZWN0b3IpIHtcblx0XHR2YXIgbGF5ZXJzID0gX2ZpbHRlckxheWVyQnlQcm9wZXJ0eShlbGVtZW50cywgc2VsZWN0b3IpO1xuXHRcdHZhciBwcm9wZXJ0aWVzID0gbGF5ZXJzLm1hcChmdW5jdGlvbihlbGVtZW50KXtcblx0XHRcdHJldHVybiBlbGVtZW50LmdldFByb3BlcnR5KHNlbGVjdG9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBLZXlQYXRoTGlzdChwcm9wZXJ0aWVzLCAncHJvcGVydHknKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEtleVBhdGgocHJvcGVydHlQYXRoKSB7XG5cdFx0dmFyIGtleVBhdGhEYXRhID0ga2V5UGF0aEJ1aWxkZXIocHJvcGVydHlQYXRoKTtcblx0XHR2YXIgc2VsZWN0b3IgPSBrZXlQYXRoRGF0YS5zZWxlY3Rvcjtcblx0XHR2YXIgbm9kZXNCeU5hbWUsIG5vZGVzQnlUeXBlLCBzZWxlY3RlZE5vZGVzO1xuXHRcdGlmIChub2RlX3R5cGUgPT09ICdyZW5kZXJlcicgfHwgbm9kZV90eXBlID09PSAnbGF5ZXInKSB7XG5cdFx0XHRub2Rlc0J5TmFtZSA9IGdldExheWVyc0J5TmFtZShzZWxlY3Rvcik7XG5cdFx0XHRub2Rlc0J5VHlwZSA9IGdldExheWVyc0J5VHlwZShzZWxlY3Rvcik7XG5cdFx0XHRpZiAobm9kZXNCeU5hbWUubGVuZ3RoID09PSAwICYmIG5vZGVzQnlUeXBlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gZ2V0TGF5ZXJQcm9wZXJ0eShzZWxlY3Rvcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxlY3RlZE5vZGVzID0gbm9kZXNCeU5hbWUuY29uY2F0KG5vZGVzQnlUeXBlKTtcblx0XHRcdH1cblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG5vZGVfdHlwZSA9PT0gJ3Byb3BlcnR5Jykge1xuXHRcdFx0c2VsZWN0ZWROb2RlcyA9IGdldFByb3BlcnRpZXNCeVNlbGVjdG9yKHNlbGVjdG9yKTtcblx0XHRcdGlmIChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXMuZ2V0S2V5UGF0aChrZXlQYXRoRGF0YS5wcm9wZXJ0eVBhdGgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHNlbGVjdGVkTm9kZXM7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gY29uY2F0KG5vZGVzKSB7XG5cdFx0dmFyIG5vZGVzRWxlbWVudHMgPSBub2Rlcy5nZXRFbGVtZW50cygpO1xuXHRcdHJldHVybiBLZXlQYXRoTGlzdChlbGVtZW50cy5jb25jYXQobm9kZXNFbGVtZW50cyksIG5vZGVfdHlwZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcblx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRQcm9wZXJ0eUF0SW5kZXgoaW5kZXgpIHtcblx0XHRyZXR1cm4gZWxlbWVudHNbaW5kZXhdO1xuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdFx0Z2V0S2V5UGF0aDogZ2V0S2V5UGF0aCxcblx0XHRjb25jYXQ6IGNvbmNhdCxcblx0XHRnZXRFbGVtZW50czogZ2V0RWxlbWVudHMsXG5cdFx0Z2V0UHJvcGVydHlBdEluZGV4OiBnZXRQcm9wZXJ0eUF0SW5kZXhcblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtZXRob2RzLCAnbGVuZ3RoJywge1xuXHRcdGdldDogX2dldExlbmd0aFxuXHR9KTtcblxuXHRyZXR1cm4gbWV0aG9kcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlQYXRoTGlzdDsiLCJ2YXIga2V5X3BhdGhfc2VwYXJhdG9yID0gcmVxdWlyZSgnLi4vZW51bXMva2V5X3BhdGhfc2VwYXJhdG9yJyk7XG52YXIgcHJvcGVydHlfbmFtZXMgPSByZXF1aXJlKCcuLi9lbnVtcy9wcm9wZXJ0eV9uYW1lcycpO1xuXG5mdW5jdGlvbiBLZXlQYXRoTm9kZShzdGF0ZSkge1xuXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yLCBwcm9wZXJ0eVBhdGgpIHtcblx0XHR2YXIgaW5zdGFuY2VQcm9wZXJ0aWVzID0gc3RhdGUucHJvcGVydGllcyB8fCBbXTtcblx0XHR2YXIgaSA9IDAsIGxlbiA9IGluc3RhbmNlUHJvcGVydGllcy5sZW5ndGg7XG5cdFx0d2hpbGUoaSA8IGxlbikge1xuXHRcdFx0aWYoaW5zdGFuY2VQcm9wZXJ0aWVzW2ldLm5hbWUgPT09IHNlbGVjdG9yKSB7XG5cdFx0XHRcdHJldHVybiBpbnN0YW5jZVByb3BlcnRpZXNbaV0udmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRpICs9IDE7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBoYXNQcm9wZXJ0eShzZWxlY3Rvcikge1xuXHRcdHJldHVybiAhIWdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFByb3BlcnR5KHNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuIGdldFByb3BlcnR5QnlQYXRoKHNlbGVjdG9yKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xuXHRcdHJldHVybiBzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpIHtcblx0XHRyZXR1cm4gc3RhdGUucGFyZW50LnRvS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdFx0aGFzUHJvcGVydHk6IGhhc1Byb3BlcnR5LFxuXHRcdGdldFByb3BlcnR5OiBnZXRQcm9wZXJ0eSxcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludCxcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50XG5cdH1cblx0cmV0dXJuIG1ldGhvZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5UGF0aE5vZGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS9UcmFuc2Zvcm0nKTtcbnZhciBFZmZlY3RzID0gcmVxdWlyZSgnLi9lZmZlY3RzL0VmZmVjdHMnKTtcbnZhciBNYXRyaXggPSByZXF1aXJlKCcuLi9oZWxwZXJzL3RyYW5zZm9ybWF0aW9uTWF0cml4Jyk7XG5cbmZ1bmN0aW9uIExheWVyQmFzZShzdGF0ZSkge1xuXG5cdHZhciB0cmFuc2Zvcm0gPSBUcmFuc2Zvcm0oc3RhdGUuZWxlbWVudC5maW5hbFRyYW5zZm9ybS5tUHJvcCwgc3RhdGUpO1xuXHR2YXIgZWZmZWN0cyA9IEVmZmVjdHMoc3RhdGUuZWxlbWVudC5lZmZlY3RzTWFuYWdlci5lZmZlY3RFbGVtZW50cyB8fCBbXSwgc3RhdGUpO1xuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHN0YXRlLnByb3BlcnRpZXMucHVzaCh7XG5cdFx0XHRuYW1lOiAndHJhbnNmb3JtJyxcblx0XHRcdHZhbHVlOiB0cmFuc2Zvcm1cblx0XHR9LHtcblx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxuXHRcdFx0dmFsdWU6IHRyYW5zZm9ybVxuXHRcdH0se1xuXHRcdFx0bmFtZTogJ0VmZmVjdHMnLFxuXHRcdFx0dmFsdWU6IGVmZmVjdHNcblx0XHR9LHtcblx0XHRcdG5hbWU6ICdlZmZlY3RzJyxcblx0XHRcdHZhbHVlOiBlZmZlY3RzXG5cdFx0fSlcblx0fVxuXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICB9XG5cblx0ZnVuY3Rpb24gdG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xuXHRcdHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudDtcbiAgICBcdGlmKHN0YXRlLnBhcmVudC50b0tleXBhdGhMYXllclBvaW50KSB7XG4gICAgICAgIFx0cG9pbnQgPSBzdGF0ZS5wYXJlbnQudG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XG4gICAgICAgIH1cbiAgICBcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGksIGxlbiA9IGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9Xb3JsZE1hdC5pbnZlcnNlUG9pbnQocG9pbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZnJvbUtleXBhdGhMYXllclBvaW50KHBvaW50KSB7XG5cdFx0dmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50O1xuXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XG4gICAgICAgIHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xuICAgICAgICBpZihlbGVtZW50LmhpZXJhcmNoeSAmJiBlbGVtZW50LmhpZXJhcmNoeS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGksIGxlbiA9IGVsZW1lbnQuaGllcmFyY2h5Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvcihpPTA7aTxsZW47aSs9MSl7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5oaWVyYXJjaHlbaV0uZmluYWxUcmFuc2Zvcm0ubVByb3AuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xuICAgICAgICBpZihzdGF0ZS5wYXJlbnQuZnJvbUtleXBhdGhMYXllclBvaW50KSB7XG4gICAgICAgIFx0cmV0dXJuIHN0YXRlLnBhcmVudC5mcm9tS2V5cGF0aExheWVyUG9pbnQocG9pbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBcdHJldHVybiBwb2ludDtcbiAgICAgICAgfVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0VGFyZ2V0TGF5ZXIoKSB7XG5cdFx0cmV0dXJuIHN0YXRlLmVsZW1lbnQ7XG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0XHRnZXRUYXJnZXRMYXllcjogZ2V0VGFyZ2V0TGF5ZXIsXG5cdFx0dG9LZXlwYXRoTGF5ZXJQb2ludDogdG9LZXlwYXRoTGF5ZXJQb2ludCxcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludFxuXHR9XG5cblx0X2J1aWxkUHJvcGVydHlNYXAoKTtcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllckJhc2U7IiwidmFyIGxheWVyX3R5cGVzID0gcmVxdWlyZSgnLi4vZW51bXMvbGF5ZXJfdHlwZXMnKTtcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xuXG5mdW5jdGlvbiBMYXllckxpc3QoZWxlbWVudHMpIHtcblxuXHRmdW5jdGlvbiBfZ2V0TGVuZ3RoKCkge1xuXHRcdHJldHVybiBlbGVtZW50cy5sZW5ndGg7XG5cdH1cblxuXHRmdW5jdGlvbiBfZmlsdGVyTGF5ZXJCeVR5cGUoZWxlbWVudHMsIHR5cGUpIHtcblx0XHRyZXR1cm4gZWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LmRhdGEudHkgPT09IGxheWVyX3R5cGVzW3R5cGVdO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCBuYW1lKSB7XG5cdFx0cmV0dXJuIGVsZW1lbnRzLmZpbHRlcihmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5kYXRhLm5tID09PSBuYW1lO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzKCkge1xuXHRcdCByZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldExheWVyc0J5VHlwZSh0eXBlKSB7XG5cdFx0dmFyIGVsZW1lbnRzTGlzdCA9IF9maWx0ZXJMYXllckJ5VHlwZShlbGVtZW50cywgdHlwZSk7XG5cdFx0cmV0dXJuIExheWVyTGlzdChlbGVtZW50c0xpc3QpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TGF5ZXJzQnlOYW1lKHR5cGUpIHtcblx0XHR2YXIgZWxlbWVudHNMaXN0ID0gX2ZpbHRlckxheWVyQnlOYW1lKGVsZW1lbnRzLCB0eXBlKTtcblx0XHRyZXR1cm4gTGF5ZXJMaXN0KGVsZW1lbnRzTGlzdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBsYXllcihpbmRleCkge1xuXHRcdGlmIChpbmRleCA+PSBlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIGxheWVyX2FwaShlbGVtZW50c1twYXJzZUludChpbmRleCldKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZEl0ZXJhdGFibGVNZXRob2RzKGl0ZXJhdGFibGVNZXRob2RzLCBsaXN0KSB7XG5cdFx0aXRlcmF0YWJsZU1ldGhvZHMucmVkdWNlKGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSl7XG5cdFx0XHR2YXIgX3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRhY2N1bXVsYXRvclt2YWx1ZV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50cy5tYXAoZnVuY3Rpb24oZWxlbWVudCl7XG5cdFx0XHRcdFx0dmFyIGxheWVyID0gbGF5ZXJfYXBpKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGlmKGxheWVyW192YWx1ZV0pIHtcblx0XHRcdFx0XHRcdHJldHVybiBsYXllcltfdmFsdWVdLmFwcGx5KG51bGwsIF9hcmd1bWVudHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYWNjdW11bGF0b3I7XG5cdFx0fSwgbWV0aG9kcyk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRUYXJnZXRFbGVtZW50cygpIHtcblx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdH1cblxuXHRmdW5jdGlvbiBjb25jYXQobGlzdCkge1xuXHRcdHJldHVybiBlbGVtZW50cy5jb25jYXQobGlzdC5nZXRUYXJnZXRFbGVtZW50cygpKTtcblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHRcdGdldExheWVyczogZ2V0TGF5ZXJzLFxuXHRcdGdldExheWVyc0J5VHlwZTogZ2V0TGF5ZXJzQnlUeXBlLFxuXHRcdGdldExheWVyc0J5TmFtZTogZ2V0TGF5ZXJzQnlOYW1lLFxuXHRcdGxheWVyOiBsYXllcixcblx0XHRjb25jYXQ6IGNvbmNhdCxcblx0XHRnZXRUYXJnZXRFbGVtZW50czogZ2V0VGFyZ2V0RWxlbWVudHNcblx0fTtcblxuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRyYW5zbGF0ZScsICdnZXRUeXBlJywgJ2dldER1cmF0aW9uJ10pO1xuXHRhZGRJdGVyYXRhYmxlTWV0aG9kcyhbJ3NldFRleHQnLCAnZ2V0VGV4dCcsICdzZXREb2N1bWVudERhdGEnLCAnY2FuUmVzaXplRm9udCcsICdzZXRNaW5pbXVtRm9udFNpemUnXSk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1ldGhvZHMsICdsZW5ndGgnLCB7XG5cdFx0Z2V0OiBfZ2V0TGVuZ3RoXG5cdH0pO1xuXHRyZXR1cm4gbWV0aG9kcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMYXllckxpc3Q7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XG5cbmZ1bmN0aW9uIENhbWVyYShlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnUG9pbnQgb2YgSW50ZXJlc3QnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5hLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWm9vbScsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnBlLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5wLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWCBSb3RhdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ4LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWSBSb3RhdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ5LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWiBSb3RhdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnJ6LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT3JpZW50YXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vciwgcGFyZW50KVxuXHRcdFx0fVxuXHRcdF1cblx0fVxuXG5cdGZ1bmN0aW9uIGdldFRhcmdldExheWVyKCkge1xuXHRcdHJldHVybiBzdGF0ZS5lbGVtZW50O1xuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdFx0Z2V0VGFyZ2V0TGF5ZXI6IGdldFRhcmdldExheWVyXG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgS2V5UGF0aE5vZGUoc3RhdGUpLCBtZXRob2RzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmE7IiwidmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcbnZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcbnZhciBsYXllcl9hcGkgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2xheWVyQVBJQnVpbGRlcicpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcbnZhciBUaW1lUmVtYXAgPSByZXF1aXJlKCcuL1RpbWVSZW1hcCcpO1xuXG5mdW5jdGlvbiBDb21wb3NpdGlvbihlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBidWlsZExheWVyQXBpKGxheWVyLCBpbmRleCkge1xuXHRcdHZhciBfbGF5ZXJBcGkgPSBudWxsO1xuXHRcdHZhciBvYiA9IHtcblx0XHRcdG5hbWU6IGxheWVyLm5tXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0TGF5ZXJBcGkoKSB7XG5cdFx0XHRpZighX2xheWVyQXBpKSB7XG5cdFx0XHRcdF9sYXllckFwaSA9IGxheWVyX2FwaShlbGVtZW50LmVsZW1lbnRzW2luZGV4XSwgc3RhdGUpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gX2xheWVyQXBpXG5cdFx0fVxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XG5cdFx0XHRnZXQgOiBnZXRMYXllckFwaVxuXHRcdH0pXG5cdFx0cmV0dXJuIG9iO1xuXHR9XG5cblx0XG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHZhciBjb21wb3NpdGlvbkxheWVycyA9IGVsZW1lbnQubGF5ZXJzLm1hcChidWlsZExheWVyQXBpKVxuXHRcdHJldHVybiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdUaW1lIFJlbWFwJyxcblx0XHRcdFx0dmFsdWU6IFRpbWVSZW1hcChlbGVtZW50LnRtKVxuXHRcdFx0fVxuXHRcdF0uY29uY2F0KGNvbXBvc2l0aW9uTGF5ZXJzKVxuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdsYXllcicpLCBtZXRob2RzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFZhbHVlUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9WYWx1ZVByb3BlcnR5Jyk7XG5cbmZ1bmN0aW9uIFRpbWVSZW1hcChwcm9wZXJ0eSwgcGFyZW50KSB7XG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwcm9wZXJ0eTogcHJvcGVydHksXG5cdFx0cGFyZW50OiBwYXJlbnRcblx0fVxuXG5cdHZhciBfaXNDYWxsYmFja0FkZGVkID0gZmFsc2U7XG5cdHZhciBjdXJyZW50U2VnbWVudEluaXQgPSAwO1xuXHR2YXIgY3VycmVudFNlZ21lbnRFbmQgPSAwO1xuXHR2YXIgcHJldmlvdXNUaW1lID0gMCwgY3VycmVudFRpbWUgPSAwO1xuXHR2YXIgaW5pdFRpbWUgPSAwO1xuXHR2YXIgX2xvb3AgPSB0cnVlO1xuXHR2YXIgX2xvb3BDb3VudCA9IDA7XG5cdHZhciBfc3BlZWQgPSAxO1xuXHR2YXIgX3BhdXNlZCA9IGZhbHNlO1xuXHR2YXIgX2lzRGVidWdnaW5nID0gZmFsc2U7XG5cdHZhciBxdWV1ZWRTZWdtZW50cyA9IFtdO1xuXHR2YXIgX2Rlc3Ryb3lGdW5jdGlvbjtcblx0dmFyIGVudGVyRnJhbWVDYWxsYmFjayA9IG51bGw7XG5cdHZhciBlbnRlckZyYW1lRXZlbnQgPSB7XG5cdFx0dGltZTogLTFcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYXlTZWdtZW50KGluaXQsIGVuZCwgY2xlYXIpIHtcblx0XHRfcGF1c2VkID0gZmFsc2U7XG5cdFx0aWYoY2xlYXIpIHtcblx0XHRcdGNsZWFyUXVldWUoKTtcblx0XHRcdGN1cnJlbnRUaW1lID0gaW5pdDtcblx0XHR9XG5cdFx0aWYoX2lzRGVidWdnaW5nKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbml0LCBlbmQpO1xuXHRcdH1cblx0XHRfbG9vcENvdW50ID0gMDtcblx0XHRwcmV2aW91c1RpbWUgPSBEYXRlLm5vdygpO1xuXHRcdGN1cnJlbnRTZWdtZW50SW5pdCA9IGluaXQ7XG5cdFx0Y3VycmVudFNlZ21lbnRFbmQgPSBlbmQ7XG5cdFx0YWRkQ2FsbGJhY2soKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYXlRdWV1ZWRTZWdtZW50KCkge1xuXHRcdHZhciBuZXdTZWdtZW50ID0gcXVldWVkU2VnbWVudHMuc2hpZnQoKTtcblx0XHRwbGF5U2VnbWVudChuZXdTZWdtZW50WzBdLCBuZXdTZWdtZW50WzFdKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHF1ZXVlU2VnbWVudChpbml0LCBlbmQpIHtcblx0XHRxdWV1ZWRTZWdtZW50cy5wdXNoKFtpbml0LCBlbmRdKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyUXVldWUoKSB7XG5cdFx0cXVldWVkU2VnbWVudHMubGVuZ3RoID0gMDtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zZWdtZW50UGxheWVyKGN1cnJlbnRWYWx1ZSkge1xuXHRcdGlmKGN1cnJlbnRTZWdtZW50SW5pdCA9PT0gY3VycmVudFNlZ21lbnRFbmQpIHtcblx0XHRcdGN1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRJbml0O1xuXHRcdH0gZWxzZSBpZighX3BhdXNlZCkge1xuXHRcdFx0dmFyIG5vd1RpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0dmFyIGVsYXBzZWRUaW1lID0gX3NwZWVkICogKG5vd1RpbWUgLSBwcmV2aW91c1RpbWUpIC8gMTAwMDtcblx0XHRcdHByZXZpb3VzVGltZSA9IG5vd1RpbWU7XG5cdFx0XHRpZihjdXJyZW50U2VnbWVudEluaXQgPCBjdXJyZW50U2VnbWVudEVuZCkge1xuXHRcdFx0XHRjdXJyZW50VGltZSArPSBlbGFwc2VkVGltZTtcblx0XHRcdFx0aWYoY3VycmVudFRpbWUgPiBjdXJyZW50U2VnbWVudEVuZCkge1xuXHRcdFx0XHRcdF9sb29wQ291bnQgKz0gMTtcblx0XHRcdFx0XHRpZihxdWV1ZWRTZWdtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHBsYXlRdWV1ZWRTZWdtZW50KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmKCFfbG9vcCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBjdXJyZW50U2VnbWVudEVuZDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0LypjdXJyZW50VGltZSAtPSBNYXRoLmZsb29yKGN1cnJlbnRUaW1lIC8gKGN1cnJlbnRTZWdtZW50RW5kIC0gY3VycmVudFNlZ21lbnRJbml0KSkgKiAoY3VycmVudFNlZ21lbnRFbmQgLSBjdXJyZW50U2VnbWVudEluaXQpO1xuXHRcdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBjdXJyZW50U2VnbWVudEluaXQgKyBjdXJyZW50VGltZTsqL1xuXHRcdFx0XHRcdFx0Y3VycmVudFRpbWUgPSBjdXJyZW50VGltZSAlIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRTZWdtZW50SW5pdCk7XG5cdFx0XHRcdFx0XHQvL2N1cnJlbnRUaW1lID0gY3VycmVudFNlZ21lbnRJbml0ICsgKGN1cnJlbnRUaW1lKTtcblx0XHRcdFx0XHRcdC8vY3VycmVudFRpbWUgPSBjdXJyZW50U2VnbWVudEluaXQgKyAoY3VycmVudFRpbWUgLSBjdXJyZW50U2VnbWVudEVuZCk7XG5cdFx0XHRcdFx0XHQgLy9jb25zb2xlLmxvZygnQ1Q6ICcsIGN1cnJlbnRUaW1lKSBcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRUaW1lIC09IGVsYXBzZWRUaW1lO1xuXHRcdFx0XHRpZihjdXJyZW50VGltZSA8IGN1cnJlbnRTZWdtZW50RW5kKSB7XG5cdFx0XHRcdFx0X2xvb3BDb3VudCArPSAxO1xuXHRcdFx0XHRcdGlmKHF1ZXVlZFNlZ21lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0cGxheVF1ZXVlZFNlZ21lbnQoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYoIV9sb29wKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50RW5kO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50VGltZSA9IGN1cnJlbnRTZWdtZW50SW5pdCAtIChjdXJyZW50U2VnbWVudEVuZCAtIGN1cnJlbnRUaW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKF9pc0RlYnVnZ2luZykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhjdXJyZW50VGltZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoaW5zdGFuY2Uub25FbnRlckZyYW1lICYmIGVudGVyRnJhbWVFdmVudC50aW1lICE9PSBjdXJyZW50VGltZSkge1xuXHRcdFx0ZW50ZXJGcmFtZUV2ZW50LnRpbWUgPSBjdXJyZW50VGltZTtcblx0XHRcdGluc3RhbmNlLm9uRW50ZXJGcmFtZShlbnRlckZyYW1lRXZlbnQpO1xuXHRcdH1cblx0XHRyZXR1cm4gY3VycmVudFRpbWU7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRDYWxsYmFjaygpIHtcblx0XHRpZighX2lzQ2FsbGJhY2tBZGRlZCkge1xuXHRcdFx0X2lzQ2FsbGJhY2tBZGRlZCA9IHRydWU7XG5cdFx0XHRfZGVzdHJveUZ1bmN0aW9uID0gaW5zdGFuY2Uuc2V0VmFsdWUoX3NlZ21lbnRQbGF5ZXIsIF9pc0RlYnVnZ2luZylcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBwbGF5VG8oZW5kLCBjbGVhcikge1xuXHRcdF9wYXVzZWQgPSBmYWxzZTtcblx0XHRpZihjbGVhcikge1xuXHRcdFx0Y2xlYXJRdWV1ZSgpO1xuXHRcdH1cblx0XHRhZGRDYWxsYmFjaygpO1xuXHRcdGN1cnJlbnRTZWdtZW50RW5kID0gZW5kO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q3VycmVudFRpbWUoKSB7XG5cdFx0aWYoX2lzQ2FsbGJhY2tBZGRlZCkge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRUaW1lO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydHkudiAvIHByb3BlcnR5Lm11bHQ7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0TG9vcChmbGFnKSB7XG5cdFx0X2xvb3AgPSBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U3BlZWQodmFsdWUpIHtcblx0XHRfc3BlZWQgPSB2YWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldERlYnVnZ2luZyhmbGFnKSB7XG5cdFx0X2lzRGVidWdnaW5nID0gZmxhZztcblx0fVxuXG5cdGZ1bmN0aW9uIHBhdXNlKCkge1xuXHRcdF9wYXVzZWQgPSB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRpZihfZGVzdHJveUZ1bmN0aW9uKSB7XG5cdFx0XHRfZGVzdHJveUZ1bmN0aW9uKCk7XG5cdFx0XHRzdGF0ZS5wcm9wZXJ0eSA9IG51bGw7XG5cdFx0XHRzdGF0ZS5wYXJlbnQgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHRcdHBsYXlTZWdtZW50OiBwbGF5U2VnbWVudCxcblx0XHRwbGF5VG86IHBsYXlUbyxcblx0XHRxdWV1ZVNlZ21lbnQ6IHF1ZXVlU2VnbWVudCxcblx0XHRjbGVhclF1ZXVlOiBjbGVhclF1ZXVlLFxuXHRcdHNldExvb3A6IHNldExvb3AsXG5cdFx0c2V0U3BlZWQ6IHNldFNwZWVkLFxuXHRcdHBhdXNlOiBwYXVzZSxcblx0XHRzZXREZWJ1Z2dpbmc6IHNldERlYnVnZ2luZyxcblx0XHRnZXRDdXJyZW50VGltZTogZ2V0Q3VycmVudFRpbWUsXG5cdFx0b25FbnRlckZyYW1lOiBudWxsLFxuXHRcdGRlc3Ryb3k6IGRlc3Ryb3lcblx0fVxuXG5cdHZhciBpbnN0YW5jZSA9IHt9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIFZhbHVlUHJvcGVydHkoc3RhdGUpLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVSZW1hcDsiLCJ2YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xuXG5mdW5jdGlvbiBFZmZlY3RFbGVtZW50KGVmZmVjdCwgcGFyZW50KSB7XG5cblx0cmV0dXJuIFByb3BlcnR5KGVmZmVjdC5wLCBwYXJlbnQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVmZmVjdEVsZW1lbnQ7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XG52YXIgRWZmZWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vRWZmZWN0RWxlbWVudCcpO1xuXG5mdW5jdGlvbiBFZmZlY3RzKGVmZmVjdHMsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBidWlsZFByb3BlcnRpZXMoKVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0VmFsdWUoZWZmZWN0RGF0YSwgaW5kZXgpIHtcblx0XHR2YXIgbm0gPSBlZmZlY3REYXRhLmRhdGEgPyBlZmZlY3REYXRhLmRhdGEubm0gOiBpbmRleC50b1N0cmluZygpO1xuXHRcdHZhciBlZmZlY3RFbGVtZW50ID0gZWZmZWN0RGF0YS5kYXRhID8gRWZmZWN0cyhlZmZlY3REYXRhLmVmZmVjdEVsZW1lbnRzLCBwYXJlbnQpIDogUHJvcGVydHkoZWZmZWN0RGF0YS5wLCBwYXJlbnQpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRuYW1lOiBubSxcblx0XHRcdHZhbHVlOiBlZmZlY3RFbGVtZW50XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gYnVpbGRQcm9wZXJ0aWVzKCkge1xuXHRcdHZhciBpLCBsZW4gPSBlZmZlY3RzLmxlbmd0aDtcblx0XHR2YXIgYXJyID0gW107XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG5cdFx0XHRhcnIucHVzaChnZXRWYWx1ZShlZmZlY3RzW2ldLCBpKSk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnI7XG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWZmZWN0czsiLCJ2YXIgTGF5ZXJCYXNlID0gcmVxdWlyZSgnLi4vTGF5ZXJCYXNlJyk7XG5cbmZ1bmN0aW9uIEltYWdlKGVsZW1lbnQpIHtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdF1cblx0fVxuXHRcblx0dmFyIG1ldGhvZHMgPSB7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2U7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xuXG5mdW5jdGlvbiBOdWxsRWxlbWVudChlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdF1cblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE51bGxFbGVtZW50OyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcbnZhciBTaGFwZUNvbnRlbnRzID0gcmVxdWlyZSgnLi9TaGFwZUNvbnRlbnRzJyk7XG5cbmZ1bmN0aW9uIFNoYXBlKGVsZW1lbnQsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwcm9wZXJ0aWVzOiBbXSxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRlbGVtZW50OiBlbGVtZW50XG5cdH1cblx0dmFyIHNoYXBlQ29udGVudHMgPSBTaGFwZUNvbnRlbnRzKGVsZW1lbnQuZGF0YS5zaGFwZXMsIGVsZW1lbnQuaXRlbXNEYXRhLCBzdGF0ZSk7XG5cblx0XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0c3RhdGUucHJvcGVydGllcy5wdXNoKFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQ29udGVudHMnLFxuXHRcdFx0XHR2YWx1ZTogc2hhcGVDb250ZW50c1xuXHRcdFx0fVxuXHRcdClcblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0X2J1aWxkUHJvcGVydHlNYXAoKTtcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XG52YXIgU2hhcGVSZWN0YW5nbGUgPSByZXF1aXJlKCcuL1NoYXBlUmVjdGFuZ2xlJyk7XG52YXIgU2hhcGVGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUZpbGwnKTtcbnZhciBTaGFwZVN0cm9rZSA9IHJlcXVpcmUoJy4vU2hhcGVTdHJva2UnKTtcbnZhciBTaGFwZUVsbGlwc2UgPSByZXF1aXJlKCcuL1NoYXBlRWxsaXBzZScpO1xudmFyIFNoYXBlR3JhZGllbnRGaWxsID0gcmVxdWlyZSgnLi9TaGFwZUdyYWRpZW50RmlsbCcpO1xudmFyIFNoYXBlR3JhZGllbnRTdHJva2UgPSByZXF1aXJlKCcuL1NoYXBlR3JhZGllbnRTdHJva2UnKTtcbnZhciBTaGFwZVRyaW1QYXRocyA9IHJlcXVpcmUoJy4vU2hhcGVUcmltUGF0aHMnKTtcbnZhciBTaGFwZVJlcGVhdGVyID0gcmVxdWlyZSgnLi9TaGFwZVJlcGVhdGVyJyk7XG52YXIgU2hhcGVQb2x5c3RhciA9IHJlcXVpcmUoJy4vU2hhcGVQb2x5c3RhcicpO1xudmFyIFNoYXBlUm91bmRDb3JuZXJzID0gcmVxdWlyZSgnLi9TaGFwZVJvdW5kQ29ybmVycycpO1xudmFyIFNoYXBlUGF0aCA9IHJlcXVpcmUoJy4vU2hhcGVQYXRoJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xudmFyIE1hdHJpeCA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvdHJhbnNmb3JtYXRpb25NYXRyaXgnKTtcblxuZnVuY3Rpb24gU2hhcGVDb250ZW50cyhzaGFwZXNEYXRhLCBzaGFwZXMsIHBhcmVudCkge1xuXHR2YXIgc3RhdGUgPSB7XG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKSxcblx0XHRwYXJlbnQ6IHBhcmVudFxuXHR9XG5cblx0dmFyIGNhY2hlZFNoYXBlUHJvcGVydGllcyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGJ1aWxkU2hhcGVPYmplY3Qoc2hhcGUsIGluZGV4KSB7XG5cdFx0dmFyIG9iID0ge1xuXHRcdFx0bmFtZTogc2hhcGUubm1cblx0XHR9XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLCAndmFsdWUnLCB7XG5cdFx0ICAgZ2V0KCkge1xuXHRcdCAgIFx0aWYoY2FjaGVkU2hhcGVQcm9wZXJ0aWVzW2luZGV4XSkge1xuXHRcdCAgIFx0XHRyZXR1cm4gY2FjaGVkU2hhcGVQcm9wZXJ0aWVzW2luZGV4XTtcblx0XHQgICBcdH0gZWxzZSB7XG5cdFx0ICAgXHRcdHZhciBwcm9wZXJ0eTtcblx0XHQgICBcdH1cblx0ICAgXHRcdGlmKHNoYXBlLnR5ID09PSAnZ3InKSB7XG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVDb250ZW50cyhzaGFwZXNEYXRhW2luZGV4XS5pdCwgc2hhcGVzW2luZGV4XS5pdCwgc3RhdGUpO1xuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAncmMnKSB7XG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVSZWN0YW5nbGUoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnZWwnKSB7XG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVFbGxpcHNlKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ2ZsJykge1xuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlRmlsbChzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzdCcpIHtcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVN0cm9rZShzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdnZicpIHtcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUdyYWRpZW50RmlsbChzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdncycpIHtcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZUdyYWRpZW50U3Ryb2tlKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3RtJykge1xuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlVHJpbVBhdGhzKHNoYXBlc1tpbmRleF0sIHN0YXRlKTtcblx0ICAgXHRcdH0gZWxzZSBpZihzaGFwZS50eSA9PT0gJ3JwJykge1xuXHQgICBcdFx0XHRwcm9wZXJ0eSA9IFNoYXBlUmVwZWF0ZXIoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAnc3InKSB7XG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gU2hhcGVQb2x5c3RhcihzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdyZCcpIHtcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVJvdW5kQ29ybmVycyhzaGFwZXNbaW5kZXhdLCBzdGF0ZSk7XG5cdCAgIFx0XHR9IGVsc2UgaWYoc2hhcGUudHkgPT09ICdzaCcpIHtcblx0ICAgXHRcdFx0cHJvcGVydHkgPSBTaGFwZVBhdGgoc2hhcGVzW2luZGV4XSwgc3RhdGUpO1xuXHQgICBcdFx0fSBlbHNlIGlmKHNoYXBlLnR5ID09PSAndHInKSB7XG5cdCAgIFx0XHRcdHByb3BlcnR5ID0gVHJhbnNmb3JtKHNoYXBlc1tpbmRleF0udHJhbnNmb3JtLm1Qcm9wcywgc3RhdGUpO1xuXHQgICBcdFx0fSBlbHNlIHtcblx0ICAgXHRcdFx0Y29uc29sZS5sb2coc2hhcGUudHkpO1xuXHQgICBcdFx0fVxuXHQgICBcdFx0Y2FjaGVkU2hhcGVQcm9wZXJ0aWVzW2luZGV4XSA9IHByb3BlcnR5O1xuXHQgICBcdFx0cmV0dXJuIHByb3BlcnR5O1xuXHRcdCAgIH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb2Jcblx0fVxuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHJldHVybiBzaGFwZXNEYXRhLm1hcChmdW5jdGlvbihzaGFwZSwgaW5kZXgpIHtcblx0XHRcdHJldHVybiBidWlsZFNoYXBlT2JqZWN0KHNoYXBlLCBpbmRleClcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCkge1xuXHRcdGlmKHN0YXRlLmhhc1Byb3BlcnR5KCdUcmFuc2Zvcm0nKSkge1xuICAgIFx0XHR2YXIgdG9Xb3JsZE1hdCA9IE1hdHJpeCgpO1xuICAgICAgICBcdHZhciB0cmFuc2Zvcm1NYXQgPSBzdGF0ZS5nZXRQcm9wZXJ0eSgnVHJhbnNmb3JtJykuZ2V0VGFyZ2V0VHJhbnNmb3JtKCk7XG5cdFx0XHR0cmFuc2Zvcm1NYXQuYXBwbHlUb01hdHJpeCh0b1dvcmxkTWF0KTtcbiAgICAgICAgXHRwb2ludCA9IHRvV29ybGRNYXQuYXBwbHlUb1BvaW50QXJyYXkocG9pbnRbMF0scG9pbnRbMV0scG9pbnRbMl18fDApO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RhdGUucGFyZW50LmZyb21LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b0tleXBhdGhMYXllclBvaW50KHBvaW50KSB7XG5cdFx0cG9pbnQgPSBzdGF0ZS5wYXJlbnQudG9LZXlwYXRoTGF5ZXJQb2ludChwb2ludCk7XG5cdFx0aWYoc3RhdGUuaGFzUHJvcGVydHkoJ1RyYW5zZm9ybScpKSB7XG4gICAgXHRcdHZhciB0b1dvcmxkTWF0ID0gTWF0cml4KCk7XG4gICAgICAgIFx0dmFyIHRyYW5zZm9ybU1hdCA9IHN0YXRlLmdldFByb3BlcnR5KCdUcmFuc2Zvcm0nKS5nZXRUYXJnZXRUcmFuc2Zvcm0oKTtcblx0XHRcdHRyYW5zZm9ybU1hdC5hcHBseVRvTWF0cml4KHRvV29ybGRNYXQpO1xuICAgICAgICBcdHBvaW50ID0gdG9Xb3JsZE1hdC5pbnZlcnNlUG9pbnQocG9pbnQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcG9pbnQ7XG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0XHRmcm9tS2V5cGF0aExheWVyUG9pbnQ6IGZyb21LZXlwYXRoTGF5ZXJQb2ludCxcblx0XHR0b0tleXBhdGhMYXllclBvaW50OiB0b0tleXBhdGhMYXllclBvaW50XG5cdH1cblxuXHQvL3N0YXRlLnByb3BlcnRpZXMgPSBfYnVpbGRQcm9wZXJ0eU1hcCgpO1xuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlLCBLZXlQYXRoTm9kZShzdGF0ZSksIG1ldGhvZHMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVDb250ZW50czsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVFbGxpcHNlKGVsZW1lbnQsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2l6ZScsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnMsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnAsIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVFbGxpcHNlOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xuXG5mdW5jdGlvbiBTaGFwZUZpbGwoZWxlbWVudCwgcGFyZW50KSB7XG5cblx0dmFyIHN0YXRlID0ge1xuXHRcdHBhcmVudDogcGFyZW50LFxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcblx0fVxuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdDb2xvcicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmMsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5Jyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVGaWxsOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xuXG5mdW5jdGlvbiBTaGFwZUdyYWRpZW50RmlsbChlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0cGFyZW50OiBwYXJlbnQsXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1N0YXJ0IFBvaW50Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnMsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQubywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBMZW5ndGgnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmcucHJvcCwgcGFyZW50KVxuXHRcdFx0fVxuXHRcdF1cblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZUdyYWRpZW50RmlsbDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVHcmFkaWVudFN0cm9rZShlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0cGFyZW50OiBwYXJlbnQsXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1N0YXJ0IFBvaW50Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQucywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0VuZCBQb2ludCcsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmUsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQubywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0hpZ2hsaWdodCBMZW5ndGgnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5oLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSGlnaGxpZ2h0IEFuZ2xlJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0NvbG9ycycsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LmcucHJvcCwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1N0cm9rZSBXaWR0aCcsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LncsIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVHcmFkaWVudFN0cm9rZTsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVQYXRoKGVsZW1lbnQsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBzZXRQYXRoKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoZWxlbWVudC5zaCkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ3BhdGgnLFxuXHRcdFx0XHR2YWx1ZTpQcm9wZXJ0eShlbGVtZW50LnNoLCBwYXJlbnQpXG5cdFx0XHR9XG5cdFx0XVxuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlUGF0aDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVQb2x5c3RhcihlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0cGFyZW50OiBwYXJlbnQsXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1BvaW50cycsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnB0LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnUG9zaXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5wLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnUm90YXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5yLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnSW5uZXIgUmFkaXVzJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2guaXIsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPdXRlciBSYWRpdXMnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zaC5vciwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ0lubmVyIFJvdW5kbmVzcycsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLmlzLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnT3V0ZXIgUm91bmRuZXNzJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gub3MsIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVQb2x5c3RhcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVSZWN0YW5nbGUoZWxlbWVudCwgcGFyZW50KSB7XG5cblx0dmFyIHN0YXRlID0ge1xuXHRcdHBhcmVudDogcGFyZW50LFxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcblx0fVxuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdTaXplJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gucywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1Bvc2l0aW9uJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuc2gucCwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1JvdW5kbmVzcycsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50LnNoLnIsIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZWN0YW5nbGU7IiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtL1RyYW5zZm9ybScpO1xuXG5mdW5jdGlvbiBTaGFwZVJlcGVhdGVyKGVsZW1lbnQsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQ29waWVzJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuYywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdUcmFuc2Zvcm0nLFxuXHRcdFx0XHR2YWx1ZTogVHJhbnNmb3JtKGVsZW1lbnQudHIsIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVSZXBlYXRlcjsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVSb3VuZENvcm5lcnMoZWxlbWVudCwgcGFyZW50KSB7XG5cblx0dmFyIHN0YXRlID0ge1xuXHRcdHBhcmVudDogcGFyZW50LFxuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcblx0fVxuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdSYWRpdXMnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5yZCwgcGFyZW50KVxuXHRcdFx0fVxuXHRcdF1cblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24obWV0aG9kcywgS2V5UGF0aE5vZGUoc3RhdGUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZVJvdW5kQ29ybmVyczsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gU2hhcGVTdHJva2UoZWxlbWVudCwgcGFyZW50KSB7XG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnQ29sb3InLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5jLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU3Ryb2tlIFdpZHRoJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQudywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09wYWNpdHknLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5vLCBwYXJlbnQpXG5cdFx0XHR9XG5cdFx0XVxuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlU3Ryb2tlIiwidmFyIEtleVBhdGhOb2RlID0gcmVxdWlyZSgnLi4vLi4va2V5X3BhdGgvS2V5UGF0aE5vZGUnKTtcbnZhciBQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uLy4uL3Byb3BlcnR5L1Byb3BlcnR5Jyk7XG5cbmZ1bmN0aW9uIFNoYXBlVHJpbVBhdGhzKGVsZW1lbnQsIHBhcmVudCkge1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU3RhcnQnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkoZWxlbWVudC5zLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnRW5kJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KGVsZW1lbnQuZSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ09mZnNldCcsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShlbGVtZW50Lm8sIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGVUcmltUGF0aHM7IiwidmFyIExheWVyQmFzZSA9IHJlcXVpcmUoJy4uL0xheWVyQmFzZScpO1xuXG5mdW5jdGlvbiBTb2xpZChlbGVtZW50LCBwYXJlbnQpIHtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBfYnVpbGRQcm9wZXJ0eU1hcCgpIHtcblx0XHRyZXR1cm4gW1xuXHRcdF1cblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIExheWVyQmFzZShzdGF0ZSksIG1ldGhvZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvbGlkOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xudmFyIFRleHRBbmltYXRvciA9IHJlcXVpcmUoJy4vVGV4dEFuaW1hdG9yJyk7XG5cbmZ1bmN0aW9uIFRleHQoZWxlbWVudCwgcGFyZW50KSB7XG5cblx0dmFyIGluc3RhbmNlID0ge31cblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRwYXJlbnQ6IHBhcmVudCxcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBzZXREb2N1bWVudERhdGEoX2Z1bmN0aW9uKSB7XG5cdFx0dmFyIHByZXZpb3VzVmFsdWU7XG5cdFx0dmFyIHRleHREb2N1bWVudFVwZGF0ZXIgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHR2YXIgbmV3VmFsdWUgPSBfZnVuY3Rpb24oZWxlbWVudC50ZXh0UHJvcGVydHkuY3VycmVudERhdGEpO1xuXHRcdFx0aWYgKHByZXZpb3VzVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG5cdFx0XHRcdHByZXZpb3VzVmFsdWUgPSBuZXdWYWx1ZTtcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIG5ld1ZhbHVlLCB7X19jb21wbGV0ZTogZmFsc2V9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBkYXRhXG5cdFx0fVxuXHRcdGVsZW1lbnQudGV4dFByb3BlcnR5LmFkZEVmZmVjdCh0ZXh0RG9jdW1lbnRVcGRhdGVyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZEFuaW1hdG9ycygpIHtcblx0XHR2YXIgYW5pbWF0b3JQcm9wZXJ0aWVzID0gW107XG5cdFx0dmFyIGFuaW1hdG9ycyA9IGVsZW1lbnQudGV4dEFuaW1hdG9yLl9hbmltYXRvcnNEYXRhO1xuXHRcdHZhciBpLCBsZW4gPSBhbmltYXRvcnMubGVuZ3RoO1xuXHRcdHZhciB0ZXh0QW5pbWF0b3I7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG5cdFx0XHR0ZXh0QW5pbWF0b3IgPSBUZXh0QW5pbWF0b3IoYW5pbWF0b3JzW2ldKVxuXHRcdFx0YW5pbWF0b3JQcm9wZXJ0aWVzLnB1c2goe1xuXHRcdFx0XHRuYW1lOiBlbGVtZW50LnRleHRBbmltYXRvci5fdGV4dERhdGEuYVtpXS5ubSB8fCAnQW5pbWF0b3IgJyArIChpKzEpLCAvL0ZhbGxiYWNrIGZvciBvbGQgYW5pbWF0aW9uc1xuXHRcdFx0XHR2YWx1ZTogdGV4dEFuaW1hdG9yXG5cdFx0XHR9KVxuXHRcdH1cblx0XHRyZXR1cm4gYW5pbWF0b3JQcm9wZXJ0aWVzO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonU291cmNlJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RG9jdW1lbnREYXRhXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdLmNvbmNhdChhZGRBbmltYXRvcnMoKSlcblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0OyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uLy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XG52YXIgUHJvcGVydHkgPSByZXF1aXJlKCcuLi8uLi9wcm9wZXJ0eS9Qcm9wZXJ0eScpO1xuXG5mdW5jdGlvbiBUZXh0QW5pbWF0b3IoYW5pbWF0b3IpIHtcblxuXHR2YXIgaW5zdGFuY2UgPSB7fVxuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwcm9wZXJ0aWVzOiBfYnVpbGRQcm9wZXJ0eU1hcCgpXG5cdH1cblxuXHRmdW5jdGlvbiBzZXRBbmNob3JQb2ludCh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuYSkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0RmlsbEJyaWdodG5lc3ModmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZiKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGaWxsQ29sb3IodmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZjKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGaWxsSHVlKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5maCkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0RmlsbFNhdHVyYXRpb24odmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLmZzKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRGaWxsT3BhY2l0eSh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuZm8pLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldE9wYWNpdHkodmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLm8pLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFBvc2l0aW9uKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5wKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRSb3RhdGlvbih2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEucikuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Um90YXRpb25YKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeCkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0Um90YXRpb25ZKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5yeSkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U2NhbGUodmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnMpLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFNrZXdBeGlzKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zYSkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQ29sb3IodmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNjKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRTa2V3KHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zaykuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U3Ryb2tlT3BhY2l0eSh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc28pLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVdpZHRoKHZhbHVlKSB7XG5cdFx0UHJvcGVydHkoYW5pbWF0b3IuYS5zdykuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U3Ryb2tlQnJpZ2h0bmVzcyh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2IpLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFN0cm9rZUh1ZSh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEuc2gpLnNldFZhbHVlKHZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFN0cm9rZVNhdHVyYXRpb24odmFsdWUpIHtcblx0XHRQcm9wZXJ0eShhbmltYXRvci5hLnNzKS5zZXRWYWx1ZSh2YWx1ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRUcmFja2luZ0Ftb3VudCh2YWx1ZSkge1xuXHRcdFByb3BlcnR5KGFuaW1hdG9yLmEudCkuc2V0VmFsdWUodmFsdWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonQW5jaG9yIFBvaW50Jyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0QW5jaG9yUG9pbnRcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonRmlsbCBCcmlnaHRuZXNzJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbEJyaWdodG5lc3Ncblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonRmlsbCBDb2xvcicsXG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxDb2xvclxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidGaWxsIEh1ZScsXG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldEZpbGxIdWVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonRmlsbCBTYXR1cmF0aW9uJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbFNhdHVyYXRpb25cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonRmlsbCBPcGFjaXR5Jyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0RmlsbE9wYWNpdHlcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonT3BhY2l0eScsXG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldE9wYWNpdHlcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonUG9zaXRpb24nLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRQb3NpdGlvblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidSb3RhdGlvbiBYJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0Um90YXRpb25YXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6J1JvdGF0aW9uIFknLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRSb3RhdGlvbllcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonU2NhbGUnLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTY2FsZVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTa2V3IEF4aXMnLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTa2V3QXhpc1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTdHJva2UgQ29sb3InLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VDb2xvclxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTa2V3Jyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U2tld1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTdHJva2UgV2lkdGgnLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VXaWR0aFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidUcmFja2luZyBBbW91bnQnLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRUcmFja2luZ0Ftb3VudFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTdHJva2UgT3BhY2l0eScsXG5cdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0c2V0VmFsdWU6IHNldFN0cm9rZU9wYWNpdHlcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTonU3Ryb2tlIEJyaWdodG5lc3MnLFxuXHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdHNldFZhbHVlOiBzZXRTdHJva2VCcmlnaHRuZXNzXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6J1N0cm9rZSBTYXR1cmF0aW9uJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlU2F0dXJhdGlvblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOidTdHJva2UgSHVlJyxcblx0XHRcdFx0dmFsdWU6IHtcblx0XHRcdFx0XHRzZXRWYWx1ZTogc2V0U3Ryb2tlSHVlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRcblx0XHRdXG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBtZXRob2RzLCBLZXlQYXRoTm9kZShzdGF0ZSkpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dEFuaW1hdG9yOyIsInZhciBMYXllckJhc2UgPSByZXF1aXJlKCcuLi9MYXllckJhc2UnKTtcbnZhciBUZXh0ID0gcmVxdWlyZSgnLi9UZXh0Jyk7XG5cbmZ1bmN0aW9uIFRleHRFbGVtZW50KGVsZW1lbnQpIHtcblxuXHR2YXIgaW5zdGFuY2UgPSB7fTtcblxuXHR2YXIgVGV4dFByb3BlcnR5ID0gVGV4dChlbGVtZW50KTtcblx0dmFyIHN0YXRlID0ge1xuXHRcdGVsZW1lbnQ6IGVsZW1lbnQsXG5cdFx0cHJvcGVydGllczogX2J1aWxkUHJvcGVydHlNYXAoKVxuXHR9XG5cblx0ZnVuY3Rpb24gX2J1aWxkUHJvcGVydHlNYXAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ3RleHQnLFxuXHRcdFx0XHR2YWx1ZTogVGV4dFByb3BlcnR5XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnVGV4dCcsXG5cdFx0XHRcdHZhbHVlOiBUZXh0UHJvcGVydHlcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHRmdW5jdGlvbiBnZXRUZXh0KCkge1xuXHRcdHJldHVybiBlbGVtZW50LnRleHRQcm9wZXJ0eS5jdXJyZW50RGF0YS50O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0VGV4dCh2YWx1ZSwgaW5kZXgpIHtcblx0XHRzZXREb2N1bWVudERhdGEoe3Q6IHZhbHVlfSwgaW5kZXgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0RG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KSB7XG5cdFx0cmV0dXJuIGVsZW1lbnQudXBkYXRlRG9jdW1lbnREYXRhKGRhdGEsIGluZGV4KTtcblx0fVxuXHRcblx0ZnVuY3Rpb24gY2FuUmVzaXplRm9udChfY2FuUmVzaXplKSB7XG5cdFx0cmV0dXJuIGVsZW1lbnQuY2FuUmVzaXplRm9udChfY2FuUmVzaXplKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldE1pbmltdW1Gb250U2l6ZShfZm9udFNpemUpIHtcblx0XHRyZXR1cm4gZWxlbWVudC5zZXRNaW5pbXVtRm9udFNpemUoX2ZvbnRTaXplKTtcblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHRcdGdldFRleHQ6IGdldFRleHQsXG5cdFx0c2V0VGV4dDogc2V0VGV4dCxcblx0XHRjYW5SZXNpemVGb250OiBjYW5SZXNpemVGb250LFxuXHRcdHNldERvY3VtZW50RGF0YTogc2V0RG9jdW1lbnREYXRhLFxuXHRcdHNldE1pbmltdW1Gb250U2l6ZTogc2V0TWluaW11bUZvbnRTaXplXG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgTGF5ZXJCYXNlKHN0YXRlKSwgbWV0aG9kcyk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RWxlbWVudDsiLCJ2YXIgS2V5UGF0aE5vZGUgPSByZXF1aXJlKCcuLi8uLi9rZXlfcGF0aC9LZXlQYXRoTm9kZScpO1xudmFyIFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vLi4vcHJvcGVydHkvUHJvcGVydHknKTtcblxuZnVuY3Rpb24gVHJhbnNmb3JtKHByb3BzLCBwYXJlbnQpIHtcblx0dmFyIHN0YXRlID0ge1xuXHRcdHByb3BlcnRpZXM6IF9idWlsZFByb3BlcnR5TWFwKClcblx0fVxuXG5cdGZ1bmN0aW9uIF9idWlsZFByb3BlcnR5TWFwKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdBbmNob3IgUG9pbnQnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMuYSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1BvaW50IG9mIEludGVyZXN0Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLmEsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdQb3NpdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5wLCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnU2NhbGUnLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucywgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1JvdGF0aW9uJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnIsIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdYIFBvc2l0aW9uJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnB4LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWSBQb3NpdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5weSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1ogUG9zaXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucHosIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdYIFJvdGF0aW9uJyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLnJ4LCBwYXJlbnQpXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnWSBSb3RhdGlvbicsXG5cdFx0XHRcdHZhbHVlOiBQcm9wZXJ0eShwcm9wcy5yeSwgcGFyZW50KVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZTogJ1ogUm90YXRpb24nLFxuXHRcdFx0XHR2YWx1ZTogUHJvcGVydHkocHJvcHMucnosIHBhcmVudClcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICdPcGFjaXR5Jyxcblx0XHRcdFx0dmFsdWU6IFByb3BlcnR5KHByb3BzLm8sIHBhcmVudClcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXHRmdW5jdGlvbiBnZXRUYXJnZXRUcmFuc2Zvcm0oKSB7XG5cdFx0cmV0dXJuIHByb3BzO1xuXHR9XG5cblx0dmFyIG1ldGhvZHMgPSB7XG5cdFx0Z2V0VGFyZ2V0VHJhbnNmb3JtOiBnZXRUYXJnZXRUcmFuc2Zvcm1cblx0fVxuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKG1ldGhvZHMsIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtOyIsInZhciBLZXlQYXRoTm9kZSA9IHJlcXVpcmUoJy4uL2tleV9wYXRoL0tleVBhdGhOb2RlJyk7XG52YXIgVmFsdWVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vVmFsdWVQcm9wZXJ0eScpO1xuXG5mdW5jdGlvbiBQcm9wZXJ0eShwcm9wZXJ0eSwgcGFyZW50KSB7XG5cdHZhciBzdGF0ZSA9IHtcblx0XHRwcm9wZXJ0eTogcHJvcGVydHksXG5cdFx0cGFyZW50OiBwYXJlbnRcblx0fVxuXG5cdGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdFx0c3RhdGUucHJvcGVydHkgPSBudWxsO1xuXHRcdHN0YXRlLnBhcmVudCA9IG51bGw7XG5cdH1cblxuXHR2YXIgbWV0aG9kcyA9IHtcblx0XHRkZXN0cm95OiBkZXN0cm95XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbWV0aG9kcywgVmFsdWVQcm9wZXJ0eShzdGF0ZSksIEtleVBhdGhOb2RlKHN0YXRlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHk7IiwiZnVuY3Rpb24gVmFsdWVQcm9wZXJ0eShzdGF0ZSkge1xuXHRcblx0ZnVuY3Rpb24gc2V0VmFsdWUodmFsdWUpIHtcblx0XHR2YXIgcHJvcGVydHkgPSBzdGF0ZS5wcm9wZXJ0eTtcblx0XHRpZighcHJvcGVydHkgfHwgIXByb3BlcnR5LmFkZEVmZmVjdCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydHkuYWRkRWZmZWN0KHZhbHVlKTtcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAnbXVsdGlkaW1lbnNpb25hbCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcblx0XHRcdHJldHVybiBwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcblx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnByb3BUeXBlID09PSAndW5pZGltZW5zaW9uYWwnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBwcm9wZXJ0eS5hZGRFZmZlY3QoZnVuY3Rpb24oKXtyZXR1cm4gdmFsdWV9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcblx0XHRyZXR1cm4gc3RhdGUucHJvcGVydHkudjtcblx0fVxuXG5cdHZhciBtZXRob2RzID0ge1xuXHRcdHNldFZhbHVlOiBzZXRWYWx1ZSxcblx0XHRnZXRWYWx1ZTogZ2V0VmFsdWVcblx0fVxuXG5cdHJldHVybiBtZXRob2RzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZhbHVlUHJvcGVydHk7IiwidmFyIExheWVyTGlzdCA9IHJlcXVpcmUoJy4uL2xheWVyL0xheWVyTGlzdCcpO1xudmFyIEtleVBhdGhMaXN0ID0gcmVxdWlyZSgnLi4va2V5X3BhdGgvS2V5UGF0aExpc3QnKTtcblxuZnVuY3Rpb24gUmVuZGVyZXIoc3RhdGUpIHtcblxuXHRzdGF0ZS5fdHlwZSA9ICdyZW5kZXJlcic7XG5cblx0ZnVuY3Rpb24gZ2V0UmVuZGVyZXJUeXBlKCkge1xuXHRcdHJldHVybiBzdGF0ZS5hbmltYXRpb24uYW5pbVR5cGU7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7XG5cdFx0Z2V0UmVuZGVyZXJUeXBlOiBnZXRSZW5kZXJlclR5cGVcblx0fSwgTGF5ZXJMaXN0KHN0YXRlLmVsZW1lbnRzKSwgS2V5UGF0aExpc3Qoc3RhdGUuZWxlbWVudHMsICdyZW5kZXJlcicpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjsiXX0=
