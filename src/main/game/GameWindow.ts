import { Service } from '@freshgum/typedi';

import { EVENTS } from '../../common/channels';
import { LoadProgress } from '../../common/types';
import { LauncherWindow } from '../core/LauncherWindow';

@Service([LauncherWindow])
export class GameWindow {
    constructor(private window: LauncherWindow) {}

    sendToConsole(text: string) {
        this.window.sendEvent(
            EVENTS.SCENES.SERVER_PANEL.TEXT_TO_CONSOLE,
            `${text}\n`,
        );
    }

    sendProgress(progress: LoadProgress) {
        this.window.sendEvent(
            EVENTS.SCENES.SERVER_PANEL.LOAD_PROGRESS,
            progress,
        );
    }

    stopGame() {
        this.window.sendEvent(EVENTS.SCENES.SERVER_PANEL.STOP_GAME);
    }
}
