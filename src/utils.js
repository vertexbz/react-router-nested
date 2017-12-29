// @flow
import { createPath, parsePath } from 'history';
import readOnlyOverrideProxy from './proxy';

const addLeadingSlash = (path) => {
    return path.charAt(0) === '/' ? path : '/' + path;
};

export const stripBasename = (basename: string, location: string): string => {
    if (!basename) {
        return location;
    }

    if (location.indexOf(basename) !== 0){
        return location;
    }

    return location.substr(basename.length)
};

export const stripBasenameProxy = (basename: string, location: Location): Location => readOnlyOverrideProxy({}, {
    pathname: (pathname: string): string => stripBasename(basename, pathname)
})(location);


const createURL = (location: Location | string): string =>
    typeof location === 'string' ? location : createPath(location);


export const withBase = (base: string, path: Location | string): string => addLeadingSlash(base + createURL(path));
