import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';


/**
 * Initialization data for the nbhistory extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'nbhistory',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterLab, palette: ICommandPalette) => {
    console.log('JupyterLab extension nbhistory2 is activated!');

    // Create a single widget
    let widget: Widget = new Widget();
    widget.id = 'nbhistory-jupyterlab';
    widget.title.label = 'Notebook History';
    widget.title.closable = true;

    // add the widget title
    let historyTitle = document.createElement('h1');
    historyTitle.innerHTML = 'History Panel'
    widget.node.appendChild(historyTitle);

    // Add an application command
    const command: string = 'nbhistory:open';
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
    palette.addItem({command, category: 'History'});
  }
};

export default extension;
