import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the nbhistory extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'nbhistory',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension nbhistory is activated!');
  }
};

export default extension;
