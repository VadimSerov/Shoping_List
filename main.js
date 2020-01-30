const electron = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let addWindow;

//переменные окружения
//process.env.NODE_ENV = 'production';

//шаблон своего меню
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Добавить покупку',
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
        click() {
            createAddWindow();
        }
    }, {
        label: 'Очистить список',
        accelerator: process.platform == 'darwin' ? 'Command+Z' : 'Ctrl+Z',
        click() {
            mainWindow.webContents.send('item:clear');
        }
    }, {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(item, ) {
            //addWindow = null;
            mainWindow = null;
            electron.app.quit();
        }
    }, {
        role: 'close',
        accelerator: ''
    }]
}];
//кое что для макинтоша
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}
//кое что не для пользователя
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [{
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools(); //отладочник хрома
            }
        }, {
            role: 'reload'
        }]
    });
}

const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate);
electron.Menu.setApplicationMenu(mainMenu); // создание меню из шаблона
//electron.Menu.setApplicationMenu(null); // создание "никакого" меню

//событие вызванное из дочернего окна
electron.ipcMain.on('item:add', function(e, item) {
    e.preventDefault();
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

electron.app.on("window-all-closed", function() {
    electron.app.quit();
});

electron.app.on('ready', function() {
    mainWindow = new electron.BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
        //autoHideMenuBar: true //удаление меню навсегда
    });


    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on("closed", function() {
        //addWindow = null;
        mainWindow = null; //освобождение оперативной памяти
        electron.app.quit();
        //закрытие всего приложения 
        //без этого дочернее окно может не закрыться даже если закрыто главное окно
    });
});

function createAddWindow() {
    addWindow = new electron.BrowserWindow({
        x: 500,
        y: 300,
        width: 700,
        height: 500,
        show: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    /*
      addWindow.on('close',function(){
        addWindow = null;
      })
    */
}