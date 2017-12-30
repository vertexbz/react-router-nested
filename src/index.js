// @flow
import * as React from 'react';
import { Route, Router } from 'react-router';
import { stripBasename, withBase } from './utils';
import readOnlyOverrideProxy from './proxy';
export { default as createNav } from './nav';

import type {
    HistoryType, LocationType, NestedRouterProps, ReactRouterRenderProps, RenderProps, RouteChildren, RouteComponent,
    RouteRenderFunc
} from './types';

export const stripBasenameProxy = (basename: string, location: LocationType): LocationType => readOnlyOverrideProxy({
    fullPathname: location.pathname
}, {
    pathname: (pathname: string): string => stripBasename(basename, pathname)
})(location);

export default
class NestedRouter extends React.Component<NestedRouterProps> {
    static propTypes: * = Route.propTypes;
    static contextTypes: * = Route.contextTypes;

    url: string = '/';

    getContextHistory = (): HistoryType => this.context.router.history;

    historyOverrides = {
        createHref: (url: string): string => withBase(this.url, url),
        push: (url: string, global: boolean = false): void => this.getContextHistory().push(global ? url : withBase(this.url, url)),
        replace: (url: string, global: boolean = false): void => this.getContextHistory().replace(global ? url : withBase(this.url, url))
    };

    historyCreators = {
        location: (location: LocationType): LocationType => stripBasenameProxy(this.url, location)
    };

    historyProxy = readOnlyOverrideProxy(this.historyOverrides, this.historyCreators)(this.getContextHistory());

    render(): React.Element<Route> {
        const { component, render, children, ...props } = this.props;

        return (
            <Route
                {...props} render={(props: ReactRouterRenderProps): React.Element<Router> => {
                    this.url = props.match.url;

                    return (
                        <Router history={this.historyProxy}>
                            {this.renderChildren(component, render, children, props)}
                        </Router>
                    );
                }}
            />
        );
    }

    renderChildren = (Component: ?RouteComponent, render: ?RouteRenderFunc, children: ?RouteChildren, props: RenderProps): React.Node => {
        if (Component) {
            return <Component {...props} />;
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
