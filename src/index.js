// @flow
import React from 'react';
import { Route, Router } from 'react-router';
import { stripBasenameProxy, withBase } from './utils';
import readOnlyOverrideProxy from './proxy';

import type { Element } from 'react';
import type {
    History, NestedRouterProps, ReactRouterRenderProps, RenderProps, RouteChildren, RouteComponent, RouteRenderFunc
} from './types';

class NestedRouter extends React.Component<NestedRouterProps> {
    static propTypes = Route.propTypes;
    static contextTypes = Route.contextTypes;

    url = '/';

    getContextHistory = (): History => this.context.router.history;

    historyOverrides = {
        createHref: (url: string) => withBase(this.url, url),
        push: (url: string) => this.getContextHistory().push(withBase(this.url, url)),
        replace: (url: string) => this.getContextHistory().replace(withBase(this.url, url))
    };

    historyCreators = {
        location: (location: Location): Location => stripBasenameProxy(this.url, location)
    };

    historyProxy = readOnlyOverrideProxy(this.historyOverrides, this.historyCreators)(this.getContextHistory());

    render(): Element<Route> {
        const { component, render, children, ...props } = this.props;

        return (
            <Route {...props} render={({ match }: ReactRouterRenderProps) => {
                this.url = match.url;

                return (
                    <Router history={this.historyProxy}>
                        {this.renderChildren(component, render, children, {})}
                    </Router>
                );
            }} />
        );
    }

    renderChildren = (Component: ?RouteComponent, render: ?RouteRenderFunc, children: ?RouteChildren, props: RenderProps) => {
        if (Component) {
            return (<Component {...props} />);
        }

        if (render) {
            return render(props);
        }

        if (children) {
            if (typeof children === 'function') {
                return children(props);
            }

            return children;
        }

        return null;
    };
}

export default NestedRouter;
