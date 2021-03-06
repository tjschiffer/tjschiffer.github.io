let initialBody = null

// The following handles switching in between the two frameworks
// and there fore must be written outside of a framework
const frameworkState = {
  'currentFramework': 'Vue', // default to vue,
  'otherFramework': 'React'
}

// This will be a map of frameworks as keys and the frameworkManager as the value
const frameworkManagers = {}

const loadFrameworkManager = async (framework) => {
  return import('./' + framework.toLowerCase() + 'Manager')
}

/**
 * Update framework used by the entire page,
 * place on the window so all frameworks can access it
 *
 * @param newFramework
 * @return {Promise<void>}
 */
window.updateFramework = async (newFramework) => {
  if (frameworkState.currentFramework !== newFramework) {
    if (!frameworkManagers[frameworkState.currentFramework]) {
      frameworkManagers[frameworkState.currentFramework] = await loadFrameworkManager(frameworkState.currentFramework)
    }
    frameworkManagers[frameworkState.currentFramework].default.destroy()
    if (initialBody) {
      document.body.innerHTML = initialBody
    }
    frameworkState.otherFramework = frameworkState.currentFramework
    frameworkState.currentFramework = newFramework

    const url = new URL(window.location.href)
    url.searchParams.set('currentFramework', newFramework)
    history.replaceState({}, document.title, '?' + url.searchParams.toString())
  }

  // Dynamical load the framework if it hasn't been already loaded
  if (!frameworkManagers[newFramework]) {
    frameworkManagers[newFramework] = await loadFrameworkManager(newFramework)
  }
  frameworkManagers[newFramework].default.initialize()
}

const url = new URL(window.location.href)
const frameworkFromUrl = url.searchParams.get('currentFramework')
let currentFramework = frameworkState.currentFramework
if (frameworkFromUrl && Object.values(frameworkState).indexOf(frameworkFromUrl) > -1) {
  currentFramework = frameworkFromUrl
}
// Pre load the framework so it will be cached
loadFrameworkManager(currentFramework).then(currentFrameworkManager =>
  frameworkManagers[currentFramework] = currentFrameworkManager
)

window.onload = async () => {
  initialBody = document.body.innerHTML // Cache the html of the body since it will be modified by the frameworks
  await window.updateFramework(currentFramework) // load the default framework on load
}
