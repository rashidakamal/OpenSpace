import React, { Component } from 'react';
import './App.css';
import openspaceApi from 'openspace-api-js';
import actions from './actions';
import displayEnvironment from './displayEnvironment';

class App extends Component {
  constructor(props) {
    super(props);
    let api = this._api = openspaceApi('localhost', 4682);

    api.onDisconnect(() => {
      this.setState({
        connected: false
      });
    });

    api.onConnect(async () => {
      try {
        this.openspace = await api.library();
        console.log('connected!')
        this.setState({
          connected: true
        });
      } catch (e) {
        console.log('OpenSpace library could not be loaded: Error: \n', e)
        this.setState({
          connected: false
        });
        return;
      }
    })

    this.state = {
      connected: false,
      isDome: false
    }
    api.connect();


    this.onChangeDisplayEnvironment = this.onChangeDisplayEnvironment.bind(this);
  }

  get connectionStatus() {
    if (this.state.connected) { 
      return <div className="connection-status connection-status-connected">
        Connected to OpenSpace
       </div>
    } else {
      return <div className="connection-status connection-status-disconnected">
        Disconnected from OpenSpace
       </div>
    }
  }

  onChangeDisplayEnvironment(evt) {
    const isDome = evt.target.checked;
    displayEnvironment.setIsDome(isDome);
    this.setState({
      isDome
    });
  }

  render() {
    return <div>
      {this.connectionStatus}
      <div className="main">
      <div className="configuration-card">
        <h2>Configuration</h2>
        <label className={this.state.isDome ? "checked" : ""}><input type="checkbox" onChange={this.onChangeDisplayEnvironment}/>Optimize for dome</label>
      </div>
      {
        actions(this.openspace).map((action, id) => {
          return <div key={id} className="card">
            <h2>{action.title}</h2>
            {action.description && action.description.split('\n').map(item => {
              return <p key={item}>{item}</p>
            })}
            {
              action.buttons && Object.keys(action.buttons).map(button => {
                const fn = action.buttons[button];
                const error = () => {console.log('Disconnected!') }
                const c = this.state.connected ? "connected" : "disconnected";
                return <button key={button} className={c} onClick={this.openspace ? fn : error}>{button}</button>
              })
            }
          </div>;
        })
      }
      </div>
    </div>
  }
}

export default App;
