import BaseTag from './BaseTag'

class GoogleTag extends BaseTag
{
  init()
  {
    console.log('init google')
  }

  action()
  {
    console.log('action google')
  }

  impression()
  {
    console.log('impression google')
  }
}

const instance = new GoogleTag()
export default instance
