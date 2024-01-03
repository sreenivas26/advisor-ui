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
  OverflowMenu,
  Loading,
} from "@carbon/react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Row {
  host: string;
  port: string;
  app_name: string;
  city: string;
  endpoint_url: string;
  env: string;
  region: string;
}

const ApplicationView: React.FC = () => {
  const [filterString, setFilterString] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState();

 // const batchActionProps = { shouldShowBatchActions: false };
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 }); // Default values

  const apiUrl = process.env.REACT_APP_PANDAS_OLAP_API + "/pandas/newdata/";
  // Define the function to fetch data from the Swagger API endpoint
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
          "app_name",
          "env",
          "endpoint_url",
        ],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
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
              key: "app_name",
              header: "Application Name",
            },
            {
              key: "endpoint_url",
              header: "End Point URL",
            },
            {
              key: "env",
              header: "Env",
            },
            {
              key: "city",
              header: "City",
            },
            {
              key: "region",
              header: "Region",
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
              title={<h4>Application</h4>}
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

                    <TableHeader aria-label="overflow actions" />
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
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                      <TableCell
                        className="cds--table-column-menu"
                        overflowMenuOnHover={false}
                      >
                        <OverflowMenu
                          overflowMenuOnHover={false}
                          size="sm"
                          flipped
                        ></OverflowMenu>
                      </TableCell>
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

export default ApplicationView;
