do (window)->
  toString = Object.prototype.toString

  sathy = (selector)->

  sathy.prototype.extend = sathy.extend = (config,defaults)->
    if not arguments.length then return this
    obj = {}
    if arguments.length is 1
      obj = this
    if config
      for key, val of config
        obj[key] = val

      if defaults
        for key, val of defaults
          obj[key] = val if obj[key] is undefined
    return obj

  sathy.extend
    isArray: (val)->
      toString.call(val) is '[object Array]'
    isArrayLike: (val)->
      val and (@isArray(val) or (typeof val.length is 'number' and parseInt(val.length, 10) is val.length and val.length >= 0))
    each: (arr, fn, context)->
      if arr and fn
        if @isArrayLike arr
          for v,k in arr
            fn.call context or v, v, k
        else
          for own k, v of arr
            fn.call context or v, v, k
      return
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
      

  window.sathy = sathy
