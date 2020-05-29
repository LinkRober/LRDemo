var global = this
var _require = function(clsName) {
  if (!global[clsName]) {
    global[clsName] = {
      __clsName: clsName
    }
  }
  return global[clsName]
}

//[Person walk]
// UIView.alloc().init()
// UIView.__c('alloc')()

var a = _require('UIView')

console.log(a);

_OC_callC(a)
