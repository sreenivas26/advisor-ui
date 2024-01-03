import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import Link from React Router
import "./TableComponent.css";
import axios from "axios";
import Layout from "../Layout/Layout";
import { Content } from "@carbon/react";
import { Loading } from "@carbon/react";

interface TransformedDataItem {
  cs_name: string;
  host: string[];
  port: number[];
  dns: string[];
  cp_name: string[];
  type: string[];
  cp_version: string[];
  security: string[];
}

const CiphersuitDetails: React.FC = () => {
  const [transformedData, setTransformedData] = useState<TransformedDataItem[]>(
    []
  );
  const { id } = useParams<{ id: string }>();
  console.log("id------", id);
  const apiUrl = process.env.REACT_APP_PANDAS_OLAP_API + "/pandas/newdata/";
  useEffect(() => {
    const fetchDataFromSwaggerAPI = async () => {
      try {
        console.log("id------", id);
        const requestData = {
          group_by: ["host", "port"],
          where_by: {
            column: "cs_name",
            operator: "=",
            value: `${id}`,
          },
          sort_by: {},
          slice_by: {},

          page_by: {
            current_page: 1,
            records_per_page: 10,
          },
          fetch_by: "SQL|MEM",
        };

        axios
          .post(apiUrl, requestData)
          .then((response) => {
            console.log("Response:", response.data.data);

            const data = response.data.data;
            if (Array.isArray(data)) {
              const groupedData = data.reduce((groups: any, item: any) => {
                const ciphersuiteName = item.cs_name;
                if (!groups[ciphersuiteName]) {
                  groups[ciphersuiteName] = {
                    cs_name: ciphersuiteName,
                    host: [],
                    port: [],
                    dns: [],
                    cp_name: [],
                    type: [],
                    cp_version: [],
                    security: [],
                  };
                }

                const group = groups[ciphersuiteName];

                const addToUniqueCSV = (array: any[], value: any) => {
                  if (Array.isArray(array)) {
                    if (!array.includes(value)) {
                      array.push(value);
                    }
                  }
                };
                addToUniqueCSV(group.host, item.host);
                addToUniqueCSV(group.port, item.port);
                addToUniqueCSV(group.dns, item.dns);
                addToUniqueCSV(group.cp_name, item.cp_name);
                addToUniqueCSV(group.type, item.type);
                addToUniqueCSV(group.cp_version, item.cp_version);
                addToUniqueCSV(group.security, item.security);

                return groups;
              }, {});
              console.log("groupedData-------", groupedData);
              setTransformedData(Object.values(groupedData));
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error calling Swagger API:", error);
      }
    };

    // Call the function to fetch data when the component mounts
    fetchDataFromSwaggerAPI();
  }, [id, apiUrl]);
  console.log("transformedData------+++++++", transformedData);
  return (
    <Layout>
      <Content id="main-content">
        <div className="table-container">
          <h2>Ciphersuite Details</h2>
          <table>
            <tbody>
              {transformedData && transformedData.length ? (
                transformedData.map((item, index) => (
                  <tr key={index}>
                    <tr>
                      <th>Ciphersuite</th>
                      <th>{item.cs_name}</th>
                    </tr>
                    <tr>
                      <th>Host</th>
                      <th>{item.host.join(", ")}</th>
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
                      <th>Strength</th>
                      <th
                        style={{
                          color:
                            item.security.join(", ") === "MEDIUM"
                              ? "orange"
                              : item.security.join(", ") === "HIGH"
                              ? "green"
                              : item.security.join(", ") === "LOW"
                              ? "red"
                              : "black", // Default color if none of the conditions match
                        }}
                      >
                        {item.security.join(", ")}
                      </th>
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

export default CiphersuitDetails;
