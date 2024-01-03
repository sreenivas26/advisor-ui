import React from "react";
import Layout from "./Layout/Layout";

import UserTable from "./Tables/UserTable";

import ScanTable from "./Tables/ScanTable";
import ApplicationView from "./Tables/ApplicationView";
import ComplianceView from "./Tables/ComplianceView";

import CryptoInventoryTable from "./Tables/CryptoInventoryTable";
import { useParams } from "react-router-dom";
import { Content } from "@carbon/react";

const DashboardComponent: React.FC = () => {
  const { selectedContent } = useParams<{ selectedContent: string }>();

  const renderSelectedComponent = () => {
    switch (selectedContent) {
      case "users":
        return <UserTable />;
      case "scan":
        return <ScanTable />;
      case "application":
        return <ApplicationView />;
      case "compliance":
        return <ComplianceView />;
      case "inventory":
        return <CryptoInventoryTable />;
      default:
        return <Content id="main-content"></Content>;
    }
  };

  return <Layout>{renderSelectedComponent()}</Layout>;
};

export default DashboardComponent;
