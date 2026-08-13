# Legacy → Production Migration Notes

The uploaded source was a single HTML application with Firebase SDK references, a Search Console verification tag, localStorage state, an owner email list, activity CRUD, calendar/task/exam views and a Pomodoro timer.

The main security issue in the old owner/VIP pattern was that authorization was decided in browser JavaScript. A visitor could change localStorage or JavaScript state. The new structure moves the authoritative VIP decision to Firebase callable functions and Firestore.

The legacy source is retained unchanged in `legacy/original-my-study-planner.html` for rollback/reference.

The existing 5,000-line StudyFlow planner is retained as the UI base instead of discarding the user's previous work. The enhancement layer is modular and can be expanded without turning the whole project back into one unmaintainable file.
