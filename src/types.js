// @flow
import * as React from 'react';

export type LocationType = Location & { fullPathname: string, pathname: string };

export type HistoryType = History & {
    location: LocationType,
    push: (string, global?: boolean) => void,
    replace: (string, global?: boolean) => void
};

export type RouterContext = {
    history: HistoryType
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

type NavPropsOpts = {
    to: string | (...*) => string,
    global: false | string,
    activeClassName: false | string,
    exact: false | string,
    replace: false | string
};

type NavPassedPropsOpts = {
    handler: string,
    isActive: false | string,
    currentPath: false | string
};

export type NavOpts = {
    props: $Shape<NavPropsOpts>,
    passedProps: $Shape<NavPassedPropsOpts>,
    activeClassName: false | string,
    global: boolean,
    replace: boolean,
    exact: boolean
};

export type NavProps = {
    className?: string
};
