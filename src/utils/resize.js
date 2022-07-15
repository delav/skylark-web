export function dragWController(leftId, rightId, resizeId) {

  const left = document.getElementById(leftId)
  const right = document.getElementById(rightId)
  const resizeW = document.getElementById(resizeId)

  // 鼠标按下事件
  resizeW.onmousedown = function (e) {
    const boxWidth = left.offsetWidth + right.offsetWidth
    // 颜色改变提醒
    resizeW.style.background = '#818181'
    const startX = e.clientX
    // 鼠标拖动事件
    document.onmousemove = function (e) {
      resizeW.left = startX
      const endX = e.clientX
      // （endX-startX）=移动的距离。resize.left+移动的距离=左边区域最后的宽度
      let moveLen = resizeW.left + (endX - startX)
      // 左边区域的最小宽度为
      if (moveLen < 150) moveLen = 150
      // 右边区域最小宽度为
      if (moveLen > boxWidth - 300) moveLen = boxWidth - 300
      // 设置左侧区域的宽度
      resizeW.style.left = moveLen
      left.style.width = (moveLen/document.body.clientWidth)*100 + '%'
      right.style.width = ((boxWidth - moveLen)/document.body.clientWidth)*100 + '%'
    }
    // 鼠标松开事件
    document.onmouseup = function () {
      // 颜色恢复
      resizeW.style.background = '#d6d6d6'
      document.onmousemove = null
      document.onmouseup = null
      // 当不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      resizeW.releaseCapture && resizeW.releaseCapture()
    }
    // 该函数在属于当前线程的指定窗口里设置鼠标捕获
    resizeW.setCapture && resizeW.setCapture()
    return false
  }
}

export function dragHController(topId, bottomId, resizeId) {

  const top = document.getElementById(topId)
  const bottom = document.getElementById(bottomId)
  const resizeH = document.getElementById(resizeId)

  // 鼠标按下事件
  resizeH.onmousedown = function (e) {
    const boxHeight = top.offsetHeight + bottom.offsetHeight
    // 颜色改变提醒
    resizeH.style.background = '#818181'
    const startY = e.clientY
    // 鼠标拖动事件
    document.onmousemove = function (e) {
      resizeH.top = startY
      const endY = e.clientY
      // （endY-startY）=移动的距离。resize.top+移动的距离-导航栏高度=上边区域最后的高度
      let moveLen = resizeH.top + (endY - startY - 83 - 40)
      // 上边区域的最小宽度
      if (moveLen < 100) moveLen = 100
      // 下边区域最小宽度为
      if (moveLen > boxHeight - 50) moveLen = boxHeight - 50
      // 设置上侧区域的宽度
      resizeH.style.top = moveLen
      top.style.height = (moveLen/(boxHeight + resizeH.offsetHeight))*100 + '%'
      bottom.style.height = ((boxHeight - moveLen)/(boxHeight + resizeH.offsetHeight))*100 + '%'
    }
    // 鼠标松开事件
    document.onmouseup = function () {
      // 颜色恢复
      resizeH.style.background = '#d6d6d6'
      document.onmousemove = null
      document.onmouseup = null
      // 当不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      resizeH.releaseCapture && resizeH.releaseCapture()
    }
    // 该函数在属于当前线程的指定窗口里设置鼠标捕获
    resizeH.setCapture && resizeH.setCapture()
    return false
  }
}
