import i13nStore from 'i13n/store'

class BaseTag
{
  register()
  {
    i13nStore.addListener(this.init.bind(this), 'init')
    i13nStore.addListener(this.action.bind(this), 'action')
    i13nStore.addListener(this.impression.bind(this), 'impression')
  }

  init(){}

  action(){}

  impression(){}
}

export default BaseTag
