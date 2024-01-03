/*
 * IBM Confidential
 * OCO Source Materials
 * 5747-SM3
 * © Copyright IBM Corp. 2022
 *
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import {
  Content,
  Button,
  Modal,
  TextInput,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Layer,
  ClickableTile,
  DataTableSkeleton,
  Link,
  Search,
  Loading,
} from "@carbon/react";
import { ArrowLeft } from "@carbon/react/icons";
import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import Link from React Router

import fileImportImg from "../../../assets/fileimport.png";
import QualysImport from "../../../assets/QuaIysIcon.png";
import UserService from "../../../service/UserService";

interface Row {
  scan_desc: string;
  plugin_name: string;
  plugin_type: string;
  user_email: string;
  updation_ts: string;
}

interface PluginRow {
  plugin_id: number;
  plugin_name: string;
  plugin_desc: string;
  plugin_type: string;
  creation_ts: string;
  updation_ts: string;
}
function ScanTable() {
  const { id } = useParams<{ id: string }>();
  const initialPlugin: PluginRow = {
    plugin_id: 1,
    plugin_name: "",
    plugin_desc: "",
    plugin_type: "",
    creation_ts: "",
    updation_ts: "",
  };
  const [filterString, setFilterString] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [pluginRows, setPluginRows] = useState<PluginRow[]>([]);
  const [selectedPlugin, setSelectedPluginData] =
    useState<PluginRow>(initialPlugin);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line
  const [configLoading, setConfigLoading] = useState(true);
  const batchActionProps = { shouldShowBatchActions: false };

  const addScanApiUrl =
    process.env.REACT_APP_METADATA_PLUGIN_API_URL + "/plugins/invokePlugin";
  const getAllScanapiUrl =
    process.env.REACT_APP_METADATA_READER_API_URL + "/api/getAllScanDetails";
  const getAllPluginApiUrl =
    process.env.REACT_APP_USER_SERVICES + "/getAllPlugins";
  const [apiUrl, setApiUrl] = useState("");
  const [apiUsername, setApiUsername] = useState("");
  const [apiPassword, setApiPassword] = useState("");
  const [scanSearchId, setScanSearchId] = useState("");
  const [fileName, setFileName] = useState("");
  const [scanDesc, setScanDesc] = useState("");

  const [connector, setConnector] = useState<any>(false);
  const [openInvokeScanModal, setInvokeScanModal] = useState(false);

  const handleInvokeScanClick = async () => {
    try {
      const response = await axios.get(getAllPluginApiUrl, {
        headers: {
          "X-OrgId": id ? id : "1",
        },
      });

      if (
        response.data !== undefined &&
        response.data !== null &&
        response.data.length > 0
      ) {
        setPluginRows(response.data); // Assuming the response data is the JSON data you want to use
      } else {
        setPluginRows([]);
      }
      setInvokeScanModal(true);
      setConnector(false);
      setConfigLoading(false);
    } catch (error) {
      console.error("Error calling Swagger API:", error);
    }
  };

  const handleAddScanInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = event.target;
    if (id === "text-input-1") {
      setApiUrl(value);
    } else if (id === "text-input-2") {
      setApiUsername(value);
    } else if (id === "text-input-3") {
      setApiPassword(value);
    } else if (id === "text-input-4") {
      setScanSearchId(value);
    } else if (id === "text-input-5") {
      setFileName(value);
    } else if (id === "text-input-6") {
      setScanDesc(value);
    }
  };

  const handleSelectPlugin = async (data: any) => {
    await setSelectedPluginData(data);
    setConnector(true);
  };
  const handleAddScan = async () => {
    // Create the object with the input values

    const requestObjectParamForQlsConnect = {
      org_id: 1,
      plugin_id: selectedPlugin.plugin_id,
      user_email: UserService.getUserEmail(),
      scan_desc: scanDesc,
      external_param: {
        api_url: apiUrl,
        api_username: apiUsername,
        api_password: apiPassword,
        scan_search_id: scanSearchId,
      },
    };
    const requestObjectForFileConnect = {
      org_id: 1,
      plugin_id: selectedPlugin.plugin_id,
      user_email: UserService.getUserEmail(),
      scan_desc: scanDesc,
      external_param: {
        file_name: fileName,
      },
    };
    const requestObject =
      selectedPlugin.plugin_name === "QlsConnect"
        ? requestObjectParamForQlsConnect
        : selectedPlugin.plugin_name === "FileConnect"
        ? requestObjectForFileConnect
        : "";

    const headers = {
      "X-OrgId": id ? id : "1",
    };
    // Perform the desired action with the pluginData object
    console.log("Data:", requestObject);
    try {
      const response = await axios.post(addScanApiUrl, requestObject, {
        headers: headers,
      });
      console.log("hello --------", response);
      //await setRows((prevRows) => [...prevRows, response.data]);
      fetchDataFromSwaggerAPI();
      setConfigLoading(false);
    } catch (error) {
      console.error("Error calling Swagger API:", error);
    }
    // You can also add logic to send the data to an API or perform any other action here

    // Close the modal
    setInvokeScanModal(false);
    setApiUrl("");
    setApiUsername("");
    setApiPassword("");
    setScanSearchId("");
    setFileName("");
    setScanDesc("");
  };

  // Define the function to fetch data from the Swagger API endpoint
  const fetchDataFromSwaggerAPI = async () => {
    try {
      const response = await axios.get(getAllScanapiUrl, {
        headers: {
          "X-OrgId": id ? id : "1",
        },
      });
      console.log("hello response--------", response.data);
      if (
        response.data !== undefined &&
        response.data !== null &&
        response.data.length > 0
      ) {
        console.log("here");
        setRows(response.data); // Assuming the response data is the JSON data you want to use
      } else {
        setRows([]);
      }
      setConfigLoading(false);
    } catch (error) {
      console.error("Error calling Swagger API:", error);
    }
  };

  useEffect(() => {
    fetchDataFromSwaggerAPI();
    // eslint-disable-next-line
  }, []);

  return (
    <Content id="main-content">
      {rows && rows.length ? (
        <DataTable
          rows={rows.map((a: any) => {
            a.id = a.scan_id;
            return a;
          })}
          headers={[
            {
              key: "scan_desc",
              header: "Scan Desc",
            },
            {
              key: "plugin_name",
              header: "Plugin Name",
            },
            {
              key: "plugin_type",
              header: "Type",
            },
            {
              key: "user_email",
              header: "User Email",
            },
            {
              key: "updation_ts",
              header: "Updation TS",
            },
          ]}
        >
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getTableContainerProps,
            getBatchActionProps,
            getToolbarProps,
            getSelectionProps,
            selectedRows,
          }: any) => (
            <TableContainer
              title={<h4>Plugin</h4>}
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent
                  aria-hidden={getBatchActionProps().shouldShowBatchActions}
                >
                  <TableToolbarSearch
                    persistent="true"
                    tabIndex={
                      getBatchActionProps().shouldShowBatchActions ? -1 : 0
                    }
                    value={filterString}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setFilterString(e.target.value);
                    }}
                  />
                  {/* <TableToolbarMenu
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  >
                    <TableToolbarAction onClick={() => alert("Alert 1")}>
                      Action 1
                    </TableToolbarAction>
                    <TableToolbarAction onClick={() => alert("Alert 2")}>
                      Action 2
                    </TableToolbarAction>
                    <TableToolbarAction onClick={() => alert("Alert 3")}>
                      Action 3
                    </TableToolbarAction>
                  </TableToolbarMenu> */}
                  {UserService.hasOrgAdminRole() ||
                  UserService.hasPluginAdminRole() ? (
                    <Button
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? -1 : 0
                      }
                      onClick={handleInvokeScanClick}
                      kind="primary"
                    >
                      Invoke Plugin
                    </Button>
                  ) : (
                    ""
                  )}
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    {/* <TableHeader aria-label="overflow actions" /> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      ) : (
        <Loading></Loading>
      )}
      <Modal
        passiveModal={!connector}
        modalHeading={
          connector
            ? `Configure ${selectedPlugin.plugin_name}`
            : "Add a new metadata source"
        }
        modalLabel={
          connector ? (
            <Link
              style={{ cursor: "pointer" }}
              onClick={() => setConnector(false)}
            >
              <ArrowLeft style={{ marginRight: 5 }} />
              Back
            </Link>
          ) : undefined
        }
        primaryButtonText="Add"
        secondaryButtonText={"Cancel"}
        open={openInvokeScanModal}
        onRequestClose={() => setInvokeScanModal(false)}
        onRequestSubmit={handleAddScan}
      >
        {!connector && (
          <Layer>
            {pluginRows?.length && (
              <div style={{ margin: "0 0 20px 0" }}>
                <Search
                  value={search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  placeholder={`Filter across ${pluginRows?.length} plugin`}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 20,
                rowGap: 20,
                flexDirection: "row",
              }}
            >
              {pluginRows.length &&
                pluginRows.map((connector) => (
                  <div
                    key={connector.plugin_name}
                    style={{
                      display: "inline-flex",

                      width: "100%",
                      maxWidth: 300,
                    }}
                  >
                    <ClickableTile
                      onClick={() => handleSelectPlugin(connector)}
                      style={{
                        width: "100%",
                        padding: 10,
                        paddingBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          columnGap: 20,
                          rowGap: 10,
                          padding: 20,
                          textAlign: "center",
                        }}
                      >
                        {connector.plugin_name === "FileConnect" ? (
                          <img
                            alt="connector"
                            src={fileImportImg}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                        ) : connector.plugin_name === "QlsConnect" ? (
                          <img
                            alt="connector"
                            src={QualysImport}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                        ) : (
                          ""
                        )}
                        <h4>
                          {connector.plugin_name === "QlsConnect"
                            ? "QualysConnect"
                            : connector.plugin_name}
                        </h4>
                        <small>An Advisor plugin for metadata Ingestion</small>
                      </div>
                    </ClickableTile>
                  </div>
                ))}
              {!pluginRows.length && <DataTableSkeleton />}
            </div>
          </Layer>
        )}
        {connector && (
          <Layer>
            {selectedPlugin.plugin_name === "QlsConnect" ? (
              <div>
                <TextInput
                  data-modal-primary-focus
                  id="text-input-1"
                  labelText="Api Url"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={apiUrl}
                  onChange={handleAddScanInputChange}
                />
                <TextInput
                  data-modal-primary-focus
                  id="text-input-2"
                  labelText="Api User Name"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={apiUsername}
                  onChange={handleAddScanInputChange}
                />
                <TextInput
                  data-modal-primary-focus
                  id="text-input-3"
                  labelText="Api Password"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={apiPassword}
                  onChange={handleAddScanInputChange}
                />

                <TextInput
                  data-modal-primary-focus
                  id="text-input-4"
                  labelText="Scan Search ID"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={scanSearchId}
                  onChange={handleAddScanInputChange}
                />
                <TextInput
                  data-modal-primary-focus
                  id="text-input-6"
                  labelText="Scan Description"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={scanDesc}
                  onChange={handleAddScanInputChange}
                />
              </div>
            ) : selectedPlugin.plugin_name === "FileConnect" ? (
              <div>
                <TextInput
                  data-modal-primary-focus
                  id="text-input-5"
                  labelText="File Name"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={fileName}
                  onChange={handleAddScanInputChange}
                />
                <TextInput
                  data-modal-primary-focus
                  id="text-input-6"
                  labelText="Scan Description"
                  placeholder="e.g. PLUG"
                  style={{
                    marginBottom: "1rem",
                  }}
                  value={scanDesc}
                  onChange={handleAddScanInputChange}
                />
              </div>
            ) : (
              ""
            )}
          </Layer>
        )}
      </Modal>
    </Content>
  );
}

export default ScanTable;
