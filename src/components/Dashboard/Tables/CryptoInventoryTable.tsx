import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Content,
  DataTable,
  Pagination,
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
} from "@carbon/react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Row {
  host: string;
  port: string;
  dns: string;
  type: string;
  cp_version: string;
  cs_name: string;
  security: string;
}

const CryptoInventoryTable: React.FC = () => {
  const [filterString, setFilterString] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState();

  //const batchActionProps = { shouldShowBatchActions: false };
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 }); // Default values

  const apiUrl = process.env.REACT_APP_PANDAS_OLAP_API + "/pandas/newdata/";

  const fetchDataFromSwaggerAPI = async () => {
    console.log("pagination---", pagination);
    try {
      const requestData = {
        group_by: ["host", "port"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: [
          "region",
          "city",
          "host",
          "port",
          "dns",
          "cp_name",
          "type",
          "cp_version",
          "cs_name",
          "security",
        ],
        page_by: {
          current_page: pagination.page,
          records_per_page: pagination.pageSize,
        },
        fetch_by: "SQL|MEM",
        schema_name: "ds_small_fact",
      };

      axios
        .post(apiUrl, requestData)
        .then((response) => {
          // Handle success
          console.log("Response:", response);
          setRows(response.data.data);
          setCount(response.data.record_count);
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error calling Swagger API:", error);
    }
  };
  useEffect(() => {
    fetchDataFromSwaggerAPI();
    // eslint-disable-next-line
  }, [pagination]);

  return (
    <Content id="main-content">
      {rows && rows.length ? (
        <DataTable
          rows={rows
            .map((a: any) => {
              a.id = a.host;
              return a;
            })
            .filter((a: any) =>
              ["host", "port"].some((i) => a[i]?.includes(filterString))
            )}
          headers={[
            {
              key: "host",
              header: "Host",
            },
            {
              key: "port",
              header: "Port",
            },
            {
              key: "dns",
              header: "Domain",
            },
            {
              key: "type",
              header: "Protocol",
            },
            {
              key: "cp_version",
              header: "Version",
            },
            {
              key: "cs_name",
              header: "Ciphersuite",
            },
            {
              key: "security",
              header: "Strength",
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
              title={<h4>Inventory</h4>}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === "host" ? (
                            <Link
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                              to={`/inventory/host-details/${row.id}`}
                            >
                              {cell.value}
                            </Link>
                          ) : cell.info.header === "cs_name" ? (
                            <Link
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                              to={`/inventory/ciphersuite-details/${row.id}`}
                            >
                              {cell.value}
                            </Link>
                          ) : cell.info.header === "security" ? (
                            <span
                              style={{
                                color:
                                  cell.value === "MEDIUM"
                                    ? "orange"
                                    : cell.value === "LOW"
                                    ? "green"
                                    : cell.value === "HIGH"
                                    ? "red"
                                    : "inherit",
                              }}
                            >
                              {cell.value}
                            </span>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                style={{ width: "100%" }}
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                page={pagination.page}
                onChange={({ page, pageSize }: any) => {
                  setPagination({ page, pageSize });
                }}
                pageNumberText="Page Number"
                pageSize={pagination.pageSize}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={count ? count : 0}
              />
            </TableContainer>
          )}
        </DataTable>
      ) : (
        <Loading></Loading>
      )}
    </Content>
  );
};

export default CryptoInventoryTable;
