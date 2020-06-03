var global = this
var _require = function(clsName) {
  if (!global[clsName]) {
    global[clsName] = {
      __clsName: clsName
    }
  }
  return global[clsName]
}

global.require = function() {
	var lastRequire
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].split(',').forEach(function(clsName) {
		//trim()去除字符串 头尾空格
        lastRequire = _require(clsName.trim())
      })
	}
	return lastRequire;
}

Object.defineProperty(Object.prototype, '__c', {value: function(methodName) {
  if (!this.__obj && !this.__clsName) return this[methodName].bind(this);
  var self = this
  return function(){
    var args = Array.prototype.slice.call(arguments)
    return _methodFunc(self.__obj, self.__clsName, methodName, args, self.__isSuper)
  }
}})

global.defineClass = function(declaration,properties,instanceMethods,classMethods) {
	var newInstanceMethods = {}
	var newClassMethods = {}
	if(!(properties instanceof Array)) {
		//如果不是数组类型，说明不是属性，可能是类方法或者实例方法，向前进
		classMethods = instanceMethods
		instanceMethods = properties
		properties = null
	}
	if(properties) {//有属性
		properties.forEach(function(propertyName) {
			if(!instanceMethods[propertyName]) {
				instanceMethods[propertyName] = _propertiesGetFun(propertyName)
			}
			var nameOfSet = "set" + propertyName.substr(0,1).toUpperCase() + propertyName.substr(1);
			if(!instanceMethods[nameOfSet]) {
				instanceMethods[nameOfSet] = _propertiesSetFun(propertyName)
			}
		})
	}
}

//将属性格式化成set方法
var  _propertiesSetFun = function(propertyName) {
	return function(jval) {
		var slf = this;
		if(!slf.__ocProps) {
			var props = _OC_getCustomProps(slf.__obj)
			if(!props) {
				props = {}
				_OC_setCustomProps(slf.__obj,props)
			}
			slf.__ocProps = props
		}
		slf.__ocProps[propertyName] = jval
	}
}

//将属性格式化成get方法
var _propertiesGetFun = function(propertyName) {
	return function(){
		var slf = this;
		if(!slf.__ocProps) {
			var props = _OC_getCustomProps(slf.__obj)
			if(!props) {
				props = {}
				_OC_setCustomProps(slf.__obj,props)
			}
			slf.__ocProps = props
		}
		return slf.__ocProps[propertyName]
	}
}

// var _methodFunc = function(instance, clsName, methodName, args, isSuper, isPerformSelector) {
//     var selectorName = methodName
//     if (!isPerformSelector) {
//       methodName = methodName.replace(/__/g, "-")
//       selectorName = methodName.replace(/_/g, ":").replace(/-/g, "_")
//       var marchArr = selectorName.match(/:/g)
//       var numOfArgs = marchArr ? marchArr.length : 0
//       if (args.length > numOfArgs) {
//         selectorName += ":"
//       }
//     }
//     var ret = instance ? _OC_callI(instance, selectorName, args, isSuper):
//                          _OC_callC(clsName, selectorName, args)
//     return _formatOCToJS(ret)
//   }

//     var _formatOCToJS = function(obj) {
//     if (obj === undefined || obj === null) return false
//     if (typeof obj == "object") {
//       if (obj.__obj) return obj
//       if (obj.__isNil) return false
//     }
//     if (obj instanceof Array) {
//       var ret = []
//       obj.forEach(function(o) {
//         ret.push(_formatOCToJS(o))
//       })
//       return ret
//     }
//     if (obj instanceof Function) {
//         return function() {
//             var args = Array.prototype.slice.call(arguments)
//             var formatedArgs = _OC_formatJSToOC(args)
//             for (var i = 0; i < args.length; i++) {
//                 if (args[i] === null || args[i] === undefined || args[i] === false) {
//                 formatedArgs.splice(i, 1, undefined)
//             } else if (args[i] == nsnull) {
//                 formatedArgs.splice(i, 1, null)
//             }
//         }
//         return _OC_formatOCToJS(obj.apply(obj, formatedArgs))
//       }
//     }
//     if (obj instanceof Object) {
//       var ret = {}
//       for (var key in obj) {
//         ret[key] = _formatOCToJS(obj[key])
//       }
//       return ret
//     }
//     return obj
//   }


//[Person walk]
// UIView.alloc().init()
// UIView.__c('alloc')()

// var a = global.require('UIView')
// a.__c('alloc')

global.defineClass('Person',['name'],{
	walk:function(){
		console.log('walk')
	}
})
