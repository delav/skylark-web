const ModuleStatus = {
  NORMAL: 0,
  DISCARDED: 1,
  DELETED: 2,
  DISABLED: 3
}

const BuildStatus = {
  PENDING: -1,
  RUNNING: 0,
  FINISH: 1,
  SUCCESS: 2,
  FAILED: 3,
}


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
  } else if (status === ModuleStatus.DISABLED) {
    return 'Disabled'
  } else {
    return 'Unknown'
  }
}

export function buildStatusMap(status) {
  if (status === BuildStatus.PENDING) {
    return 'Pending'
  } else if (status === BuildStatus.RUNNING) {
    return 'Running'
  } else if (status === BuildStatus.FAILED) {
    return 'Failed'
  } else if (status === BuildStatus.SUCCESS) {
    return 'Success'
  } else if (status === BuildStatus.FINISH) {
    return 'Finish'
  }
  return 'Unknown'
}
