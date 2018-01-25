import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import NestedRouter from '../src/index';
import PropTypes from 'prop-types';

const mocks = (() => {
    const Main = () => <h1>Main</h1>;

    const General = () => <h2>General</h2>;
    const User = () => <h2>User</h2>;
    const Other = () => <h2>Other</h2>;

    const Settings = () => (
        <div>
            <h1>Settings</h1>
            <div className="content">
                <Switch>
                    <Route path="/general" component={General}/>
                    <Route path="/user" component={User}/>
                    <Route path="/other" component={Other}/>
                    <Redirect to="/general" />
                </Switch>
            </div>
        </div>
    );

    class GlobalLink extends React.Component {
        static propTypes = {
            to: PropTypes.string.isRequired
        };

        static contextTypes = {
            router: PropTypes.shape({
                history: PropTypes.shape({
                    push: PropTypes.func.isRequired,
                    replace: PropTypes.func.isRequired
                })
            }).isRequired
        };

        render() {
            const history = this.context.router.history;

            const props = {
                push: (): void => history.push(this.props.to, true),
                replace:  (): void => history.replace(this.props.to, true)
            };

            return <a onClick={this.props.replace === true ? props.replace : props.push}>{history.location.fullPathname}</a>;
        }
    }

    return {
        Settings,
        Main,
        GlobalLink
    };
})();

const changeLocation = (wrapper, location) => {
    const orig = console.error;
    console.error = () => { };
    wrapper.setProps({ location });
    console.error = orig;
};

const withProps = (addedProps, Component) => () => {
    return <Component {...addedProps} />;
};

describe('Nested React Router', () => {
    it('throws error without router', () => {
        expect(() => {
            const orig = console.error;
            console.error = () => { };
            mount(<NestedRouter path="/settings" component={mocks.Settings}/>);
            console.error = orig;
        }).toThrow();
    });

    it('correctly resolves nested paths', () => {
        const wrapper = mount(
            <StaticRouter location={'/settings/user'} context={{}}>
                <Switch>
                    <NestedRouter path="/settings" component={mocks.Settings}/>
                    <Route path="/" component={mocks.Main}/>
                </Switch>
            </StaticRouter>
        );

        expect(wrapper.text()).toBe('Settings' + 'User');
    });

    it('renders nothing', () => {
        const wrapper = mount(
            <StaticRouter location={'/settings/user'} context={{}}>
                <Switch>
                    <NestedRouter path="/settings"/>
                    <Route path="/" component={mocks.Main}/>
                </Switch>
            </StaticRouter>
        );

        expect(wrapper.find(NestedRouter).children().children().children().exists()).toBeFalsy();
    });

    it('correctly pushes paths', () => {
        const test = (replace, makeRouteProps) => {
            const context = {};

            const expectedAction = replace ? 'REPLACE' : 'PUSH';

            const ALink = withProps({ to: '/asd', replace }, Link);// change to sth with nested routes
            const AText = () => <div>text</div>;

            const NestedNested = () => (
                <div>
                    <Switch>
                        <Route path="/zxc" component={ALink} />
                        <Route path="/" component={AText} />
                    </Switch>
                </div>
            );

            const Nested = () => (
                <div>
                    <mocks.GlobalLink replace={replace} to="/other-global" />
                    <NestedRouter path="/" component={NestedNested}/>
                </div>
            );

            const ALinkAlt = withProps({ to: '/poi', replace }, Link);
            const ALinkSettings = withProps({ to: '/settings', replace }, Link);

            const wrapper = mount(
                <StaticRouter location={'/settings/zxc'} context={context}>
                    <div>
                        <Switch>
                            <NestedRouter path="/settings" {...makeRouteProps(Nested)} />
                            <Route path="/poi"  {...makeRouteProps(ALinkSettings)} />
                        </Switch>
                        <ALinkAlt/>
                    </div>
                </StaticRouter>
            );

            expect(wrapper.find(AText).exists()).toBeFalsy();
            expect(wrapper.find(ALink).exists()).toBeTruthy();
            expect(wrapper.find(ALinkAlt).exists()).toBeTruthy();
            expect(wrapper.find(ALinkSettings).exists()).toBeFalsy();

            wrapper.find(ALink).find('a').simulate('click', { button: 0 });
            expect(context.action).toBe(expectedAction);
            expect(context.url).toBe('/settings/asd');
            changeLocation(wrapper, context.url);

            expect(wrapper.find(mocks.GlobalLink).text()).toBe('/settings/asd');

            expect(wrapper.find(AText).exists()).toBeFalsy();
            expect(wrapper.find(ALink).exists()).toBeTruthy();
            expect(wrapper.find(ALinkAlt).exists()).toBeTruthy();
            expect(wrapper.find(ALinkSettings).exists()).toBeFalsy();

            wrapper.find(ALinkAlt).find('a').simulate('click', { button: 0 });
            expect(context.action).toBe(expectedAction);
            expect(context.url).toBe('/poi');
            changeLocation(wrapper, context.url);

            expect(wrapper.find(AText).exists()).toBeFalsy();
            expect(wrapper.find(ALink).exists()).toBeFalsy();
            expect(wrapper.find(ALinkAlt).exists()).toBeTruthy();
            expect(wrapper.find(ALinkSettings).exists()).toBeTruthy();

            wrapper.find(ALinkSettings).find('a').simulate('click', { button: 0 });
            expect(context.action).toBe(expectedAction);
            expect(context.url).toBe('/settings');
            changeLocation(wrapper, context.url);

            expect(wrapper.find(AText).exists()).toBeTruthy();
            expect(wrapper.find(ALink).exists()).toBeFalsy();
            expect(wrapper.find(ALinkAlt).exists()).toBeTruthy();
            expect(wrapper.find(ALinkSettings).exists()).toBeFalsy();

            wrapper.find(mocks.GlobalLink).find('a').simulate('click', { button: 0 });
            expect(context.action).toBe(expectedAction);
            expect(context.url).toBe('/other-global');
        };

        test(false, (component) => ({ component }));
        test(true, (component) => ({ component }));

        test(false, (Component) => ({ render: () => <Component /> }));
        test(true, (Component) => ({ render: () => <Component /> }));

        test(false, (Component) => ({ children: () => <Component /> }));
        test(true, (Component) => ({ children: () => <Component /> }));

        test(false, (Component) => ({ children: <Component /> }));
        test(true, (Component) => ({ children: <Component /> }));
    });
});
