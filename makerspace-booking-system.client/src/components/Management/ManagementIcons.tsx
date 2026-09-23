/**
 * The small icons that sit next to each link in the sidebar.
 *
 * They live in their own file because the sidebar is now shared between the
 * manager dashboard and the admin page, and each of those wants a different
 * icon. The sidebar takes whichever one it is given as a prop rather than
 * deciding for itself.
 *
 * Both are written out by hand as SVG so the app does not need an icon library
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
