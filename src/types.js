// @flow
import * as React from 'react';

export type HistoryType = History & {
    push: (string) => void,
    replace: (string) => void
};

export type ReactRouterRenderProps = {
    history: HistoryType,
    location: Location,
    match: {
        isExact: boolean,
        params: {
            [string]: string
        },
        path: string,
        url: string
    },
    staticContext: mixed
};

export type RenderProps = ReactRouterRenderProps;

export type RouteComponent = React.ComponentType<RenderProps>;
export type RouteRenderFunc = (RenderProps) => React.Element<*>;
export type RouteChildren = RouteRenderFunc | React.Element<*>;

export type NestedRouterProps = {|
    computedMatch?: {},
    path?: string,
    exact?: boolean,
    strict?: boolean,
    sensitive?: boolean,
    component?: RouteComponent,
    render?: RouteRenderFunc,
    children?: RouteChildren,
    location?: Location
|};