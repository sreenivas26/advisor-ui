import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import Link from React Router
import "./TableComponent.css";
import axios from "axios";
import Layout from "../Layout/Layout";
import { Content } from "@carbon/react";
import { Loading } from "@carbon/react";
// Define an interface for the transformed data structure
interface TransformedDataItem {
  host: string;
  port: number[];
  dns: string[];
  cp_name: string[];
  type: string[];
  cp_version: string[];
  ciphersuites: { name: string; security: string }[]; // Updated to an array of objects
  // Add other properties here
}

const HostDetails: React.FC = () => {
  const [transformedData, setTransformedData] = useState<TransformedDataItem[]>(
    []
  ); // Annotate data with the defined interface
  const { id } = useParams<{ id: string }>();

  const apiUrl = process.env.REACT_APP_PANDAS_OLAP_API + "/pandas/newdata/";
  useEffect(() => {
    const fetchDataFromSwaggerAPI = async () => {
      try {
        const requestData = {
          group_by: ["host", "port"],
          where_by: {
            column: "host",
            operator: "=",
            value: `${id}`,
          },
          sort_by: {},
          slice_by: {},
          //"dice_by": ["host", "port", "dns", "cp_name", "type", "cp_version", "cs_name", "security"],
          page_by: {
            current_page: 1,
            records_per_page: 10,
          },
          fetch_by: "SQL",
        };

        axios
          .post(apiUrl, requestData)
          .then((response) => {
            // Handle success
            console.log("Response:", response.data);
            // Group data by "host"
            const data = response.data.data;
            if (Array.isArray(data)) {
              const groupedData = data.reduce((groups: any, item: any) => {
                const host = item.host;
                if (!groups[host]) {
                  groups[host] = {
                    host: host,
                    port: [],
                    dns: [],
                    cp_name: [],
                    type: [],
                    cp_version: [],
                    ciphersuites: [], // Combined cs_name and security
                    // Add other properties here
                  };
                }
                const group = groups[host];

                // Helper function to ensure unique values
                const addToUniqueCSV = (array: any[], value: any) => {
                  if (Array.isArray(array)) {
                    if (!array.includes(value)) {
                      array.push(value);
                    }
                  }
                };
                addToUniqueCSV(group.port, item.port);
                addToUniqueCSV(group.dns, item.dns);
                addToUniqueCSV(group.cp_name, item.cp_name);
                addToUniqueCSV(group.type, item.type);
                addToUniqueCSV(group.cp_version, item.cp_version);
                // Add other properties here
                // Combine cs_name and security as an object
                const ciphersuiteObject = {
                  name: item.cs_name,
                  security: item.security,
                };
                // Check if the ciphersuiteObject is already present in the group's ciphersuites array
                const isCiphersuiteDuplicate = group.ciphersuites.some(
                  (cs: any) =>
                    cs.name === ciphersuiteObject.name &&
                    cs.security === ciphersuiteObject.security
                );

                // If not a duplicate, add it to the group's ciphersuites array
                if (!isCiphersuiteDuplicate) {
                  group.ciphersuites.push(ciphersuiteObject);
                }
                console.log("ciphersuites", ciphersuiteObject);
                //addToUniqueCSV(group.ciphersuites, ciphersuiteObject);
                return groups;
              }, {});
              console.log("groupedData-------", groupedData);
              setTransformedData(Object.values(groupedData));
            } // if close
          }) //then close
          .catch((error) => {
            // Handle error
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error calling Swagger API:", error);
      }
    };

    // Call the function to fetch data when the component mounts
    fetchDataFromSwaggerAPI();
  }, [id, apiUrl]); // The empty dependency array ensures the useEffect runs only once (on component mount)
  return (
    <Layout>
      <Content id="main-content">
        <div className="table-container">
          <h2>Host Details</h2>
          <table>
            <tbody>
              {transformedData && transformedData.length ? (
                transformedData.map((item, index) => (
                  <tr key={index}>
                    <tr>
                      <th>Host</th>
                      <th>{item.host}</th>
                    </tr>
                    <tr>
                      <th>Port</th>
                      <th>{item.port.join(", ")}</th>
                    </tr>
                    <tr>
                      <th>Domain</th>
                      <th>{item.dns.join(", ")}</th>
                    </tr>
                    <tr>
                      <th>Protocol</th>
                      <th>{item.type.join(", ")}</th>
                    </tr>
                    <tr>
                      <th>Version</th>
                      <th>{item.cp_version.join(", ")}</th>
                    </tr>
                    <tr>
                      <th>Ciphersuite</th>
                      {item.ciphersuites && item.ciphersuites.length ? (
                        item.ciphersuites.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td
                              style={{
                                color:
                                  item.security === "MEDIUM"
                                    ? "orange"
                                    : item.security === "HIGH"
                                    ? "green"
                                    : item.security === "LOW"
                                    ? "red"
                                    : "black", // Default color if none of the conditions match
                              }}
                            >
                              {item.security}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <p>No data...</p>
                      )}
                    </tr>
                  </tr>
                ))
              ) : (
                <Loading></Loading>
              )}
            </tbody>
          </table>
          <br />
        </div>
      </Content>
    </Layout>
  );
};

export default HostDetails;
