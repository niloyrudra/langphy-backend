import { AchievementUnlockedHandler } from "./handlers/achievement-unlocked.handler.js";
import { LessonCompletedHandler } from "./handlers/lesson-completed.handler.js";
import { ReminderTriggeredHandler } from "./handlers/reminder-triggered.handler.js";
import { SessionCompletedHandler } from "./handlers/session-completed.handler.js";
import { StreakUpdatedHandler } from "./handlers/streak-updated.handler.js";
import { UserRegisteredHandler } from "./handlers/userCreatedHandler.js";

export interface NotificationEventHandler<TEvent> {
    supports( eventType: string ): boolean;
    handle( event: TEvent ): Promise<void>;
};

export const handlers: NotificationEventHandler<any>[] = [
    new UserRegisteredHandler(),
    new LessonCompletedHandler(),
    new SessionCompletedHandler(),
    new StreakUpdatedHandler(),
    new ReminderTriggeredHandler(),

    new AchievementUnlockedHandler()
];