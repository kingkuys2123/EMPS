import React, { useState } from "react";
import { Box, TextField, Button, Link, Grid } from "@mui/material";
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

    const [searchText, setSearchText] = useState("");

    const filteredRows = fetchRows.filter((row) =>
        (row.eventName || row.event.name || "").toLowerCase().includes(searchText.toLowerCase())
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
                        height: "100vh",
                    }}
                >
                    <CustomAppBar title={title} />

                    <Box sx={{ flexGrow: 1, margin: "10px 20px", boxSizing: "border-box" }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexGrow: 1,
                                height: "6vh",
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
                                    marginLeft: "5px"
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

                            <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ boxSizing: "border-box" }}>
                                <Grid item>
                                    <TextField
                                        id="outlined-size-small"
                                        label={searchLabel}
                                        type="search"
                                        size="small"
                                        sx={{ width: "275px" }}
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Grid>
                                {newButton === true && (
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onCreateNewTicketClick}
                                            startIcon={<AddCircleIcon />}
                                            sx={{ backgroundColor: '#C63F47' }}
                                        >
                                            New Ticket
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
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
                                <Box>
                                    <DataTable
                                        boxPadding={"0px"}
                                        rows={filteredRows}
                                        columns={columns}
                                        onAcceptClick={onAcceptClick}
                                        onDeleteClick={onDeleteClick}
                                        checkBox={checkBoxTemplate}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default TemplateComponent;