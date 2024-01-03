import React from "react";
import { Content } from "@carbon/react";
import Layout from "../Layout/Layout";

// Define the prop types for the ComplianceDetails component
interface ComplianceDetailsProps {
  // Define your prop types here if needed
}

// Use the prop types in the function parameters
const ComplianceDetails: React.FC<ComplianceDetailsProps> = (props) => {
  return (
    <Layout>
      <Content id="main-content">Risk Details</Content>
    </Layout>
  );
};

export default ComplianceDetails;
