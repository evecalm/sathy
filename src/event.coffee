if window.addEventListener
  Sathy::on = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.addEventListener type, handle, capture
      return
  Sathy::off = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.removeEventListener type, handle, capture
      return
  Sathy::one = (type, handle, capture)->
    type += ''
    capture = !!capture
    @each (elm)->
      elm.addEventListener type,(e)->
        handle.call elm, e
        elm.removeEventListener type, arguments.callee
        return
      , capture
else if window.attachEvent
  Sathy::on = (type,handle)->
    type = 'on' + type
    @each (elm)->
      elm.attachEvent type, handle
  Sathy::off = (type,handle)->
    type = 'on' + type
    @each (elm)->
      elm.detachEvent type, handle
  Sathy::one = (type, handle)->
    type = 'on' + type
    @each (elm)->
      elm.attachEvent type, (e)->
        handle.call elm, e
        elm.detachEvent type, arguments.callee
else
  Sathy::on = (type,handle)->
    type = 'on' + type
    @each (elm)->
      elm[ type ] = handle
  Sathy::off = (type)->
    type = 'on' + type
    @each (elm)->
      elm[ type ] = null
  Sathy::one = (type, handle)->
    type = 'on' + type
    @each (elm)->
      elm[ type ] = (e)->
        handle.call elm, e
        elm[ type ] = null
