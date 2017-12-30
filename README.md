# react-router-nested

This library adds nesting to `react-router`. 
It renders `Route` component and keeps its all props and renders `Router` component inside for newly created scope (the route's address).

## Props

NestedRouter props are the same as 
[Route](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md)
component props

## Example
```jsx
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
```

---

There is also fully working example in `example/index.js`

Run with webpack dev server at 8080: `yarn start` or `npm start`

