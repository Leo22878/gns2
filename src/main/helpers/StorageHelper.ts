import { existsSync, mkdirSync } from 'fs';
import { cp, rename, rm } from 'fs/promises';
import { homedir } from 'os';
import { resolve } from 'path';

import { appPath } from '@config';
import { app } from 'electron';

import { PlatformHelper } from './PlatformHelper';

export class StorageHelper {
    static storageDir: string;
    static assetsDir: string;
    static clientsDir: string;
    static librariesDir: string;
    static javaDir: string;

    static {
        this.storageDir = this.getPlatformStorageDir();

        this.resolveDirs();

        if (!existsSync(this.storageDir)) mkdirSync(this.storageDir);
        if (!existsSync(this.assetsDir)) mkdirSync(this.assetsDir);
        if (!existsSync(this.clientsDir)) mkdirSync(this.clientsDir);
        if (!existsSync(this.librariesDir)) mkdirSync(this.librariesDir);
        if (!existsSync(this.javaDir)) mkdirSync(this.javaDir);
    }

    static resolveDirs() {
        this.assetsDir = resolve(this.storageDir, 'assets');
        this.clientsDir = resolve(this.storageDir, 'clients');
        this.librariesDir = resolve(this.storageDir, 'libraries');
        this.javaDir = resolve(this.storageDir, 'java');
    }

    private static getPlatformStorageDir() {
        if (PlatformHelper.isMac) {
            return resolve(app.getPath('userData'), '../', appPath);
        }
        return resolve(homedir(), appPath);
    }

    static async move(src: string, dest: string) {
        try {
            await rename(src, dest);
        } catch (error: any) {
            if (error.code !== 'EXDEV') {
                throw error;
            }
            await cp(src, dest, { recursive: true });
            return rm(src, { recursive: true, force: true });
        }
    }
}
