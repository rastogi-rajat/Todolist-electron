const electron = require('electron');
const path = require('path');
const url = require('url');

const { app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow;
let addTaskWindow;

//Main Window start
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true
        }});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/html/mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
    mainWindow.on('closed', ()=>{
        app.quit();
    })
    // Add listner for data sent by addTaskWindow
    ipcMain.on('task:add', (e,task) => {
        mainWindow.webContents.send('task:add', task);
        addTaskWindow.close();
    })

});
//Main Window End

//Main Menu Template start
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Add Task',
        click:createAddTaskWindow
    },{
        label: 'Quit',
        accelerator:process.platform==='darwin' ? 'Command+Q': 'Ctrl+Q',
        click(){
            app.quit();
        }
    }],
}];

// Add an empty object for MAC since first item show up
// the name of the application 
if(process.platform === 'darwin') {
    mainMenuTemplate.push({});
}

// Add developer tools for development ENV
if(process.env.NODE_ENV!='production') {
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu:[{
            label: 'Toggle Dev Tools',
            accelerator: process.platform === 'darwin' ?'Command+I':'Ctrl+I',
            click(item, focusWindow){
                focusWindow.toggleDevTools();
            }
        },{
            role: 'reload'
        }]
    });
}
//Main Menu Template end

//Add Menu Template start
const addMenuTemplate = [{
    label: 'Quit',
    click(){
        addTaskWindow.close();
    }
}]
//Add Menu Template end

//Fundtion to diaplay Add task window
function createAddTaskWindow() {
    if(addTaskWindow!=null){
        addTaskWindow.close();
    }
    addTaskWindow = new BrowserWindow({
        height: 200,
        width: 400,
        title: 'Add Task',
        webPreferences: {
            nodeIntegration: true
        }
    })
    addTaskWindow.loadURL(url.format({
        pathname: path.join(__dirname,'/html/addTaskWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //garbage collect
    addTaskWindow.on('closed', () => {
        addTaskWindow = null;
    })
    if(process.platform != 'darwin'){
        addTaskWindow.setMenu(Menu.buildFromTemplate(addMenuTemplate));
    }
}
//Fundtion to diaplay Add task window end