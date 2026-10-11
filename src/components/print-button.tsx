"use client";
export function PrintButton() { return <button onClick={() => window.print()} className="btn-outline print:hidden">Print invoice</button>; }
