import React  from 'react';
import ReactDOM  from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import NestedRouter from 'react-router-nested';

const Main = () => <h1>Main</h1>;


const General = () => <h2>General</h2>;
const User = () => <h2>User</h2>;
const Other = () => <h2>Other</h2>;

const Settings = () => (
    <div>
        <h1>Settings</h1>
        <ul className="menu">
            <li><Link to="/general">General</Link></li>
            <li><Link to="/user">User</Link></li>
            <li><Link to="/other">Other</Link></li>
        </ul>
        <div className="content">
            <Switch>
                <Route path="/general" component={General}/>
                <Route path="/user" component={User}/>
                <Route path="/other" component={Other}/>
                <Redirect to="/general" />
            </Switch>
        </div>
    </div>
);

const App = () => (
    <BrowserRouter>
        <div>
            <h1>Hello!</h1>
            <ul className="menu">
                <li><Link to="/">/</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
            <div className="content">
                <Switch>
                    <NestedRouter path="/settings" component={Settings}/>
                    <Route path="/" component={Main}/>
                </Switch>
            </div>
        </div>
    </BrowserRouter>
);

window.onload = () => {
    const root = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(root);

    ReactDOM.render(<App />, root);
};
