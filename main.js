/**
 * app 模块，它控制应用程序的事件生命周期。
 * BrowserWindow 模块，它创建和管理应用程序 窗口。
 */
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')
  }

  /**
   * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
   * 您可以通过使用 app.whenReady() API来监听此事件。 
   * 在whenReady()成功后调用createWindow()。
   */  
  app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  /**
   * 要实现这一点,监听app中window-all-closed事件，然后调用app.quit()方法
   * To implement this, listen for the app module's 'window-all-closed' event, 
   * and call app.quit() if the user is not on macOS (darwin).
   */  
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  /**
   * 当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
   * 
   * 为了实现这一特性，监听 app 模块的 activate 事件。如果没有任何浏览器窗口是打开的，则调用 createWindow() 方法。
   * 
   * 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件。 
   * 
   * 通过在您现有的 whenReady() 回调中附上您的事件监听器来完成这个操作。
   */  