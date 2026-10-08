import { countDailyAnswer, setDailyGoal } from './progress-store';
import { reportReminderProgress } from './reminders';

/** Counts an answered question towards today's goal and keeps the reminder up to date. */
export function recordDailyAnswer() {
  countDailyAnswer();
  reportReminderProgress();
}

/** Changes the daily goal and keeps the reminder up to date. */
export function changeDailyGoal(goal: number) {
  setDailyGoal(goal);
  reportReminderProgress();
}

/** Goals offered in Settings. */
export const dailyGoalChoices = [10, 20, 30, 50];
