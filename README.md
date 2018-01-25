# react-router-nested

This library adds nesting to `react-router` and provides `createNav` - `Nav` higher order component wrapper.

It also provides 


## NestedRouter 
It renders `Route` component and keeps its all props and renders `Router` component inside for newly created scope (the route's address).

### Props

NestedRouter props are the same as [Route](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md) component props

### Example
```jsx
import NestedRouter from 'react-router-nested';
import { StaticRouter, Route, Switch, Redirect } from 'react-router-dom';

const App = () => 
    <Switch>
        <NestedRouter path="/settings">
            <Switch>
                <Route path="/general" component={General}/>
                <Route path="/user" component={User}/>
                <Route path="/other" component={Other}/>
                <Redirect to="/general" />
            </Switch>
        </NestedRouter>
        <Route path="/" component={Main}/>
    </Switch>
);
```

---

There is also fully working example in `example/index.js`

Run with webpack dev server at 8080 with: `yarn start` or `npm start`

## createNav
`createNav` - `Nav` higher order component wrapper creating a navigation link from any component.

### API

const NavComponent = createNav(NavOptions)(Component);

#### NavOptions

NavOptions is an optional parameter - it is an object with following keys, all keys are optional. 

| Option          |           Type          |  Default  | Description                                                                        |
|-----------------|:-----------------------:|:---------:|------------------------------------------------------------------------------------|
| props           | `NavPropsOptions`       |     -     | Look at table below.                                                               |
| passedProps     | `NavPassedPropsOptions` |     -     | Look at table below,                                                               |
| activeClassName | `string` or `false`     |  `false`  | Class name appended to `Component` when current url matches prop `to`¹.            |
| exact           | `boolean`               |  `false`  | Use exact match for matching `to` with current url.                                |
| global          | `boolean`               |  `false`  | Use global path for matching `to` with current url. For use with NestedRouter.     |
| replace         | `boolean`               |  `false`  | Use use *replace* instead of *push* method when changing an url.                   |

#### NavPropsOptions

It is an object with following keys, all keys are optional. Props override `NavOptions`

| Option          |           Type          |  Default  | Description                                                                                                                                                  |
|-----------------|:-----------------------:|:---------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| to              | `string` or `false`     |  `false`  | Property added to `Component` to provide target url.                                                                                                         |
| activeClassName | `string` or `false`     |  `false`  | Property added to `Component` to override `NavOptions` **className** appended to `Component`'s when current url matches prop `to`¹.                          |
| exact           | `boolean`               |  `false`  | Property added to `Component` to override `NavOptions` setting weather to use **exact** match for matching `to` with current url.                            |
| global          | `boolean`               |  `false`  | Property added to `Component` to override `NavOptions` setting weather to use **global** path for matching `to` with current url. For use with NestedRouter. |
| replace         | `boolean`               |  `false`  | Property added to `Component` to override `NavOptions` setting weather to use use **replace** instead of *push* method when changing an url.                 |


#### NavPassedPropsOptions

These options configure names of properties passed to `Component`.
Property is not passed when set to `false`.
It is an object with following keys, all keys are optional.

| Option      |         Type        |   Default   | Description                                                                                                      |
|-------------|:-------------------:|:-----------:|------------------------------------------------------------------------------------------------------------------|
| isActive    | `string` or `false` |   `false`   | Name of prop passed to `Component` providing `boolean` information about weather current path is active¹.        |
| currentPath | `string` or `false` |   `false`   | Name of prop passed to `Component` providing `sting` current url.                                                |
| handler     | `string`            | `"onClick"` | Name of prop passed to `Component` with event handler, to trigger url change                                     |

¹Available only when `props`.`to` is a prop name (`string`). It doesn't work when it is configured to resolve url form `prop`.`handler` argument.


### Example

```js
import { createNav } from 'react-router-nested';
import { StaticRouter } from 'react-router-dom';

const NavBase = (props) => <button {...props} />;
const Nav = createNav({ // default options
    props: {
        activeClassName: false,
        to: 'to',
        global: false,
        replace: false,
        exact: false
    },
    passedProps: {
        handler: 'onClick',
        isActive: false,
        currentPath: false
    },
    activeClassName: false,
    exact: false,
    global: false,
    replace: false
})(NavBase);

const App = () => (
    <StaticRouter context={{}} location='/asd'>
        <Nav to="/zxc" />
    </StaticRouter>
);
```
