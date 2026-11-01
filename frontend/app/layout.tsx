/* app/layout.tsx */
import './globals.css'
import React from 'react'


export const metadata = {
title: 'Centralign - AI Forms',
description: 'AI generated dynamic forms with context-aware memory'
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
<h1>Centralign</h1>
<nav>
<a href="/">Dashboard</a> | <a href="/forms/new">Create Form</a>
</nav>
</header>
{children}
</div>
</body>
</html>
)
}