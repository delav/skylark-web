

export function addSvgHover(idPrefix, tId, nodeIcon, callback) {
  const iconId = idPrefix + tId
  const btn = $('#' + iconId)
  if (btn.length > 0) return
  const obj = $('#' + tId + '_span')
  obj.after(nodeIcon)
  if (btn) {
    btn.bind('click', callback)
  }
}

export function formatString(str, data) {
  if (!str || data === undefined) {
    return str
  }

  if (typeof data === 'object') {
    for (const key in data) {
      if (data.prototype.hasOwnProperty.call(data, key)) {
        const reg = new RegExp('{' + key + '}', 'g')
        str = str.replace(reg, data[key])
      }
    }
  } else {
    const args = arguments,
      reg = new RegExp('{([0-' + (args.length - 1) + '])}', 'g')
    return str.replace(reg, function(match, index) {
      return args[index - (-1)]
    })
  }
  return str
}
