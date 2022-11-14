const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  treeHidden: state => state.tree.hideTree,
}
export default getters
