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
    to: false
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
            to: PropTypes.string.isRequired,
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

            invariant(router, `You should not use <${Nav.displayName}> outside a <Router>`);

            const { to, exact, global, ...props } = this.props;

            const location = router.history.location;
            const history = router.history;

            const path = global ? location.fullPathname : location.pathname;

            const isActive = matchPath(path, { path: to, exact, strict: false });

            const propsSchema = {
                to,
                isActive,
                push: (): void => history.push(to, global),
                replace:  (): void => history.replace(to, global)
            };

            const navProps = configureProps(propsSchema, config);

            if (isActive) {
                navProps.className = cx(props.className, config.activeClassName);
            }

            return <Wrapped {...props} {...navProps} />;
        }
    }

    return hoistNonReactStatic(Nav, Wrapped);
};
