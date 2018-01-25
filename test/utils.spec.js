import { createURL, addLeadingSlash, stripBasename, withBase, getStringValues, configOrProp, buildProps } from '../src/utils';

describe('Nested React Router utils', () => {
    describe('createURL', () => {
        it('passes string trough', () => {
            const url = '/some/url';
            expect(createURL(url)).toBe(url);
        });

        it('extracts url from location pathname', () => {
            const url = '/some/url';

            const location = {
                pathname: url
            };

            expect(createURL(location)).toBe(url);
        });

        it('extracts url from location pathname and hash', () => {
            const location = {
                pathname: '/some/url',
                hash: 'hash'
            };

            expect(createURL(location)).toBe(location.pathname + '#' + location.hash);
        });

        it('extracts url from location pathname and search', () => {
            const location = {
                pathname: '/some/url',
                search: 'search'
            };

            expect(createURL(location)).toBe(location.pathname + '?' + location.search);
        });

        it('extracts url from location pathname and search and hash', () => {
            const location = {
                pathname: '/some/url',
                search: 'search',
                hash: 'hash'
            };

            expect(createURL(location)).toBe(location.pathname + '?' + location.search + '#' + location.hash);
        });
    });

    describe('addLeadingSlash', () => {
        it('adds slash', () => {
            const url = 'some-url';

            expect(addLeadingSlash(url)).toBe('/' + url);
        });

        it("doesn' add slash", () => {
            const url = '/some-url';

            expect(addLeadingSlash(url)).toBe(url);
        });
    });

    describe('stripBasename', () => {
        it('skips when no base name', () => {
            const url = '/this-is/some-url/more';

            for (const base of ['', 0, null, undefined, false]) {
                expect(stripBasename(base, url)).toBe(url);
            }
        });

        it('skips when base is not part of url', () => {
            const url = '/this-is/some-url/more';

            for (const base of ['/that-is-not',  '/some-url', '/more', 'more', 'is']) {
                expect(stripBasename(base, url)).toBe(url);
            }
        });

        it("strips base when it exists", () => {
            const url = '/this-is/some-url/more';

            for (const base of ['/this-is',  '/this-is/some-url']) {
                expect(stripBasename(base, url)).toBe(url.substr(base.length));
            }
        });
    });

    describe('withBase', () => {
        it('appends base containing leading slash', () => {
            const url = '/this-is/some-url/more';

            for (const base of ['/kldjslkfj', '/base', '/other', '/longer/base/path']) {
                expect(withBase(base, url)).toBe(base + url);
            }
        });

        it('appends base without leading slash', () => {
            const url = '/this-is/some-url/more';

            for (const base of ['kldjslkfj', 'base', 'other', 'longer/base/path']) {
                expect(withBase(base, url)).toBe('/' + base + url);
            }
        });

        it('strips multiple slashes', () => {
            const url = '/this-is/some-url/more';

            for (const base of ['/kldjslkfj/', '////', 'other/', '/longer////base/path/']) {
                expect(withBase(base, url)).toBe(('/' + base + url).replace(/\/{2,}/g, '/'));
            }
        });
    });

    describe('getStringValues', () => {
        it('returns only string values from object', () => {
            const result = getStringValues({ a: 'sad', b: 0, c: null, d: {}, e: [], f: () => 'asd' });

            expect(result).toContain('sad');
            expect(result.length).toBe(1);
        });
    });

    describe('configOrProp', () => {
        it('picks config value when prop is not configured', () => {
            const config = {
                props: {
                    neededProp: false
                },

                neededProp: 'configValue'
            };

            const props = {
                neededProp: 'propValue'
            };

            const result = configOrProp(config, props, 'neededProp');

            expect(result).toBe('configValue');
        });

        it('picks config value when prop is configured but not set', () => {
            const config = {
                props: {
                    neededProp: 'customPropName'
                },

                neededProp: 'configValue'
            };

            const props = {

            };

            const result = configOrProp(config, props, 'neededProp');

            expect(result).toBe('configValue');
        });

        it('picks prop value when configured and prop is set', () => {
            const config = {
                props: {
                    neededProp: 'customPropName'
                },

                neededProp: 'configValue'
            };

            const props = {
                customPropName: 'propValue'
            };

            const result = configOrProp(config, props, 'neededProp');

            expect(result).toBe('propValue');
        });
    });

    describe('buildProps', () => {
        it('interpolates props config with schema values', () => {
            const props = {
                activeClassName: 'this is not in schema',
                to: 'to',
                global: 'sthElse',
                replace: 'something',
                exact: false
            };

            const schema = {
                to: {},
                global: () => 'asd',
                replace: {},
                exact: {}
            };

            const result = buildProps(props, schema);

            expect(result).toMatchObject({
                to: schema.to,
                sthElse: schema.global,
                something: schema.replace,
            });

            expect(result.to).toBe(schema.to);
            expect(result.sthElse).toBe(schema.global);
            expect(result.something).toBe(schema.replace);
        });
    });
});
