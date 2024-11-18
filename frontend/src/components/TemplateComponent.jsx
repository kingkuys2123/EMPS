import React, { useState } from "react";
import { Box, TextField, Button, Link } from "@mui/material";
import CustomAppBar from "./CustomAppBar.jsx";
import FilterListIcon from '@mui/icons-material/FilterList';
import "./styles/FontStyle.css";
import DataTable from "./DataTableComponent.jsx";

function TemplateComponent({
    SidebarComponent,
    title = "Page Title",
    tabs = ["All"],
    fetchRows,
    columns,
    onEditClick,
    onDeleteClick,
    body
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    return (
        <div className="template-page" style={{ boxSizing: "border-box"}}>
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
                        boxSizing: "border-box"
                    }}
                >
                    {/* ADD TITLE */}
                    <CustomAppBar title={title} />

                    <Box sx={{ flexGrow: 1, margin: "10px 20px", boxSizing: "border-box" }}>
                        <Box sx={{
                            display: "flex", flexGrow: 1,
                            height: "7vh", boxSizing: "border-box", marginBottom: "10px",
                            justifyContent: "space-between", alignItems: "flex-end"
                        }}>
                            <Box sx={{ display: "flex", boxSizing: "border-box", width: "200px", justifyContent: "space-between" }}>
                                {tabs.map((tab) => (
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
                                ))}
                            </Box>

                            <Box sx={{ display: "flex", boxSizing: "border-box", gap: "10px" }}>
                                <TextField
                                    id="outlined-size-small"
                                    label="Search bookings..."
                                    type="search"
                                    size="small"
                                    sx={{ width: "250px" }}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListIcon />}
                                    sx={{ height: "40px", backgroundColor: "#CFCFC4", border: "#000", color: "#000" }}
                                >
                                    Filter
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{
                            display: "flex", flex: 1, flexDirection: "column", boxSizing: "border-box",
                            height: 'calc(100vh - 230px)'
                        }}>
                            {body ? (
                                body
                            ) : (
                                <DataTable
                                    boxPadding={"0px"}
                                    rows={fetchRows}
                                    columns={columns}
                                    onEditClick={onEditClick}
                                    onDeleteClick={onDeleteClick}
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
