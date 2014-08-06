doc = window.document
arr = []
class Sathy
  constructor: (selector) ->
    if not (this instanceof Sathy)
      return new Sathy selector
    @init selector
  length: 0
  # //make Sathy looks like an array
  splice: arr.splice
  
  push: arr.push

  sort: arr.push

  init: (selector)->
    if selector instanceof Sathy
      return selector
    if selector instanceof HTMLElement
      @push.apply this [selector]
    else
      @push.apply this, arr.slice.call doc.querySelectorAll selector

Sathy.isWindow = (obj)->
  obj? and obj.window and obj is obj.window

###*
 * extend obj
 * @param  {obj} dest   dest to copy
 * @param  {Object} source prop from
 * @return {Object}        result Object
###
Sathy::extend = Sathy.extend = (dest, source)->
  args = [].slice.call arguments
  # 是否覆盖已有属性
  ride = if typeof args[ args.length - 1 ] is 'boolean' then args.pop() else true
  i = 1
  if args.length is 1
    dest = if not Sathy.isWindow(this) then this else {}
    i = 0
  while source = args[i++]
    for k, v of source
      if ride or k not of dest
        dest[ k ] = v
  dest


  
