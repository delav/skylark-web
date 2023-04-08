import NODE from '@/constans/node'
import { deepCopy } from '@/utils/dcopy'
import { guid } from '@/utils/other'

const baseNode = {
  id: 1, pid: 0, name: 'DEFAULT', desc: null, type: 0,
  open: false, nocheck: false, checked: false, isParent: true, meta: {}
}

function fillNode(data) {
  const node = deepCopy(baseNode)
  Object.assign(node, data)
  if (node.type !== NODE.NodeCategory.TESTCASE) {
    node.nocheck = true
  }
  if (node.desc === NODE.NodeDesc.CASE) {
    node.isParent = false
  }
  return node
}

export function formatBaseNodes(dataObject) {
  const treeNodes = []
  if (!('root' in dataObject) || !('dirs' in dataObject)) {
    return treeNodes
  }
  // project root node not use
  // const rootId = guid()
  // const project = dataObject['root']
  // const rootNode = fillNode(
  //   {
  //     mid: project['id'],
  //     id: rootId,
  //     pid: NODE.RootId,
  //     name: project['name'],
  //     desc: NODE.NodeDesc.ROOT,
  //     type: null
  //   }
  // )
  // treeNodes.push(rootNode)
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerNode(dataObject['dirs'][i], NODE.RootPId, NODE.NodeDesc.DIR)
    treeNodes.push(dirNode)
  }
  return treeNodes.sort(sortBy('type'))
}

export function formatDirNodes(dataObject, parentId, checked=false) {
  const treeNodes = []
  if (!('dirs' in dataObject) || !('suites' in dataObject)) {
    return treeNodes
  }
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerNode(dataObject['dirs'][i], parentId, NODE.NodeDesc.DIR, checked)
    treeNodes.push(dirNode)
  }
  for (let j = 0; j < dataObject['suites'].length; j++) {
    const suiteNode = handlerNode(dataObject['suites'][j], parentId, NODE.NodeDesc.SUITE, checked)
    treeNodes.push(suiteNode)
  }
  return treeNodes
}

export function formatSuiteNodes(dataObject, parentId, checked=false) {
  const treeNodes = []
  if (!('cases' in dataObject)) {
    return treeNodes
  }
  for (let i = 0; i < dataObject['cases'].length; i++) {
    const caseNode = handlerNode(dataObject['cases'][i], parentId, NODE.NodeDesc.CASE, checked)
    treeNodes.push(caseNode)
  }
  return treeNodes
}

export function handlerNode(obj, parentId, nodeDesc, checked=false) {
  return fillNode(
    {
      mid: obj['id'],
      id: guid(),
      pid: parentId,
      name: obj['name'],
      desc: nodeDesc,
      type: obj['category'],
      meta: obj,
      checked: checked
    }
  )
}

export function transformData(data, nodeId=null, entities=[]) {
  const retainField = ['mid', 'id', 'pid', 'name', 'desc', 'type', 'meta']
  let cases = []
  let nodes = []
  let itemMap = {}
  for (let i = 0; i < data.length; i++) {
    let item = getTargetObject(data[i], retainField)
    // selected node case number
    if (item.desc === NODE.NodeDesc.CASE) {
      cases.push(item.mid)
      // add current selected case to run data
      if (nodeId && item.id === nodeId) {
        item.meta['extra_data']['entity'] = entities
      }
    }
    let id = item.id
    let pid = item.pid
    if (!itemMap[id]) {
      itemMap[id] = {
        children: []
      }
    }
    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }
    let treeItem = itemMap[id]
    if (pid === NODE.RootPId) {
      nodes.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: []
        }
      }
      itemMap[pid]['children'].push(treeItem)
    }
  }
  return {cases: cases, nodes: nodes}
}

function sortBy (field) {
  return (x, y) => {
    return x[field] - y[field]
  }
}

function getTargetObject(targetObject, propsArray) {
  if (typeof (targetObject) !== 'object' || !Array.isArray(propsArray)) {
    return targetObject
  }
  const result = {}
  Object.keys(targetObject).filter(key => propsArray.includes(key)).forEach(key => {
    result[key] = targetObject[key]
  })
  return result
}

