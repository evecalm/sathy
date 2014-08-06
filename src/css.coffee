Sathy::extend
  css: (name,value)->
    if not @length then return
    if typeof name is 'string'
      key = name
      name = {}
      name[ key ] = '' + value
    if name instanceof Object
      styleArr = []
      for key, v of name
        styleArr.push key + ':' + v
      
      styleArr = ';' + styleArr.join(';') + ';'
      @each (elm)->
        elm.style.cssText += styleArr
    return this
