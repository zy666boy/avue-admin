const getters = {
    tag: state => state.tags.tag,
    website: state => state.common.website,
    userInfo: state => state.user.userInfo,
    theme: state => state.common.theme,
    themeName: state => state.common.themeName,
    isCollapse: state => state.common.isCollapse,
    keyCollapse: (state, getters) => getters.screen > 1 ? getters.isCollapse : false,
    screen: state => state.common.screen,
    isLock: state => state.common.isLock,
    isFullScren: state => state.common.isFullScren,
    lockPasswd: state => state.common.lockPasswd,
    tagList: state => state.tags.tagList,
    tagWel: state => state.tags.tagWel,
    token: state => state.user.token,
    roles: state => state.user.roles,
    permission: state => state.user.permission,
    menu: state => state.user.menu,
    menuAll: state => state.user.menuAll,
    logsList: state => state.logs.logsList,
    logsLen: state => state.logs.logsList.length || 0,
    logsFlag: (state, getters) => getters.logsLen === 0
}
export default getters