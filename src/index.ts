import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

import {
  Message
} from '@phosphor/messaging';

import {
  KernelMessage
} from '@jupyterlab/services';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';


/**
 * Class for History viewer widget
 */
class HistoryWidget extends Widget {
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

  // an HTML body for all our history information to go
  readonly body: HTMLElement;
  readonly head: HTMLElement;

  onUpdateRequest(msg: Message): void {
    console.log('The History widget updated');
  }


}

function activate(app: JupyterLab, palette: ICommandPalette, nbtracker: INotebookTracker) {
  console.log('JupyterLab extension nbhistory is activated!');

  // Create a single widget
  let widget: HistoryWidget = new HistoryWidget();

  // Add an application command
  const command: string = 'nbhistory:open';
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
      const options: KernelMessage.IHistoryRequest = {
        output: true,
        raw: true,
        hist_access_type: 'range',
        session: 0,
        pattern: '*',
        unique: false
      };

      currentKernel.requestHistory(options).then( (msg) => {

        // clear the history panel
        widget.body.innerHTML = '';

        msg.content.history.forEach((e: any) => {
          e[2].forEach((l: any) => {
            let p: HTMLElement = document.createElement('p');
            p.innerHTML = l;
            widget.body.appendChild(p);
          })
        });
      });


      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({command, category: 'History'});
}

/**
 * Initialization data for the nbhistory extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'nbhistory',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: activate
};

export default extension;
