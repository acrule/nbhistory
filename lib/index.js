"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apputils_1 = require("@jupyterlab/apputils");
const notebook_1 = require("@jupyterlab/notebook");
const widgets_1 = require("@phosphor/widgets");
require("../style/index.css");
/**
 * Class for History viewer widget
 */
class HistoryWidget extends widgets_1.Widget {
    // create a new widget
    constructor() {
        super();
        this.id = 'nbhistory-jupyterlab';
        this.title.label = 'Notebook History';
        this.title.closable = true;
        this.addClass('jp-historyWidget');
        this.head = document.createElement('h1');
        this.head.innerHTML = 'History Panel';
        this.body = document.createElement('div');
        this.node.appendChild(this.head);
        this.node.appendChild(this.body);
    }
    onUpdateRequest(msg) {
        console.log('The History widget updated');
    }
}
function activate(app, palette, nbtracker) {
    console.log('JupyterLab extension nbhistory is activated!');
    // Create a single widget
    let widget = new HistoryWidget();
    // Add an application command
    const command = 'nbhistory:open';
    app.commands.addCommand(command, {
        label: 'View Notebook History',
        execute: () => {
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(widget);
            }
            widget.update();
            // get current notebook
            let currentKernel = nbtracker.currentWidget.session.kernel;
            // set options to get all history from last session
            // https://jupyter-client.readthedocs.io/en/latest/messaging.html#history
            const options = {
                output: true,
                raw: true,
                hist_access_type: 'range',
                session: 0,
                pattern: '*',
                unique: false
            };
            currentKernel.requestHistory(options).then((msg) => {
                // clear the history panel
                widget.body.innerHTML = '';
                msg.content.history.forEach((e) => {
                    e[2].forEach((l) => {
                        let p = document.createElement('p');
                        p.innerHTML = l;
                        widget.body.appendChild(p);
                    });
                });
            });
            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });
    // Add the command to the palette.
    palette.addItem({ command, category: 'History' });
}
/**
 * Initialization data for the nbhistory extension.
 */
const extension = {
    id: 'nbhistory',
    autoStart: true,
    requires: [apputils_1.ICommandPalette, notebook_1.INotebookTracker],
    activate: activate
};
exports.default = extension;
