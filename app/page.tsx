"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/components/dashboard";
import Footer from "@/components/footer";
import LoginPage from "@/components/login-page";
import { WorkflowProvider } from "@/lib/workflow-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Stage1 from "@/components/stages/stage-1";
import Stage2 from "@/components/stages/stage-2";
import Stage3 from "@/components/stages/stage-3";
import Stage4 from "@/components/stages/stage-4";
import Stage5 from "@/components/stages/stage-5";
import Stage6 from "@/components/stages/stage-6";
import Stage7 from "@/components/stages/stage-7";
import Stage8 from "@/components/stages/stage-8";
import Stage9 from "@/components/stages/stage-9";
import Stage10 from "@/components/stages/stage-10";
import Stage11 from "@/components/stages/stage-11";
import Stage12 from "@/components/stages/stage-12";
import Stage13 from "@/components/stages/stage-13";
import Stage14 from "@/components/stages/stage-14";

type Page = "dashboard" | `stage-${number}`;

const stageComponents = [
  Stage1,
  Stage2,
  Stage3,
  Stage4,
  Stage5,
  Stage6,
  Stage7,
  Stage8,
  Stage9,
  Stage10,
  Stage11,
  Stage12,
  Stage13,
  Stage14,
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { isAuthenticated, login, logout, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <WorkflowProvider>
      <div className="flex flex-col h-screen bg-background">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            user={user}
            onLogout={logout}
          />
          <main className="flex-1 overflow-auto pt-16 lg:pt-0">
            {currentPage === "dashboard" && <Dashboard />}
            {currentPage.startsWith("stage-") && (
              <StageRenderer stage={Number.parseInt(currentPage.split("-")[1])} />
            )}
          </main>
        </div>
        <Footer />
      </div>
    </WorkflowProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function StageRenderer({ stage }: { stage: number }) {
  const StageComponent = stageComponents[stage - 1];

  if (!StageComponent) {
    return <div className="p-6">Stage not found</div>;
  }

  return <StageComponent />;
}
