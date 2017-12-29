// @flow
const nope = () => {
    throw new Error('You better no set props!')
};

const readOnlyOverrideProxy = <V>(overrides: { [string]: * } = {}, creators: { [string]: (V) => V } = {}) => <S: {}>(subject: S): S => new Proxy(subject, {
    get: (target, name) => {
        if (name in overrides) {
            return overrides[name];
        }

        if (name in creators) {
            return creators[name](target[name]);
        }

        return target[name];
    },
    set: nope,
    defineProperty: nope,
    deleteProperty: nope,
    preventExtensions: nope,
    setPrototypeOf: nope
});

export default readOnlyOverrideProxy;
