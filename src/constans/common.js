const ModuleStatus = {
  NORMAL: 0,
  DISCARDED: 1,
  DELETED: 2,
  DISABLED: 3,
  READY: 9,
}

const BuildStatus = {}

export default {
  ModuleStatus,
  BuildStatus,
}

export function statusMap(status) {
  if (status === ModuleStatus.NORMAL) {
    return 'Normal'
  } else if (status === ModuleStatus.DISCARDED) {
    return 'Discarded'
  } else if (status === ModuleStatus.DELETED) {
    return 'Deleted'
  } else if (status === ModuleStatus.READY) {
    return 'Ready'
  } else {
    return 'Unknown'
  }
}
