"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";

const stages = [
  { num: 1, name: "Create Indent" },
  { num: 2, name: "Indent Approval" },
  { num: 3, name: "Update 3 Vendors" },
  { num: 4, name: "Negotiation" },
  { num: 5, name: "PO Entry" },
  { num: 6, name: "Follow-Up Vendor" },
  { num: 7, name: "Material Received" },
  { num: 8, name: "QC Requirement" },
  { num: 9, name: "Receipt in Tally" },
  { num: 10, name: "Submit Invoice" },
  { num: 11, name: "Verification" },
  { num: 12, name: "Vendor Payment" },
  { num: 13, name: "Purchase Return" },
  { num: 14, name: "Freight Payments" },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  user,
  onLogout,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: string | null;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Purchase Workflow
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 overflow-y-auto h-full">
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-sidebar-foreground mb-6">
              Purchase Workflow
            </h1>
          </div>

          {/* Dashboard Button */}
          <Button
            variant={currentPage === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start mb-4"
            onClick={() => {
              onNavigate("dashboard");
              setIsOpen(false);
            }}
          >
            Dashboard
          </Button>

          {/* Stage Buttons */}
          <div className="space-y-1">
            {stages.map((stage) => (
              <Button
                key={stage.num}
                variant={
                  currentPage === `stage-${stage.num}` ? "default" : "ghost"
                }
                className="w-full justify-start text-sm transition-colors duration-200"
                onClick={() => {
                  onNavigate(`stage-${stage.num}`);
                  setIsOpen(false);
                }}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold mr-2">
                  {stage.num}
                </span>
                <span className="truncate">{stage.name}</span>
              </Button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="mt-auto pt-6 border-t border-sidebar-border">
            <div className="px-3 py-2 mb-3">
              <p className="text-sm text-sidebar-foreground/80">
                Logged in as: <span className="font-medium">{user}</span>
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-sm border-sidebar-border hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
