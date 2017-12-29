// @flow
import { createPath } from 'history';

import type { LocationType } from './types';

const addLeadingSlash = (path: string): string => {
    return path.charAt(0) === '/' ? path : '/' + path;
};

export const stripBasename = (basename: string, location: string): string => {
    if (!basename) {
        return location;
    }

    if (location.indexOf(basename) !== 0) {
        return location;
    }

    return location.substr(basename.length);
};

const createURL = (location: LocationType | string): string =>
    typeof location === 'string' ? location : createPath(location);

export const withBase = (base: string, path: LocationType | string): string => addLeadingSlash(base + createURL(path));

export const convertTrueProps = <O: {}>(obj: O, replacements: $Shape<O> = {}): O => {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value === true) {
            if (key in replacements) {
                result[key] = replacements[key];
            } else {
                result[key] = key;
            }
        } else {
            result[key] = value;
        }
    }

    return result;
};

type PropsConfig = {|+[string]: ?string|};

type PropsSchema = {|+[string]: mixed|};

export const configureProps = (propsSchema: PropsSchema, config: PropsConfig): PropsSchema => {
    const result = {};
    for (const [key, value] of Object.entries(propsSchema)) {
        if (key in config && config[key]) {
            result[config[key]] = value;
        }
    }

    return result;
};