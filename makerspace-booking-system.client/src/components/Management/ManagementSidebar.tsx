/**
 * The dark navigation rail down the left of a dashboard.
 *
 * Shared by the manager dashboard and the admin page. It draws the rail and
 * nothing else - it does not know which sections exist, which one is open or
 * what happens when one is clicked. All of that is handed in as props, which
 * is what lets one component serve two pages that navigate in different ways.
 *
 * Props:
 * - heading    the small grey word above the links ("Dashboard" or "Admin")
 * - items      the sections to list, in order
 * - activeId   the id of the section currently on screen, so it can be highlighted
 * - onSelect   called with an id when a button item is clicked
 * - icon       the picture to draw beside any link that has no icon of its own
 * - pageLinks  extra links out to other pages, drawn underneath
 */

import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

/*
 * One entry in the rail.
 *
 * The optional `to` is what decides how it behaves. The manager dashboard
 * changes the address bar, so its items carry a `to` and become real links.
 * The admin page keeps its open section in a variable instead, so its items
 * have no `to` and become buttons that call onSelect. Both look identical.
 *
 * The optional `icon` lets one item have its own picture. The user pages use
 * this so each link has a different icon. If an item has no icon, the rail's
 * shared `icon` prop is used instead, so the manager and admin rails are unchanged.
 */
export type SidebarItem = {
    id: string;
    label: string;
    to?: string;
    icon?: ReactNode;
};

type Props = {
    heading: string;
    items: SidebarItem[];
    activeId: string;
    onSelect?: (id: string) => void;
    icon: ReactNode;
    pageLinks?: { label: string; to: string }[];
};

function ManagementSidebar({ heading, items, activeId, onSelect, icon, pageLinks = [] }: Props) {
    // Both kinds of item share the same classes, so the two pages look the same.
    const classFor = (item: SidebarItem) =>
        item.id === activeId
            ? 'management-sidebar-link management-sidebar-link--active'
            : 'management-sidebar-link';

    return (
        <aside className="management-sidebar">
            <div className="management-sidebar-brand">
                <span className="management-sidebar-mark">M</span>
                <span className="management-sidebar-name">Makerspace</span>
            </div>

            <p className="management-sidebar-heading">{heading}</p>

            <nav className="management-sidebar-nav" aria-label={`${heading} sections`}>
                {items.map((item) =>
                    item.to === undefined ? (
                        <button
                            key={item.id}
                            type="button"
                            className={classFor(item)}
                            /*
                             * onSelect is optional, so the ?. guards against it
                             * being missing. Without it, a page that forgot to
                             * pass one would crash on the first click.
                             */
                            onClick={() => onSelect?.(item.id)}
                        >
                            {item.icon ?? icon}
                            {item.label}
                        </button>
                    ) : (
                        <NavLink key={item.id} to={item.to} className={classFor(item)}>
                            {item.icon ?? icon}
                            {item.label}
                        </NavLink>
                    )
                )}
            </nav>

            {/*
              * Links that leave this dashboard for another page. They start with
              * "/" so they go to /user, not /management/user.
              */}
            {pageLinks.length > 0 && (
                <nav className="management-sidebar-pages" aria-label="Other pages">
                    {pageLinks.map((page) => (
                        <Link
                            key={page.to}
                            to={page.to}
                            className="management-sidebar-heading management-sidebar-heading--link"
                        >
                            {page.label}
                        </Link>
                    ))}
                </nav>
            )}
        </aside>
    );
}

export default ManagementSidebar;
