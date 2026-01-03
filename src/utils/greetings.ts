export type GreetingContext =
    | 'default'
    | 'streak'
    | 'missed'
    | 'first'
    | 'near_completion'
    | 'complete';

const GREETINGS = {
    default: [
        "Hi {name}",
        "Welcome back, {name}",
        "Good to see you, {name}",
        "Ready when you are, {name}",
        "One day at a time, {name}",
        "Let’s continue, {name}",
        "Today matters, {name}",
        "Back again, {name}"
    ],
    streak: [
        "Still going, {name}",
        "Staying consistent, {name}",
        "Showing up again, {name}",
        "Keeping the line, {name}",
        "Continuing on, {name}",
        "Another solid day, {name}",
        "Still on track, {name}",
        "Holding steady, {name}"
    ],
    missed: [
        "Today is a new day, {name}",
        "Back to it, {name}",
        "Today counts, {name}",
        "Let’s just do today, {name}",
        "Pick it up here, {name}",
        "One step today, {name}"
    ],
    first: [
        "Let’s begin, {name}",
        "Day one starts here, {name}",
        "This is the start, {name}",
        "Ready to begin, {name}"
    ],
    near_completion: [
        "You’re close now, {name}",
        "Almost there, {name}",
        "This is the final stretch, {name}",
        "You’ve carried this far, {name}",
        "Keep it together, {name}",
        "Nearly finished, {name}",
        "Stay with it, {name}",
        "You’re seeing this through, {name}",
        "The end is in sight, {name}",
        "Finish what you started, {name}",
        "You’re doing this, {name}",
        "Still steady, {name}",
        "Right here at the end, {name}",
        "One of the last days, {name}",
        "You’ve stayed the course, {name}",
        "Be proud of the work, {name}",
        "This mattered, {name}",
        "You kept your word, {name}"
    ],
    complete: [
        "You finished it, {name}",
        "This is complete, {name}",
        "You saw this through, {name}",
        "One year, finished, {name}",
        "You kept your word, {name}"
    ]
};

export const getGreeting = (
    userName: string | null | undefined,
    logs: Map<string, any>,
    resolutionStartDate: string | undefined
): string => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Calculate total completed days (exclude paused)
    let completedDays = 0;
    logs.forEach(log => {
        // legacy logs might not have status, assume 'completed'
        if (!log.status || log.status === 'completed') {
            completedDays++;
        }
    });

    // Determine Streak Status (Paused days maintain streak but don't count)
    let streakActive = false;
    let checkDate = new Date(yesterday);

    // Check back up to X days to find continuity
    for (let i = 0; i < 365; i++) {
        const checkStr = checkDate.toISOString().split('T')[0];
        // Stop if we go before start of logs? 
        // We rely on logs map.

        const log = logs.get(checkStr);
        if (!log) {
            // Found a hole -> Streak broken
            streakActive = false;
            break;
        }

        if (log.status === 'paused') {
            // Paused day -> Ignored, check previous day
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
        }

        // If we found a completed day (or legacy day without status)
        streakActive = true;
        break;
    }

    // Determine Context
    let context: GreetingContext = 'default';

    // 6. FULL COMPLETION (Day 365)
    if (completedDays >= 365) {
        context = 'complete';
    }
    // 5. NEAR COMPLETION (Last 10-15% ~ last 45 days i.e., > 320 days)
    else if (completedDays > 320) {
        context = 'near_completion';
    }
    // 4. FIRST DAY (No logs yet)
    else if (completedDays === 0) {
        context = 'first';
    }
    // 3. MISSED DAY (Streak broken, but started)
    else if (!streakActive && completedDays > 0) {
        context = 'missed';
    }
    // 2. STREAK ACTIVE (Found continuity)
    else if (streakActive) {
        context = 'streak';
    }

    // Fallback to default
    if (!context) context = 'default';

    // Select random greeting from category
    const options = GREETINGS[context];
    // Simple deterministic rotation based on day of year to "rotate slowly" 
    // or just random for now as "per app open" usually implies fresh check.
    // Let's use random for session freshness.
    const template = options[Math.floor(Math.random() * options.length)];

    // Format name
    if (userName && userName.trim().length > 0) {
        return template.replace('{name}', userName).trim();
    } else {
        // Remove ", {name}" or " {name}" parts if name is missing
        return template.replace(/, {name}/g, '').replace(/ {name}/g, '').trim() + '.';
        // Note: The templates have punctuation inside the replace logic or at end?
        // Actually, most templates are "Text, {name}"
        // If we remove ", {name}", we are left with "Text"
        // Most templates don't end in period in the list, so we might need to be careful.
        // Let's handle clean removal.
        // "Still going, {name}" -> "Still going"
        // "Hi {name}" -> "Hi"
    }
};
