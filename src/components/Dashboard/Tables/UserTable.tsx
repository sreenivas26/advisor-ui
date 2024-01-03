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
  Dropdown,
  Content,
  Modal,
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
  Loading,
  OverflowMenu,
  OverflowMenuItem,
} from "@carbon/react";

import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import Link from React Router
import React from "react";
import UserService from "../../../service/UserService";
import { InlineNotification } from "@carbon/react";

import "./UserTable.scss";
interface Row {
  userid: number;
  login_id: string;
  email: number;
  firstName: string;
  lastname: string;
}

interface UserData {
  id: number;
  userid: number;
  isSelected: boolean;
  isExpanded: boolean;
  disabled: boolean;
  cells: {
    userid: string;
    value: string | number;
    isEditable: boolean;
    isEditing: boolean;
    isValid: boolean;
    errors: null;
    info: {
      header: string;
    };
  }[];
}

function UserTable() {
  const { id } = useParams<{ id: string }>();

  const [filterString, setFilterString] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  // eslint-disable-next-line
  const [configLoading, setConfigLoading] = useState(true);
  //const batchActionProps = { shouldShowBatchActions: false };

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [defaultUserRole, setDefaultUserRole] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [assignedRole, setAssignedRole] = useState<any>(null);

  const assignUserRoleApiUrl =
    process.env.REACT_APP_USER_SERVICES + "/assignUserRole";
  const apiUrl = process.env.REACT_APP_USER_SERVICES + "/getUserDetails";

  const [openAddUserModal, setUserModalOpen] = useState(false);

  const [rolesArray, setRolesArray] = useState([]);
  const getAllRolesUrl =
    process.env.REACT_APP_USER_SERVICES + "/role/getAllRoles";

  const handleAddUserInputChange = (event: any) => {
    if (event.selectedItem) {
      // eslint-disable-next-line
      const { id, label } = event.selectedItem;
      console.log("value of role " + label);
      setSelectedUserRole(label);
    }
  };
  const handleCreateUser = async (user: any) => {
    console.log("-------------", user);
    setDefaultUserRole(
      user.cells.find((cell: any) => cell.info.header === "login_id")?.value ||
        ""
    );

    setSelectedUserRole(defaultUserRole);
    setSelectedUser(user);
    try {
      const response = await axios.get(getAllRolesUrl, {
        params: {
          userid: user?.id,
          orgid: id ? id : "1",
        },
      });
      const assignedRole = response.data.find((role: any) => role.assignedRole);

      if (assignedRole) {
        setDisplayWarning(true);
        setAssignedRole(assignedRole);
      } else {
        setDisplayWarning(false);
      }

      console.log("hello response from roles--------", response.data);
      if (
        response.data !== undefined &&
        response.data !== null &&
        response.data.length > 0
      ) {
        const dropdownItems = response.data.map((role: any) => ({
          id: role.role_id.toString(),
          label: role.role_name,
          name: role.role_name,
        }));
        setRolesArray(dropdownItems);
        const defaultSelectedRole = assignedRole
          ? dropdownItems.find(
              (item: { label: any }) => item.label === assignedRole.role_name
            )
          : undefined;
        setSelectedUserRole(defaultSelectedRole?.label || "");
      } else {
        setRolesArray([]);
      }
      setUserModalOpen(true);
    } catch (error) {
      console.error("Error calling Swagger API:", error);
    }
  };
  const handleUserButtonClick = async () => {
    if (selectedUser && selectedUser.id) {
      const userData = {
        userid: selectedUser.id,
        role: selectedUserRole,
      };

      try {
        const response = await axios.post(assignUserRoleApiUrl, userData, {
          headers: {
            "X-OrgId": id ? id : 1,
          },
        });
        console.log("hello --------", response.data);
      } catch (error) {
        console.error("Error calling Swagger API:", error);
      }

      setUserModalOpen(false);
    }
  };

  useEffect(() => {
    // Define the function to fetch data from the Swagger API endpoint
    const fetchDataFromSwaggerAPI = async () => {
      try {
        console.log("id--------", id);
        const response = await axios.get(apiUrl, {
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
          setRows(response.data);
        } else {
          setRows([]);
        }
        setConfigLoading(false);
      } catch (error) {
        console.error("Error calling Swagger API:", error);
      }
    };

    fetchDataFromSwaggerAPI();
  }, [apiUrl, id]);

  console.log("Roles value" + JSON.stringify(rolesArray));
  return (
    <Content id="main-content">
      {rows && rows.length ? (
        <DataTable
          rows={rows
            .map((a: any) => {
              a.id = a.userid || "";
              return a;
            })
            .filter((a: any) =>
              ["login_id", "namespace"].some((i) =>
                a[i]?.includes(filterString)
              )
            )}
          headers={[
            {
              key: "email",
              header: "Email",
            },
            {
              key: "firstName",
              header: "First Name",
            },
            {
              key: "lastName",
              header: "Last Name",
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
              title={
                <h4>
                  Users
                  {/* <Tag>{rows?.length}</Tag> */}
                </h4>
              }
              //style={{ width: "100%" }}
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
                    {UserService.hasOrgAdminRole() && (
                      <TableHeader aria-label="overflow actions">
                        Actions
                      </TableHeader>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell: any) => (
                        <TableCell
                          key={cell.userid}
                          className={cell.value === undefined ? "na-cell" : ""}
                        >
                          {cell.value === undefined ? "N/A" : cell.value}
                        </TableCell>
                      ))}
                      {UserService.hasOrgAdminRole() && (
                        <TableCell
                          className="cds--table-column-menu"
                          overflowMenuOnHover={false}
                        >
                          <OverflowMenu
                            overflowMenuOnHover={false}
                            size="sm"
                            flipped
                          >
                            <OverflowMenuItem
                              itemText="Assign Role"
                              onClick={() => handleCreateUser(row)}
                            />
                          </OverflowMenu>
                        </TableCell>
                      )}
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
        modalHeading="Assign Role"
        primaryButtonText="Assign"
        secondaryButtonText="Cancel"
        open={openAddUserModal}
        onRequestClose={() => setUserModalOpen(false)}
        onRequestSubmit={handleUserButtonClick}
      >
        {displayWarning && assignedRole && (
          // <div style={{ marginBottom: "16px" }}>
          //   This user already has the role "{assignedRole.role_name}" .
          // </div>

          <InlineNotification
            aria-label="closes notification"
            kind="warning"
            onClose={function noRefCheck() {}}
            onCloseButtonClick={function noRefCheck() {}}
            statusIconDescription="notification"
            subtitle={`This user already has the role ${
              assignedRole ? assignedRole.role_name : ""
            }`}
          />
        )}
        <br />
        <Dropdown
          id="drop"
          label="Select a role"
          titleText="Role"
          items={rolesArray}
          selectedItem={selectedUserRole}
          initialSelectedItem={
            assignedRole ? assignedRole.role_name : undefined
          }
          key={selectedUserRole}
          onChange={handleAddUserInputChange}
        />
      </Modal>
    </Content>
  );
}

export default UserTable;
