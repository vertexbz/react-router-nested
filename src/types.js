// @flow
import * as React from 'react';

export type LocationType = Location;

export type HistoryType = History & {
    push: (string) => void,
    replace: (string) => void
};

export type ReactRouterRenderProps = {
    history: HistoryType,
    location: LocationType,
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
    location?: LocationType
|};

export type NavOpts = $Shape<{
    activeClassName: boolean | string,
    isActive: boolean | string,
    push: boolean | string,
    replace: boolean | string,
    to: boolean | string
}>;

export type NavProps = {|
    to: string,
    exact?: boolean,
    global?: boolean
|};
