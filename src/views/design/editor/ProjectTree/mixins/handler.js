import CONSTANT from './constant'
import {deepCopy} from '@/utils/dcopy'
import {guid} from '@/utils/other'

const caseType = 0
const baseNode = {id: 1, pid: 0, name: 'DEFAULT', desc: null, type: 0, open: false, nocheck: false, isParent: true, meta: {}}

function fillNode(data) {
  const node = deepCopy(baseNode)
  Object.assign(node, data)
  if (node.type !== caseType) {
    node.nocheck = true
  }
  if (node.desc === CONSTANT.NodeDesc.CASE) {
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
  //     pid: CONSTANT.RootId,
  //     name: project['name'],
  //     desc: CONSTANT.NodeDesc.ROOT,
  //     type: null
  //   }
  // )
  // treeNodes.push(rootNode)
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerNode(dataObject['dirs'][i], CONSTANT.RootPId, CONSTANT.NodeDesc.DIR)
    treeNodes.push(dirNode)
  }
  return treeNodes.sort(sortBy('type'))
}

export function formatDirNodes(dataObject, parentId) {
  const treeNodes = []
  if (!('dirs' in dataObject) || !('suites' in dataObject)) {
    return treeNodes
  }
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerNode(dataObject['dirs'][i], parentId, CONSTANT.NodeDesc.DIR)
    treeNodes.push(dirNode)
  }
  for (let j = 0; j < dataObject['suites'].length; j++) {
    const suiteNode = handlerNode(dataObject['suites'][j], parentId, CONSTANT.NodeDesc.SUITE)
    treeNodes.push(suiteNode)
  }
  return treeNodes
}

export function formatSuiteNodes(dataObject, parentId) {
  const treeNodes = []
  if (!('cases' in dataObject)) {
    return treeNodes
  }
  for (let i = 0; i < dataObject['cases'].length; i++) {
    const caseNode = handlerNode(dataObject['cases'][i], parentId, CONSTANT.NodeDesc.CASE)
    treeNodes.push(caseNode)
  }
  return treeNodes
}

export function handlerNode(obj, parentId, nodeDesc) {
  return fillNode(
    {
      mid: obj['id'],
      id: guid(),
      pid: parentId,
      name: obj['name'],
      desc: nodeDesc,
      type: obj['category'],
      meta: obj
    }
  )
}

function sortBy (field) {
  return (x, y) => {
    return x[field] - y[field]
  }
}
