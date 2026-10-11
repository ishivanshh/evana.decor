"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export function AdminLogout() { return <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="mt-8 flex items-center gap-3 px-3 py-3 text-xs text-[#82776d]"><LogOut size={15} />Sign out</button>; }
