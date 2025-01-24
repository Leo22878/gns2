import os from 'os';
import { join } from 'path';

import Store from 'electron-store';

import { SettingsFormat } from '../../common/types';
import { LogHelper } from './LogHelper';
import { StorageHelper } from './StorageHelper';

export class SettingsHelper {
    static store: any;

    static {
        this.store = new Store({
            cwd: StorageHelper.storageDir,
            defaults: {
                client: this.defaultsValue(),
            },
        });

        const dir = this.store.get('client.dir');
        if (dir && dir !== StorageHelper.storageDir) {
            StorageHelper.storageDir = dir;
            StorageHelper.resolveDirs();
        }
    }

    static async migration(path: string) {
        await StorageHelper.move(StorageHelper.assetsDir, join(path, 'assets'));
        await StorageHelper.move(
            StorageHelper.clientsDir,
            join(path, 'clients'),
        );
        await StorageHelper.move(
            StorageHelper.librariesDir,
            join(path, 'libraries'),
        );
        await StorageHelper.move(StorageHelper.javaDir, join(path, 'java'));
        StorageHelper.storageDir = path;
        StorageHelper.resolveDirs();

        this.setField('dir', path);
        LogHelper.info('Migration completed successfully');
    }

    static defaultsValue(): SettingsFormat {
        return {
            token: '',
            dir: StorageHelper.storageDir,
            autoConnect: false,
            fullScreen: false,
            memory: 1024,
            startDebug: false,
        };
    }

    static getStore() {
        return this.store;
    }

    static getAllFields(): SettingsFormat {
        return this.getStore().get('client');
    }

    static getField(name: string) {
        return this.getStore().get('client.' + name);
    }

    static setField(field: string, value: string | boolean | number): void {
        return this.getStore().set('client.' + field, value);
    }

    static getTotalMemory(): number {
        const remainingMemMegabytes = Math.floor(os.totalmem() / 1024 ** 2) / 2;

        return (
            remainingMemMegabytes -
            (remainingMemMegabytes % 1024) +
            (remainingMemMegabytes % 1024 ? 1024 : 0)
        );
    }
}
