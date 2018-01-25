// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import invariant from 'invariant';
import getDisplayName from 'react-display-name';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { matchPath } from 'react-router';
import { getStringValues, buildProps, configOrProp } from './utils';
import omit from 'object.omit';

import type { NavOpts, LocationType, RouterContext } from './types';

const defaultOpts: NavOpts = {
    props: {
        to: 'to',
        activeClassName: false,
        exact: false,
        global: false,
        replace: false
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
};

const propTypesSchema = {
    activeClassName: PropTypes.string,
    to: PropTypes.string.isRequired,
    global: PropTypes.bool,
    replace: PropTypes.bool,
    exact: PropTypes.bool
};

const defaultPropsSchema = {
    global: false,
    replace: false,
    exact: false
};

export default
(opts: $Shape<NavOpts> = {}): * => <A: {}, C: React.ComponentType<A>>(Wrapped: C): $Subtype<React.Component<*>> => {
    const config = {
        ...defaultOpts,
        ...opts,
        props: {
            ...defaultOpts.props,
            ...opts.props
        },
        passedProps: {
            ...defaultOpts.passedProps,
            ...opts.passedProps
        }
    };

    invariant(
        typeof config.props.to === 'string' || typeof config.props.to === 'function',
        'Config prop "to" should be either a function or a string!'
    );

    const omitNavProps = <O: {}>(props: O): O => omit(props, getStringValues(config.props));

    class Nav extends React.Component<*> {
        static displayName = `Nav(${getDisplayName(Wrapped)})`;

        static propTypes = buildProps(config.props, propTypesSchema);

        static defaultProps = buildProps(config.props, defaultPropsSchema);

        static contextTypes = {
            router: PropTypes.shape({
                history: PropTypes.shape({
                    push: PropTypes.func.isRequired,
                    replace: PropTypes.func.isRequired
                }),
                route: PropTypes.shape({
                    location: PropTypes.shape({
                        pathname: PropTypes.string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        };

        getRouter = (): RouterContext => {
            const router = this.context.router;

            invariant(router, `You should not use <${getDisplayName(Nav)}> outside a <Router>`);

            return router;
        };

        triageUrl = (args: Array<*>): string => {
            if (typeof config.props.to === 'string') {
                return this.props[config.props.to];
            } else {
                return config.props.to(...args);
            }
        };

        handle = (...args: Array<*>) => {
            const router = this.getRouter();
            const global = configOrProp(config, this.props, 'global');
            const url = this.triageUrl(args);

            if (configOrProp(config, this.props, 'replace')) {
                router.history.replace(url, global);
            } else {
                router.history.push(url, global);
            }
        };

        currentPath = (location: LocationType, global: boolean): string =>
            global && location.fullPathname ? location.fullPathname : location.pathname;

        render(): React.Element<C> {
            const location = this.getRouter().history.location;

            const global = configOrProp(config, this.props, 'global');
            const currentPath = this.currentPath(location, global);

            const props = omitNavProps(this.props);

            const navProps = {
                [config.passedProps.handler]: this.handle
            };

            let activeClassName = false;

            if (typeof config.props.to === 'string') {
                const isActive = matchPath(currentPath, {
                    path: this.props[config.props.to],
                    exact: configOrProp(config, this.props, 'exact'),
                    strict: false
                });

                activeClassName = isActive && configOrProp(config, this.props, 'activeClassName');

                if (typeof config.passedProps.isActive === 'string') {
                    navProps[config.passedProps.isActive] = !!isActive;
                }
            }

            if (typeof config.passedProps.currentPath === 'string') {
                navProps[config.passedProps.currentPath] = currentPath;
            }

            return <Wrapped {...props} {...navProps} className={cx(props.className, activeClassName)} />;
        }
    }

    return hoistNonReactStatic(Nav, Wrapped);
};
