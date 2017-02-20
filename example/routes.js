import Router from 'tiny-spa-router'
import Page1 from './containers/page1'
import Page2 from './containers/page2'
import Page404 from './containers/page404'

const rootNode = document.getElementById('root')

export default class Routes {

  routes = [
    { path: '/page1', Component: Page1 },
    { path: '/page2', Component: Page2 },
    { path: '*', Component: Page404 },
  ]

  constructor () {
    this.router = new Router({ onRouteChange, routes: this.routes })
  }
}

function onRouteChange ({ html }) {
  rootNode.innerHTML = html
}
