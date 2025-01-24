import { ReactNode } from 'react';
import { atom } from 'jotai';

export const modalShow = atom(false);

export const modalTitle = atom('Modal title');

export const modalContent = atom(<ReactNode>'Modal content');
