Sathy::extend
  
  html: (html)->
    if not @length
      if html is undefined
        return ''
      else
        return this

    if html is undefined
      return this[0].innerHTML
    else
      html += ''
      @each (elm)->
        elm.innerHTML = html
        return
      return this

  text: do->
    if window.document.documentElement.innerText is undefined
      (text)->
        if not @length
          if text is undefined
            return ''
          else
            return this
        if text is undefined
          return this[0].textContent
        else
          text += ''
          @each (elm)->
            elm.textContent = text
            return
          return this
    else
      (text)->
        if not @length
          if text is undefined
            return ''
          else
            return this
        if text is undefined
          return this[0].innerText
        else
          text += ''
          @each (elm)->
            elm.innerText = text
            return
          return this

  attr: (name,value)->
    if not @length
      if text is undefined
        return ''
      else
        return this
    if name is undefined then return this
    name += ''
    if value is undefined
      first = this[0]
      return if Sathy.isWindow(first) then first[ name ] else first.getAttribute name
    else
      value += ''
      @each (elm)->
        if Sathy.isWindow(elm) then elm[ name ] = value else elm.setAttribute name, value
        return
      return this

  removeAttr: (name)->
    if not @length or name is undefined then return this
    name += ''
    @each (elm)->
      ele.removeAttribute name
      return
    return this


  remove: ->
    if not @length then return this
    @each (elm)->
      ele.parentNode && ele.parentNode.removeChild ele
      return
    return this

  empty: ->
    @each (elm)->
      elm.innerHTML = ''
      return
    return this