"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import CashRegisterDisconnected from "./CashRegisterDisconnected";
import CashRegisterChecking from "./CashRegisterChecking";
import CashRegisterNotFound from "./CashRegisterNotFound";
import CashRegisterSearching from "./CashRegisterSearching";
import CashRegisterSelectDevice from "./CashRegisterSelectDevice";
import CashRegisterConfigSuccess from "./CashRegisterConfigSuccess";
import CashRegisterConfigError from "./CashRegisterConfigError";
import CashRegisterConnected from "./CashRegisterConnected";
import { CashRegisterSettingsModalProps, ViewState } from "./types";

export default function CashRegisterSettingsModal({ isOpen, onClose, onDisconnect }: CashRegisterSettingsModalProps) {
  const [viewState, setViewState] = useState<ViewState>("DISCONNECTED");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    if (isOpen) {
      setViewState("DISCONNECTED");
    }
  }, [isOpen]);

  useEffect(() => {
    if (viewState === "CHECKING" || viewState === "SEARCHING") {
      setLoadingProgress(10);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (viewState === "CHECKING") setViewState("SEARCHING");
            if (viewState === "SEARCHING") setViewState("SELECT_DEVICE");
            return 100;
          }
          return prev + 15;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [viewState]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={viewState !== "CONNECTED" ? "Cash Register Settings" : undefined}
      maxWidth="max-w-[600px]"
    >
      <div className="relative">
        {viewState === "DISCONNECTED" && (
          <CashRegisterDisconnected onConnect={() => setViewState("CHECKING")} />
        )}
        
        {viewState === "CHECKING" && (
          <CashRegisterChecking 
            loadingProgress={loadingProgress}
            onTestNotFound={() => setViewState("NOT_FOUND")}
          />
        )}
        
        {viewState === "NOT_FOUND" && (
          <CashRegisterNotFound onRetry={() => setViewState("SEARCHING")} />
        )}

        {viewState === "SEARCHING" && (
          <CashRegisterSearching loadingProgress={loadingProgress} />
        )}

        {viewState === "SELECT_DEVICE" && (
          <CashRegisterSelectDevice 
            ipAddress={ipAddress}
            setIpAddress={setIpAddress}
            onRescan={() => setViewState("CONFIG_ERROR")}
            onConfigure={() => setViewState("CONFIG_SUCCESS")}
          />
        )}

        {viewState === "CONFIG_SUCCESS" && (
          <CashRegisterConfigSuccess onTestPrint={() => setViewState("CONNECTED")} />
        )}

        {viewState === "CONFIG_ERROR" && (
          <CashRegisterConfigError onRetry={() => setViewState("SELECT_DEVICE")} />
        )}

        {viewState === "CONNECTED" && (
          <CashRegisterConnected 
            onClose={onClose}
            onDisconnect={() => {
              if (onDisconnect) {
                onDisconnect();
              } else {
                setViewState("DISCONNECTED");
              }
            }}
          />
        )}
      </div>
    </Modal>
  );
}
