import { Profile, Server } from '@aurora-launcher/core';
import { Service } from '@freshgum/typedi';
import { promises as fs } from 'fs'; // Импортируем модуль для работы с файловой системой
import path from 'path'; // Импортируем модуль для работы с путями
import { StorageHelper } from '../helpers/StorageHelper'; // Импортируем StorageHelper
import { APIManager } from '../api/APIManager';
import { GameWindow } from './GameWindow';
import { LibrariesMatcher } from './LibrariesMatcher';
import { Starter } from './Starter';
import { Updater } from './Updater';
import { Watcher } from './Watcher';

@Service([APIManager, Updater, Watcher, Starter, GameWindow])
export class GameService {
    private selectedServer?: Server;
    private selectedProfile?: Profile;

    constructor(
        private apiService: APIManager,
        private gameUpdater: Updater,
        private gameWatcher: Watcher,
        private gameStarter: Starter,
        private gameWindow: GameWindow,
    ) {}

    async setServer(server: Server) {
        this.selectedServer = server;
        this.selectedProfile = await this.apiService.getProfile(
            server.profileUUID,
        );
    }

    getServer() {
        return this.selectedServer;
    }

    getProfile() {
        return this.selectedProfile;
    }

    /**
     * Очищает папку скинов перед запуском игры.
     */
    private async clearSkinsFolder(clientArgs: Profile) {
        const skinsPath = path.join(StorageHelper.storageDir, 'assets', 'skins'); // Правильный путь к папке скинов
        console.log('Путь к папке скинов:', skinsPath);
        try {
        // Проверяем, существует ли папка
        await fs.access(skinsPath);

        // Удаляем все содержимое папки
        await fs.rm(skinsPath, { recursive: true, force: true });

        console.log('Все содержимое папки скинов успешно удалено.');
    } catch (error) {
            if (error.code !== 'ENOENT') {
                this.gameWindow.sendToConsole(`Ошибка при очистке папки скинов: ${error}`);
            } else {
                this.gameWindow.sendToConsole('Папка скинов отсутствует, пропускаем удаление.');
            }
        }
    }

    async startGame() {
        const profile = this.selectedProfile;
        const server = this.selectedServer;

        if (!profile || !server) {
            this.gameWindow.sendToConsole('Error: Profile or server not set');
            this.gameWindow.stopGame();
            return;
        }

        // Очищаем папку скинов перед запуском игры
        await this.clearSkinsFolder(profile);

        const libraries = profile.libraries.filter((library) =>
            LibrariesMatcher.match(library.rules),
        );

        try {
            const gameFiles = await this.gameUpdater.validateClient(
                profile,
                libraries,
            );

            const { nativesFiles } = await this.gameStarter.prestart(profile);

            await this.gameWatcher.start(
                profile,
                libraries,
                nativesFiles,
                gameFiles,
            );

            const { gameProcess } = await this.gameStarter.start(
                profile,
                libraries,
                server,
                this.gameWatcher,
            );

            this.gameWatcher.setGameProcess(gameProcess);
        } catch (error) {
            this.gameWindow.sendToConsole(`${error}`);
            this.gameWindow.stopGame();
            throw error;
        }
    }
}
