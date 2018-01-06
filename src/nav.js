// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import invariant from 'invariant';
import getDisplayName from 'react-display-name';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { matchPath } from 'react-router';
import { configureProps, convertTrueProps } from './utils';

import type { NavOpts, NavProps } from './types';

const defaultOpts = {
    activeClassName: false,
    isActive: false,
    push: false,
    replace: false,
    to: false,
    triageDestination: (args: [], props: NavProps): string => props.to
};

const trueOptValues = {
    activeClassName: 'active',
    push: 'onClick',
    replace: 'onClick'
};

export default (opts: NavOpts = {}): * => <A: {}, C: React.ComponentType<A>, P: A & NavProps>(Wrapped: C): React.Component<P> => {
    const config = convertTrueProps(Object.assign({}, defaultOpts, opts), trueOptValues);

    class Nav extends React.Component<P> {
        static displayName = `Nav(${getDisplayName(Wrapped)})`;

        static propTypes = {
            to: PropTypes.string,
            exact: PropTypes.bool,
            global: PropTypes.bool
        };

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

        static defaultProps = {
            exact: false,
            global: false
        };

        render(): React.Element<C> {
            const router = this.context.router;

            invariant(router, `You should not use <${Nav.displayName || 'Nav(Component)'}> outside a <Router>`);

            const { to, exact, global, ...props } = this.props;

            const location = router.history.location;
            const history = router.history;

            const path = global ? location.fullPathname : location.pathname;

            const isActive = matchPath(path, { path: to, exact, strict: false });

            const propsSchema = {
                to,
                isActive,
                push: (...args: *): void => history.push(config.triageDestination(args, this.props), global),
                replace:  (...args: *): void => history.replace(config.triageDestination(args, this.props), global)
            };

            const navProps = configureProps(propsSchema, config);

            return <Wrapped {...props} {...navProps} className={cx(props.className, config.activeClassName)} />;
        }
    }

    return hoistNonReactStatic(Nav, Wrapped);
};
