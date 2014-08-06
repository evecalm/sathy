if window.addEventListener
  
  Sathy::on = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.addEventListener type, handle, capture
      return
    return this

  Sathy::off = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.removeEventListener type, handle, capture
      return
    return this

  Sathy::one = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.addEventListener type,(e)->
        handle.call elm, e
        elm.removeEventListener type, arguments.callee
        return
      , capture
      return
    return this

else if window.attachEvent
  Sathy::on = (type,handle)->
    type = 'on' + type
    @each (elm)->
      elm.attachEvent type, handle
      return
    return this

  Sathy::off = (type,handle)->
    type = 'on' + type
    @each (elm)->
      elm.detachEvent type, handle
      return
    return this

  Sathy::one = (type, handle)->
    type = 'on' + type
    @each (elm)->
      elm.attachEvent type, (e)->
        handle.call elm, e
        elm.detachEvent type, arguments.callee
        return
      return
    return this
else
  window.alert 'DAMN IT'
