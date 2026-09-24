/**
 * The small icons that sit next to each link in the sidebar.
 *
 * They live in assets/ because the sidebar is shared between the manager
 * dashboard, the admin page and the user pages, and each of those wants a
 * different icon. The sidebar takes whichever one it is given as a prop rather
 * than deciding for itself.
 *
 * All of them are written out by hand as SVG so the app does not need an icon library
 * installed. fill="currentColor" means each icon takes the colour of the text
 * beside it, so it lights up on hover along with the label.
 */

// Three bars of different heights - a tiny bar chart. Used by the manager
// dashboard, whose sections are all charts.
export function ManagementBarIcon() {
    return (
        <svg className="management-sidebar-icon" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="9" width="3.5" height="6" rx="1" />
            <rect x="6.25" y="5" width="3.5" height="10" rx="1" />
            <rect x="11.5" y="1" width="3.5" height="14" rx="1" />
        </svg>
    );
}

// Four small squares in a grid. This is the same icon the home page already
// uses on its Admin tile, so the admin page's rail matches the way in.
export function ManagementGridIcon() {
    return (
        <svg className="management-sidebar-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 2h5v5H2V2Zm7 0h5v5H9V2ZM2 9h5v5H2V9Zm7 0h5v5H9V9Z" />
        </svg>
    );
}

// A hammer tilted at 45 degrees. The same drawing as the home page's
// "User Tool View" tile, so the user pages' rail matches the way in.
export function ManagementHammerIcon() {
    return (
        <svg className="management-sidebar-icon" viewBox="0 0 16 16" aria-hidden="true">
            {/* Draw the hammer standing upright, then tilt the whole group 45
                degrees around the middle of the square (8, 8). */}
            <g transform="rotate(45 8 8)">
                <rect x="6.9" y="5.5" width="2.2" height="10.5" rx="1.1" />
                <rect x="2.75" y="2" width="10.5" height="4.25" rx="1.1" />
            </g>
        </svg>
    );
}

// A calendar. The same drawing as the home page's "Your Reservations" tile.
export function ManagementCalendarIcon() {
    return (
        <svg className="management-sidebar-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 1v1.5h6V1h1.5v1.5H14a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1.5V1H5Zm8.5 5h-11v8h11V6Z" />
        </svg>
    );
}
