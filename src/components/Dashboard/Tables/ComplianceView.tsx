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
  crypto_assets: string;
  risk: string;
  compliance: string;
}

const ComplianceView: React.FC = () => {
  const [filterString, setFilterString] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

 // const batchActionProps = { shouldShowBatchActions: false };
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 }); // Default values

  const apiUrl = process.env.REACT_APP_PANDAS_OLAP_API + "/pandas/newdata/";
  useEffect(() => {
    const fetchDataFromSwaggerAPI = async () => {
      console.log("pagination---", pagination);
      // try {
      const requestDataRowOne = {
        group_by: ["cp_risk_status"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: ["cp_risk_status"],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
        schema_name: "ds_small_fact",
      };
      const requestDataRowTwo = {
        group_by: ["cs_risk_status"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: ["cs_risk_status"],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
        schema_name: "ds_small_fact",
      };
      const requestDataRowThree = {
        group_by: ["cert_risk_status"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: ["cert_risk_status"],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
        schema_name: "ds_small_fact",
      };
      const requestDataRowFour = {
        group_by: ["h_risk_status"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: ["h_risk_status"],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
        schema_name: "ds_small_fact",
      };
      const requestDataRowFive = {
        group_by: ["pk_risk_status"],
        where_by: {},
        sort_by: {},
        slice_by: {},
        dice_by: ["pk_risk_status"],
        page_by: {
          current_page: 1,
          records_per_page: 10,
        },
        fetch_by: "SQL",
        schema_name: "ds_small_fact",
      };
      const requestBodies = [
        requestDataRowOne,
        requestDataRowTwo,
        requestDataRowThree,
        requestDataRowFour,
        requestDataRowFive,
      ];
      try {
        const responses = await Promise.all(
          requestBodies.map(async (requestBody) => {
            const response = await axios.post(apiUrl, requestBody);
            console.log("response-----", response);
            return response.data.data;
          })
        );
        console.log("responses----------", responses);
        const data = [
          {
            crypto_assets: "cp_risk_status",
            risk: "1",
            compliance: "0",
          },
          {
            crypto_assets: "cs_risk_status",
            risk: "1",
            compliance: "0",
          },
          {
            crypto_assets: "cert_risk_status",
            risk: "0",
            compliance: "0",
          },
          {
            crypto_assets: "h_risk_status",
            risk: "0",
            compliance: "0",
          },
          {
            crypto_assets: "pk_risk_status",
            risk: "0",
            compliance: "0",
          },
        ];

        setRows(data);
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
      }
    };

    fetchDataFromSwaggerAPI();
  }, [apiUrl, pagination]);

  return (
    <Content id="main-content">
      {rows && rows.length ? (
        <DataTable
          rows={rows
            .map((a: any) => {
              a.id = a.crypto_assets;
              return a;
            })
            .filter((a: any) =>
              ["crypto_assets"].some((i) => a[i]?.includes(filterString))
            )}
          headers={[
            {
              key: "crypto_assets",
              header: "Crypto Assets",
            },
            {
              key: "risk",
              header: "Risk",
            },
            {
              key: "compliance",
              header: "Compliance",
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
          }: any) => (
            <TableContainer
              title={<h4>Compliance</h4>}
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
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to={`/compliance/compliance-details/${row.id}`}
                          >
                            {cell.value}
                          </Link>
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
                totalItems={rows && rows.length ? rows.length : 0}
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

export default ComplianceView;
