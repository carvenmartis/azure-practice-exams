type LeaveGuard = () => boolean;

let activeGuard: LeaveGuard | null = null;

/**
 * Lets a page (the exam in progress) ask before the header and menu links
 * take the user away. The guard returns false to stop the navigation and
 * show its own prompt. Returns a cleanup that removes the guard.
 */
export function setLeaveGuard(guard: LeaveGuard) {
  activeGuard = guard;
  return () => {
    if (activeGuard === guard) activeGuard = null;
  };
}

/** True when in-app navigation may go ahead. */
export function canLeave() {
  return activeGuard ? activeGuard() : true;
}
