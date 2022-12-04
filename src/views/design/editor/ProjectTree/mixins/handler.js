import CONSTANT from './constant'
import {deepCopy} from '@/utils/dcopy'
import {guid} from '@/utils/other'

const rootPid = 0
const baseNode = {'id': 1, 'pid': 0, 'name': 'DEFAULT', 'desc': null, 'type': 0, 'open': false, 'nocheck': false, 'isParent': true}

function fillNode(data) {
  const node = deepCopy(baseNode)
  Object.assign(node, data)
  if (node.type !== 0) {
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
  const rootId = guid()
  const project = dataObject['root']
  const rootNode = fillNode(
    {
      mid: project['id'],
      id: rootId,
      pid: rootPid,
      name: project['name'],
      desc: CONSTANT.NodeDesc.ROOT,
      type: null
    }
  )
  treeNodes.push(rootNode)
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerDirNode(dataObject['dirs'][i], rootId)
    treeNodes.push(dirNode)
  }
  return treeNodes
}

export function formatDirNodes(dataObject, parentId) {
  const treeNodes = []
  if (!('dirs' in dataObject) || !('suites' in dataObject)) {
    return treeNodes
  }
  for (let i = 0; i < dataObject['dirs'].length; i++) {
    const dirNode = handlerDirNode(dataObject['dirs'][i], parentId)
    treeNodes.push(dirNode)
  }
  for (let j = 0; j < dataObject['suites'].length; j++) {
    const suiteNode = handlerSuiteNode(dataObject['suites'][j], parentId)
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
    const caseNode = handlerCaseNode(dataObject['cases'][i], parentId)
    treeNodes.push(caseNode)
  }
  return treeNodes
}

export function handlerDirNode(dirObject, parentId) {
  return fillNode(
    {
      mid: dirObject['id'],
      id: guid(),
      pid: parentId,
      name: dirObject['dir_name'],
      desc: CONSTANT.NodeDesc.DIR,
      type: dirObject['dir_type']
    }
  )
}

export function handlerSuiteNode(suiteObject, parentId) {
  return fillNode(
    {
      mid: suiteObject['id'],
      id: guid(),
      pid: parentId,
      name: suiteObject['suite_name'],
      desc: CONSTANT.NodeDesc.SUITE,
      type: suiteObject['suite_type']
    }
  )
}

export function handlerCaseNode(caseObject, parentId) {
  return fillNode(
    {
      mid: caseObject['id'],
      id: guid(),
      pid: parentId,
      name: caseObject['case_name'],
      desc: CONSTANT.NodeDesc.CASE,
      type: caseObject['case_type']
    }
  )
}
