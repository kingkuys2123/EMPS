import React, { useState } from "react";
import { Box, TextField, Button, Link } from "@mui/material";
import CustomAppBar from "./CustomAppBar.jsx";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./styles/FontStyle.css";
import DataTable from "./DataTableComponent.jsx";

function TemplateComponent({
    SidebarComponent,
    title = "Page Title",
    tabs = [""],
    fetchRows,
    columns,
    setActiveTab,
    onAcceptClick,
    onDeleteClick,
    body,
    checkBoxTemplate,
    newButton,
    onCreateNewTicketClick,
    searchLabel
}) {
    // State for search input
    const [searchText, setSearchText] = useState("");

    // Filter rows based on search text
    const filteredRows = fetchRows.filter((row) =>
        (row.customerName || "").toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="template-page" style={{ boxSizing: "border-box" }}>
            <Box sx={{ display: "flex", boxSizing: "border-box", width: "100vw" }}>
                {SidebarComponent && <SidebarComponent />}

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: "#F3F3F3",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Add Title */}
                    <CustomAppBar title={title} />

                    <Box sx={{ flexGrow: 1, margin: "10px 20px", boxSizing: "border-box" }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexGrow: 1,
                                height: "7vh",
                                boxSizing: "border-box",
                                marginBottom: "10px",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    boxSizing: "border-box",
                                    width: "200px",
                                    justifyContent: tabs.length ? "space-between" : "center",
                                }}
                            >
                                {tabs.length > 0 ? (
                                    tabs.map((tab) => (
                                        <React.Fragment key={tab}>
                                            <Link
                                                href="#"
                                                underline="hover"
                                                className="TabBookingButtons"
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </Link>
                                            {tab !== tabs[tabs.length - 1] && <p>|</p>}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: "center", color: "#757575" }}></Box>
                                )}
                            </Box>

                            <Box sx={{ display: "flex", boxSizing: "border-box", gap: "10px" }}>
                                <TextField
                                    id="outlined-size-small"
                                    label={searchLabel}
                                    type="search"
                                    size="small"
                                    sx={{ width: "250px" }}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                {newButton === true ?
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onCreateNewTicketClick}
                                            startIcon={<AddCircleIcon />}
                                        >
                                            New Ticket
                                        </Button>
                                    </Box> : ''
                                }
                            </Box>
                        </Box>


                        <Box
                            sx={{
                                display: "flex",
                                flex: 1,
                                flexDirection: "column",
                                boxSizing: "border-box",
                                height: "calc(100vh - 230px)",
                            }}
                        >
                            {body ? (
                                body
                            ) : (
                                <DataTable
                                    boxPadding={"0px"}
                                    rows={filteredRows}
                                    columns={columns}
                                    onAcceptClick={onAcceptClick}
                                    onDeleteClick={onDeleteClick}
                                    checkBox={checkBoxTemplate}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default TemplateComponent;
