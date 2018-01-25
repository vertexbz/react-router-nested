// @flow
import { createPath } from 'history';

import type { LocationType } from './types';

export const addLeadingSlash = (path: string): string => {
    return path.charAt(0) === '/' ? path : '/' + path;
};

export const stripBasename = (basename: string, location: string): string => {
    if (!basename || basename === '') {
        return location;
    }

    if (location.indexOf(basename) !== 0) {
        return location;
    }

    return location.substr(basename.length);
};

export const createURL = (location: LocationType | string): string =>
    typeof location === 'string' ? location : createPath(location);

export const withBase = (base: string, path: LocationType | string): string => addLeadingSlash(base + createURL(path)).replace(/\/{2,}/g, '/');

export const getStringValues = (obj: {}): Array<string> => (Object.values(obj): any).filter((value: *): boolean => typeof value === 'string');

export const buildProps = (obj: {}, schema: {}): {} => {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (key in schema && typeof value === 'string') {
            result[value] = schema[key];
        }
    }

    return result;
};

export const configOrProp = <K: string, P: { [K]: * }>(config: { props: { [string]: any } } & P, props: P, key: K): * => {
    const propName = config.props[key];
    if (typeof propName === 'string' && propName in props) {
        return props[propName];
    }

    return config[key];
};
