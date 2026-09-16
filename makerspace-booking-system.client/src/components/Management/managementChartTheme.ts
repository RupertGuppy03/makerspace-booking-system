/*
 * Shared colours and formatting for every chart on the manager dashboard.
 *
 * Recharts takes colours as plain strings rather than CSS classes, so they live
 * here in TypeScript instead of in the stylesheet. Keeping them in one file
 * means a chart never invents its own colour.
 */

export const CHART_COLOURS = {
    blue: '#4680ff',
    green: '#2fa47c',
    amber: '#e8933a',
    sky: '#4bb8f0',
    rose: '#e2596f',
    violet: '#8b7bd8',
    grey: '#d8dee8',
};

// Used when a chart needs a different colour per slice or bar, in this order.
export const CATEGORY_COLOURS = [
    CHART_COLOURS.blue,
    CHART_COLOURS.green,
    CHART_COLOURS.amber,
    CHART_COLOURS.sky,
    CHART_COLOURS.violet,
    CHART_COLOURS.rose,
];

// Axis and grid settings repeated by every cartesian chart.
export const AXIS = {
    tickLine: false,
    axisLine: false,
};

/**
 * Utilisation is the one number where the colour carries meaning rather than
 * decoration: a tool booked out more than 80% of the time is the signal that a
 * second unit is worth buying, and under 60% suggests one is sitting idle.
 */
export function utilisationColour(rate: number): string {
    if (rate >= 80) return CHART_COLOURS.rose;
    if (rate >= 60) return CHART_COLOURS.amber;
    return CHART_COLOURS.green;
}

// "$1,240" — no decimals, because nothing on this page needs cent precision.
export function formatMoney(amount: number): string {
    return '$' + Math.round(amount).toLocaleString();
}

// "87.4%"
export function formatPercent(rate: number): string {
    return rate.toFixed(1) + '%';
}

/*
 * Recharts hands tooltip and axis formatters a value it cannot narrow ahead of
 * time, so these accept anything and check the type themselves. Using them
 * keeps the charts free of type casts.
 */

export function moneyTick(value: unknown): string {
    return typeof value === 'number' ? formatMoney(value) : '';
}

export function moneyTooltip(value: unknown): string {
    return typeof value === 'number' ? formatMoney(value) : '—';
}

export function percentTooltip(value: unknown): string {
    return typeof value === 'number' ? formatPercent(value) : '—';
}

export function daysTooltip(value: unknown): string {
    return typeof value === 'number' ? `${value.toFixed(1)} days` : '—';
}

export function utilisationTooltip(value: unknown): string {
    return typeof value === 'number' ? `${formatPercent(value)} of days booked` : '—';
}

/**
 * The API sends periods as "Oct 25" (a month) or "15 Sep" (a week). A hyphen
 * reads as a date on an axis, where a space can look like two separate labels
 * that have run together.
 */
export function periodLabel(value: unknown): string {
    return typeof value === 'string' ? value.replace(' ', '-') : String(value ?? '');
}

/*
 * Time axes, for both weekly and monthly charts.
 *
 * The ticks are chosen by hand (see everyNthPeriod) rather than left to
 * Recharts, because its 'preserveStartEnd' setting forces the final label in
 * whether or not it is evenly spaced — which left an uneven gap at the end of a
 * chart. interval 0 tells Recharts to draw exactly the ticks it is given.
 */
export const PERIOD_AXIS = {
    ...AXIS,
    interval: 0,
    tickMargin: 8,
    tickFormatter: periodLabel,
};

/**
 * Picks which periods (weeks or months) get a label on a chart's axis.
 *
 * `step` is how many periods to move between labels — 2 on a full-width chart,
 * 3 on a half-width one, where twelve labels will not fit.
 *
 * It counts back from the end of the list rather than forward from the start,
 * so the gaps stay even AND the most recent period always keeps its label —
 * that is the one someone reading the dashboard looks at first.
 */
export function everyNthPeriod(periods: string[], step: number): string[] {
    return periods.filter((_, index) => (periods.length - 1 - index) % step === 0);
}

/*
 * Recharts centres the first and last label on the ends of the axis, so half of
 * each hangs outside the plotting area and gets clipped by the edge of the card.
 * A little margin on each side gives them room to sit.
 */
export const CHART_MARGIN = { top: 8, right: 30, bottom: 0, left: 0 };

// A faint highlight behind the hovered bar, instead of Recharts' heavy grey block.
export const BAR_CURSOR = { fill: 'rgba(16, 24, 40, 0.04)' };
