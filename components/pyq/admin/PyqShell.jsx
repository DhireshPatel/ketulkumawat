"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAccessToken, LOGIN_PATH } from "../../../lib/pyq/adminClient";

// Small tab bar + sign-in guard for the PYQ section. If your admin panel already has a
// sidebar / layout, add a "PYQ Management" link to it and delete the tab bar below.
// NOTE: this client check only avoids showing an empty screen. The real protection is
// requireAdmin() on every API route, which the browser cannot bypass.
const tabs = [
  { href: "/admin/pyq", label: "Dashboard", exact: true },
  { href: "/admin/pyq/exams", label: "Exams" },
  { href: "/admin/pyq/papers", label: "Question Papers" },
];

export default function PyqShell({ children }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAccessToken().then((t) => {
      if (!t) window.location.href = LOGIN_PATH;
      else setReady(true);
    });
  }, []);

  if (!ready)
    return (
      <p className="muted" style={{ padding: 24 }}>
        Checking sign-in…
      </p>
    );

  return (
    <div className="pyq-admin">
      <nav className="pyq-tabs" aria-label="PYQ management">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
        <Link href="/pyq" target="_blank" className="tab-right">
          View public PYQ ↗
        </Link>
      </nav>
      {children}
    </div>
  );
}
