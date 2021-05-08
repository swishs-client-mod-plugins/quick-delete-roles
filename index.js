const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { getModule } = require('powercord/webpack')

const { deleteRole } = getModule(['deleteRole'], false)
const { getGuildId } = getModule(['getGuildId'], false)

let holdingDelete
const deleteHandler = (e) => e.key === 'Delete' && (holdingDelete = e.type === 'keydown')
module.exports = class QuickDeleteRoles extends Plugin {
  startPlugin() {
    document.addEventListener('keydown', deleteHandler)
    document.addEventListener('keyup', deleteHandler)
    this.patchSelectRole()
  }

  pluginWillUnload() {
    document.removeEventListener('keydown', deleteHandler)
    document.removeEventListener('keyup', deleteHandler)
    uninject('qdr-selectRole')
  }

  patchSelectRole() {
    const selectRole = getModule(['selectRole'], false)
    inject('qdr-selectRole', selectRole, 'selectRole', (args) => {
      if (!holdingDelete) return
      deleteRole(getGuildId(), args[0])
    })
  }
}
