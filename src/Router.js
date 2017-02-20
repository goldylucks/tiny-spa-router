const WILD_ROUTE_PATH = '*'

export default class Router {

  constructor ({ onRouteChange, routes }) {
    this.componentRegistery = {} // keep track of already initialized components
    this.routes = routes || []
    this.onRouteChange = onRouteChange
    document.addEventListener('click', this.onClick)
  }

  // enable adding routes from outside sources, not used here
  // routes -> [{ path: String, Component: Class }]
  register (routes) {
    this.routes.push(...routes)
  }

  to (path) {
    const route = this.getRouteByPath(path)
    if (!route) {
      this.handleUndefinedRoute(route)
      return
    }
    window.history.pushState({}, '', path)
    this.onRouteChange({ path, html: this.getHtmlOfRoute(path) })
  }

  getRouteByPath (path) {
    return this.routes.find(route => route.path === path)
  }

  init (path) {
    this.to(window.location.pathname)
  }

  handleUndefinedRoute (path) {
    const wildRoute = this.getRouteByPath(WILD_ROUTE_PATH)
    if (!wildRoute) {
      console.warn('route with path', path, 'doesn\'t exist, and no catch all page is defined')
      return
    }
    window.history.pushState({}, '', '404')
    this.onRouteChange({ path, html: this.getHtmlOfRoute(WILD_ROUTE_PATH) })
  }

  onClick = evt => {
    const toPath = evt.srcElement.getAttribute('data-to')
    if (!toPath) {
      return
    }
    this.to(toPath)
  }

  getHtmlOfRoute (path) {
    if (this.componentRegistery[path]) {
      return this.componentRegistery[path].render()
    }
    const { Component } = this.getRouteByPath(path)
    const component = new Component()
    this.componentRegistery[path] = component
    return component.render()
  }

}
