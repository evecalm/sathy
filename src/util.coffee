Sathy.extend
  ###*
   * judge a obj's type or get its type name
   * @param  {Object}  obj  obj to judge
   * @param  {String}  type type name, if ommit it, get type name
   * @return {Boolean or String}      result
  ###
  type: (obj, type)->
    if obj?
      t = toString.call obj
      if arguments.length is 1
        t.slice 8, -1
      else
        t.toLowerCase() is "[object #{type}]".toLowerCase()
    else
      t = '' + obj
      if arguments.length > 1
        t.toLowerCase() is ('' + type).toLowerCase()
      else
        t
  # judge an array
  isArray: Array.isArray or (obj)->
    @type obj, 'Array'

  # judge an array like object
  isArrayLike: (val)->
    len = val and val.length
    !!val and ( @isArray(val) or
      ( (len>>0) is len and len >= 0 and (not len or (len-1) of val) )
    )

  # judge an function
  isFunction: (fn)->
    !!fn and 'apply' of fn and /\bfunction\b/.test '' + fn

  # make an array like obj to a real array
  makeArray: (arr)->
    if @isArray arr then return arr
    ret = []
    if @isArrayLike arr
      for v in arr
        ret.push v
    ret
    
  ###*
   * excute a fn on every element in an array
   * @param  {Array}   arr      array like object
   * @param  {Function} fn      works on array elements
   * @param  {Object}   context fn's excute context
   * @return {Array}            return param arr itself
  ###
  each: (arr, fn, context)->
    if arr and fn
      if @isArrayLike arr
        for v,k in arr
          fn.call context or v, v, k
      else
        for own k, v of arr
          fn.call context or v, v, k
    return arr

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

  ###*
   * encode html string(with special chars like '>' '<' '&', etc) to entities
   * @param  {String} htmlStr html string
   * @return {String}         encoded string
  ###
  encodeHtml: (htmlStr)->
    divElm = doc.createElement 'div'
    divElm.appendChild doc.createTextNode htmlStr
    divElm.innerHTML

  ###*
   * decode encoded html string
   * @param  {String} encodedString encoded string
   * @return {String} decoded string
  ###
  decodeHtml: do ->
    if doc.body.textContent?
      (encodedStr)->
        divElm = doc.createElement 'div'
        divElm.innerHTML = encodedStr
        divElm.textContent
    else
      (encodedStr)->
        divElm = doc.createElement 'div'
        divElm.innerHTML = encodedStr
        divElm.innerText


Sathy::extend
  each: (fn)->
    Sathy.each this, fn
  map: (fn)->
    Sathy.map this, fn