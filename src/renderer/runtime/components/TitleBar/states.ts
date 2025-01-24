import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils'
import { window } from '@config';

import { getUserData } from '../../../utils';

export const titlebarBackBtn = atom({
    show: false,
});

export const titlebarLogout = atom({
    show: false,
});

export const titlebarSettingsBtn = atom({
    show: false,
});

export const titlebarTitle = atomWithReset({
    show: true,
    text: window.title,
});

export const titlebarUser = atom(
    getUserData().username || ''
);
