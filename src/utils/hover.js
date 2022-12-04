

export function addSvgHover(idPrefix, tId, className, title=null, callback) {
  const selector = $('#' + tId + '_a')
  const iconId = idPrefix + tId
  if (document.getElementById(iconId)) return
  let nodeIcon = formatString('<span class="{0}" id="{1}"></span>', className, iconId)
  if (title) {
    nodeIcon = formatString('<span class="{0}" id="{1}" title="{2}"></span>', className, iconId, title)
  }
  selector.append(nodeIcon)
  const iconBtn = document.getElementById(iconId)
  if (iconBtn) {
    iconBtn.addEventListener('click', callback)
  }
}

export function setCursorStyle(idList, cursorStyle) {
  for (let i = 0; i < idList.length; i++) {
    const selector = '#' + idList[i]
    const item = document.querySelector(selector)
    item.style.cursor= cursorStyle
  }
}

function formatString(str, data) {
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


