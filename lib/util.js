/*
 *  util.js
 *
 */

exports.evaluateDynamicData = evaluateDynamicData
exports.generateButtonLabel = generateButtonLabel
exports.flattenCategories = flattenCategories
exports.formatButtons = formatButtons
exports.selectButton = selectButton

function evaluateDynamicData(data, cb) {
  if (typeof data === 'function') {
    data(cb)
  } else {
    cb(null, data)
  }
}

function generateButtonLabel(button, props) {
  var label = button
  if (typeof button !== 'string') {
    props = props || 'name'
    if (typeof props === 'string') {
      label = button[props]
    } else {
      label = props.map(function(prop) { return button[prop] })
      label = label.join(' ─ ')
    }
  }
  return label
}

function formatButtons(buttons, view) {
  var labels = Object.keys(buttons)
  var values = Object.keys(buttons).map(function(key) { return buttons[key] })
  if (view.categories) {
    var categories = view.categories
    var categorized = {}
    for (var v in values) {
      var button = values[v]
      var pointer = categorized
      var prefix = []
      for (var c in categories) {
        var category = categories[c]
        var buttonCategory = button[category]
        if (buttonCategory === undefined) {
          throw new Error(button + ' does not define a \'' + category + '\' category')
        }
        prefix.push(buttonCategory)
        pointer = pointer[buttonCategory] || 
                  (pointer[buttonCategory] = (c < categories.length-1) ? {} : [])
        if (Array.isArray(pointer)) {
          var value = {
            label: generateButtonLabel(button, view.properties),
            value: button,
            prefix: prefix.join('.')
          }
          labels[v] = value.label
          pointer.push(value)
        }
      }
    }
    values = flattenCategories(categorized)
  } else {
    var temp = []
    for (var i in labels) {
      var button = (Array.isArray(buttons)) ? values[i] : labels[i]
      temp.push(generateButtonLabel(button, view.properties))
    }
    labels = temp
  }
  return {
    labels: labels,
    values: values,
    categories: categorized
  }
}

function flattenCategories(object) {
  if (Array.isArray(object)) {
    var array = []
    for (var i in object) {
      var button = object[i]
      array.push(button.value)
    }
    return array
  } else {
    var array = []
    for (var k in object) {
      var temp = flattenCategories(object[k])
      for (var t in temp) {
        array.push(temp[t])
      }
    }
    return array
  }
}

function selectButton(buttons, view, selection) {
  buttons = formatButtons(buttons, view)
  var n = Number(selection)
  if (isNaN(n)) {
    var temp = null
    for (var l in buttons.labels) {
      var label = buttons.labels[l]
      if (label.toLowerCase().indexOf(selection.toLowerCase()) === 0) {
        if (label.length === selection.length) {
          temp = buttons.values[l]
          break
        } else if (temp === null) {
          temp = buttons.values[l]
        }
      }
    }
    selection = temp
  } else if (n > 0 && n <= buttons.values.length) {
    selection = buttons.values[Math.floor(n)-1]
  } else {
    selection = null
  }
  return selection
}
