Sathy.extend
  isArray: (val)->
    toString.call(val) is '[object Array]'
  isArrayLike: (val)->
    val and (@isArray(val) or
      ((val.length>>0) is val.length and val.length >= 0 and (val.length-1) of val)
    )

  isFunction: (fn)->
    fn and 'apply' of fn and /\bfunction\b/.test fn

  makeArray: (arr)->
    ret = []
    if Sathy.isArrayLike arr
      for v in arr
        ret.push v
    ret
    
  ###*
   * excute a fn on every element in an array
   * @param  {Array}   arr      array like object
   * @param  {Function} fn      works on array elements
   * @param  {Object}   context fn's excute context
   * @return {undefined}
  ###
  each: (arr, fn, context)->
    if arr and fn
      if @isArrayLike arr
        for v,k in arr
          fn.call context or v, v, k
      else
        for own k, v of arr
          fn.call context or v, v, k
    return

  ###*
   * just like array, but return an array of result
   * @param  {Array}   arr      an array like object
   * @param  {Function} fn      works on array elements
   * @param  {object}   context fn's excute context,
   *                            if ommit, it will be array's element
   * @return {Array}           result
  ###
  map: (arr, fn, context)->
    res = []
    if arr and fn
      if @isArrayLike arr
        for v,k in arr
          res.push fn.call context or v, v, k
      else
        for own k, v of arr
          res.push fn.call context or v, v, k
    return res
  
  ###*
   * generate random string, contains alphabet in lowercase and numbers
   * @param  {Number} len string length, default 16
   * @return {String}     random string
  ###
  randomStr:(len)->
    str = ''
    len = len or 16
    while true
      str += Math.random().toString(32).substr 2
      if str.length >= len then break
    str.substr 0, len

  # remove leading spaces in a string
  ltrim: (str)->
    if str? then (str + '').replace /^\s+/, '' else ''

  # remove trailing spaces in a string
  rtrim: (str)->
    if str? then (str + '').replace /\s+$/, '' else ''

  # remove leading & trailing spaces in a string
  trim: (str)->
    if str? then (str + '').replace /^\s+|\s+$/g, '' else ''

  ###*
   * setup a function step by step
   * @param  {Function} fn            fn to setup
   * @param  {arguments}   storedArgs... partial arguments of fn
   * @return {Funtion}                 partial applied fn
  ###
  curry: (fn,storedArgs...)->
    if not Sathy.isFunction fn then return
    # storedArgs = [].slice.call arguments, 1
    (args...)->
      args = storedArgs.concat args
      fn.apply null, args

  encodeHtml: (html)->
    divElm = doc.createElement 'div'
    divElm.appendChild doc.createTextNode html
    divElm.innerHTML

  decodeHtml: do ->
    if doc.body.textContent?
      (html)->
        divElm = doc.createElement 'div'
        divElm.innerHTML = html
        divElm.textContent
    else
      (html)->
        divElm = doc.createElement 'div'
        divElm.innerHTML = html
        divElm.innerText

Sathy::extend
  each: (fn)->
    Sathy.each this, fn
  map: (fn)->
    Sathy.map this, fn