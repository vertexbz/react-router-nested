import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import NestedRouter from '../src/index';
import createNav from '../src/nav';

const changeLocation = (wrapper, location) => {
    const orig = console.error;
    console.error = () => { };
    wrapper.setProps({ location });
    console.error = orig;
};

describe('Navigation HOC', () => {
    describe('throws error', () => {
        it('when without router', () => {
            const NavBase = (props) => <button {...props} />;
            const Nav = createNav()(NavBase);
            expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

            expect(() => {
                const orig = console.error;
                console.error = () => { };
                mount(<Nav to="/zxc" />);
                console.error = orig;
            }).toThrow();
        });

        it('with invalid "to" prop', () => {
            const NavBase = (props) => <button {...props} />;

            for (const to of [7, {}, [], true, false, null]) {
                expect(() => {
                    const orig = console.error;
                    console.error = () => {};
                    // $FlowIgnore
                    createNav({ props: { to } })(NavBase);
                    console.error = orig;
                }).toThrow();
            }
        });
    });

    it('picks url from handler parameter', () => {
        const NavBase = (props) => <button {...props} />;
        const to = jest.fn().mockImplementation((e) => e.target.value);
        const Nav = createNav({ props: { to } })(NavBase);
        expect(Nav.propTypes.to).toBeUndefined();

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav value="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).prop('value')).toBe('/zxc');
        wrapper.find(NavBase).simulate('click');
        expect(to).toBeCalled();
        expect(to.mock.calls[0].length).toBeGreaterThan(0);
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('PUSH');
    });

    it('uses custom handler prop name', () => {
        const handlerProxy = jest.fn();
        const NavBase = ({ onClick: _, navHandler, ...props }) => (
            <button
                {...props}
                onClick={handlerProxy.mockImplementation((...a) => navHandler(...a))}
            />
        );
        const Nav = createNav({ passedProps: { handler: 'navHandler' } })(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(handlerProxy).toBeCalled();
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('PUSH');
    });

    it('pushes path in StaticRouter', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav()(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('PUSH');
    });

    it('replaces (config) path in StaticRouter', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ replace: true })(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('REPLACE');
    });

    it('replaces (prop) path in StaticRouter', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { replace: 'replaces' }, replace: false })(NavBase);
        expect(Nav.propTypes.replaces).toBe(PropTypes.bool);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" replaces />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('REPLACE');
    });

    it('pushes, not replaces (prop - PUSH, config - REPLACE) path in StaticRouter', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { replace: 'replaces' }, replace: true })(NavBase);
        expect(Nav.propTypes.replaces).toBe(PropTypes.bool);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" replaces={false} />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('PUSH');
    });

    it('pushes, not replaces (prop default - PUSH, config - REPLACE) path in StaticRouter', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { replace: 'replaces' }, replace: true })(NavBase);
        expect(Nav.propTypes.replaces).toBe(PropTypes.bool);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        wrapper.find(NavBase).simulate('click');
        expect(context.url).toBe('/zxc');
        expect(context.action).toBe('PUSH');
    });

    it('sets activeClassName to WrappedComponent if active (config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).not.toBe('act');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toBe('act');
    });

    it('appends activeClassName to WrappedComponent if active (config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" className="basic-class" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).not.toContain('act');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).toContain('act');
    });

    it('sets activeClassName to WrappedComponent if active (props override config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { activeClassName: 'acn' }, activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.acn).toBe(PropTypes.string);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" acn="current" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).not.toBe('act');
        expect(wrapper.find(NavBase).props().className).not.toBe('current');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toBe('current');
        expect(wrapper.find(NavBase).props().className).not.toBe('act');
    });

    it('appends activeClassName to WrappedComponent if active (props override config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { activeClassName: 'acn' }, activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.acn).toBe(PropTypes.string);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" className="basic-class" acn="current" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).not.toContain('act');
        expect(wrapper.find(NavBase).props().className).not.toContain('current');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).not.toContain('act');
        expect(wrapper.find(NavBase).props().className).toContain('current');
    });

    it('sets activeClassName to WrappedComponent if active (configured, but missing props not override config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { activeClassName: 'acn' }, activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.acn).toBe(PropTypes.string);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).not.toBe('act');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toBe('act');
    });

    it('appends activeClassName to WrappedComponent if active (configured, but missing props not override config)', () => {
        const NavBase = (props) => <button {...props} />;
        const Nav = createNav({ props: { activeClassName: 'acn' }, activeClassName: 'act' })(NavBase);
        expect(Nav.propTypes.acn).toBe(PropTypes.string);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" className="basic-class" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).not.toContain('act');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().className).toContain('basic-class');
        expect(wrapper.find(NavBase).props().className).toContain('act');
    });

    describe('exact', () => {
        describe('from config', () => {
            it('is active', () => {
                const NavBase = ({ isCurrent, ...props }) => <button {...props} />;
                const Nav = createNav({ passedProps: { isActive: 'isCurrent' }, exact: true })(NavBase);
                expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

                const context = {};

                const wrapper = mount(
                    <StaticRouter context={context} location='/asd'>
                        <Nav to="/zxc" />
                    </StaticRouter>
                );

                expect(wrapper).toBeTruthy();
                expect(wrapper.find(NavBase).props().isCurrent).toBe(false);
                changeLocation(wrapper, '/zxc');
                expect(wrapper.find(NavBase).props().isCurrent).toBe(true);
            });

            it('is not active', () => {
                const NavBase = ({ isCurrent, ...props }) => <button {...props} />;
                const Nav = createNav({ passedProps: { isActive: 'isCurrent' }, exact: true })(NavBase);
                expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

                const context = {};

                const wrapper = mount(
                    <StaticRouter context={context} location='/asd'>
                        <Nav to="/zxc" />
                    </StaticRouter>
                );

                expect(wrapper).toBeTruthy();
                expect(wrapper.find(NavBase).props().isCurrent).toBe(false);
                changeLocation(wrapper, '/zxc/qwe');
                expect(wrapper.find(NavBase).props().isCurrent).toBe(false);
            });
        });

        describe('false (default)', () => {
            describe('appends isActive prop according to config', () => {
                it('exact', () => {
                    const NavBase = ({ isCurrent, ...props }) => <button {...props} />;
                    const Nav = createNav({ passedProps: { isActive: 'isCurrent' } })(NavBase);
                    expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

                    const context = {};

                    const wrapper = mount(
                        <StaticRouter context={context} location='/asd'>
                            <Nav to="/zxc" />
                        </StaticRouter>
                    );

                    expect(wrapper).toBeTruthy();
                    expect(wrapper.find(NavBase).props().isCurrent).toBe(false);
                    changeLocation(wrapper, '/zxc');
                    expect(wrapper.find(NavBase).props().isCurrent).toBe(true);
                });

                it('not exact', () => {
                    const NavBase = ({ isCurrent, ...props }) => <button {...props} />;
                    const Nav = createNav({ passedProps: { isActive: 'isCurrent' } })(NavBase);
                    expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

                    const context = {};

                    const wrapper = mount(
                        <StaticRouter context={context} location='/asd'>
                            <Nav to="/zxc" />
                        </StaticRouter>
                    );

                    expect(wrapper).toBeTruthy();
                    expect(wrapper.find(NavBase).props().isCurrent).toBe(false);
                    changeLocation(wrapper, '/zxc/qwe');
                    expect(wrapper.find(NavBase).props().isCurrent).toBe(true);
                });
            });
        });
    });

    it('appends currentPtah prop according to config', () => {
        const NavBase = ({ cp, ...props }) => <button {...props} />;
        const Nav = createNav({ passedProps: { currentPath: 'cp' } })(NavBase);
        expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

        const context = {};

        const wrapper = mount(
            <StaticRouter context={context} location='/asd'>
                <Nav to="/zxc" />
            </StaticRouter>
        );

        expect(wrapper).toBeTruthy();
        expect(wrapper.find(NavBase).props().cp).toBe('/asd');
        changeLocation(wrapper, '/zxc');
        expect(wrapper.find(NavBase).props().cp).toBe('/zxc');
    });

    describe('supports global switch and fullPathname', () => {
        it('inside NestedRouter', () => {
            const NavBase = ({ cp, ...props }) => <button {...props} />;
            const Nav = createNav({ props: { global: 'g' } })(NavBase);
            expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

            const context = {};

            const wrapper = mount(
                <StaticRouter context={context} location='/asd'>
                    <NestedRouter path="/asd" render={() => {
                        return <Nav to="/zxc" g />;
                    }} />

                </StaticRouter>
            );

            expect(wrapper).toBeTruthy();
            wrapper.find(NavBase).simulate('click');
            expect(context.url).toBe('/zxc');
            expect(context.action).toBe('PUSH');
        });

        it('without NestedRouter', () => {
            const NavBase = ({ cp, ...props }) => <button {...props} />;
            const Nav = createNav({ props: { global: 'g' } })(NavBase);
            expect(Nav.propTypes.to).toBe(PropTypes.string.isRequired);

            const context = {};

            const wrapper = mount(
                <StaticRouter context={context} location='/asd'>
                    <Nav to="/zxc" g />
                </StaticRouter>
            );

            expect(wrapper).toBeTruthy();
            wrapper.find(NavBase).simulate('click');
            expect(context.url).toBe('/zxc');
            expect(context.action).toBe('PUSH');
        });
    });
});
