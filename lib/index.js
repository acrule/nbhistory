"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apputils_1 = require("@jupyterlab/apputils");
const widgets_1 = require("@phosphor/widgets");
require("../style/index.css");
/**
 * Initialization data for the nbhistory extension.
 */
const extension = {
    id: 'nbhistory',
    autoStart: true,
    requires: [apputils_1.ICommandPalette],
    activate: (app, palette) => {
        console.log('JupyterLab extension nbhistory2 is activated!');
        console.log('ICommandPalette:', palette);
        // Create a single widget
        let widget = new widgets_1.Widget();
        widget.id = 'nbhistory-jupyterlab';
        widget.title.label = 'nbhistory';
        widget.title.closable = true;
        // add the widget title
        let historyTitle = document.createElement('h1');
        historyTitle.innerHTML = 'History Panel';
        widget.node.appendChild(historyTitle);
        // Add an application command
        const command = 'nbhistory:open';
        app.commands.addCommand(command, {
            label: 'View Notebook History',
            execute: () => {
                if (!widget.isAttached) {
                    // Attach the widget to the main work area if it's not there
                    app.shell.addToMainArea(widget);
                }
                // Activate the widget
                app.shell.activateById(widget.id);
            }
        });
        // Add the command to the palette.
        palette.addItem({ command, category: 'History' });
    }
};
exports.default = extension;
