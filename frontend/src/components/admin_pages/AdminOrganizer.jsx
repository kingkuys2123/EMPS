import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
    Snackbar,
    Tabs,
    Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import UserService from "../../services/UserService.jsx";
import OrganizerService from "../../services/OrganizerService.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import AdminTable from "./AdminTable.jsx";
import AddOrganizerModal from "./AddOrganizerModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import OrganizerMenu from "./OrganizerMenu.jsx";
import "../styles/FontStyle.css";

function AdminOrganizer() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch data for organizers and users
    useEffect(() => {
        if (!currentUser) {
            nav("/home");
        }
        const fetchData = async () => {
            try {
                const data = await OrganizerService.getAllOrganizers();
                console.log("Fetched Data:", data);

                // Filter to include only organizers with valid user data
                const organizers = data.filter((organizer) => {
                    console.log("Checking organizer:", organizer);
                    return organizer.user && organizer.user.accountType;
                });

                console.log("Filtered Organizers:", organizers);
                setUsers(organizers);
                setFilteredUsers(organizers);
            } catch (error) {
                console.error("Failed to fetch Users", error);
            }
        };
        fetchData();
    }, [currentUser, nav]);

    // Tab change handler
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        filterUsersByTab(newValue);
    };

    const filterUsersByTab = (tab) => {
        let filtered;
        if (tab === 0) {
            filtered = users.filter(
                (user) => user.user?.accountType?.toLowerCase() === "organizer"
            );
        } else if (tab === 1) {
            filtered = users.filter(
                (user) =>
                    (user.approvalStatus?.toLowerCase() === "approved" || user.approvalStatus === undefined) &&
                    user.user?.accountType?.toLowerCase() === "organizer"
            );
        } else if (tab === 2) {
            filtered = users.filter(
                (user) =>
                    (user.approvalStatus?.toLowerCase() === "pending" || user.approvalStatus === undefined) &&
                    user.user?.accountType?.toLowerCase() === "organizer"
            );
        }
        setFilteredUsers(filtered);
    };



    // Search handler
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.user.firstName.toLowerCase().includes(query) ||
                user.user.lastName.toLowerCase().includes(query) ||
                user.user.accountType.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    // Close snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    // Delete user handler
    const handleDeleteUser = async () => {
        try {
            await UserService.deleteUser(userToDelete);
            setUsers((prevUsers) => prevUsers.filter((user) => user.userID !== userToDelete));
            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.userID !== userToDelete));
            setSnackbarMessage("User has been deleted successfully.");
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
        } catch (e) {
            setSnackbarMessage("Failed to delete user.");
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
        }
    };

    // Handle edit success
    const handleEditUserSuccess = (updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.userID === updatedUser.userID ? updatedUser : user))
        );
        setFilteredUsers((prevUsers) =>
            prevUsers.map((user) => (user.userID === updatedUser.userID ? updatedUser : user))
        );
        setSnackbarMessage("User has been updated successfully.");
        setOpenSnackbar(true);
        setOpenEditModal(false);
    };

    // Columns definition for the table
    const columns = [
        { field: "userID", headerName: "User ID", flex: 1, minWidth: 100 },
        { field: "firstName", headerName: "First Name", flex: 1, minWidth: 180 },
        { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 180 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1, minWidth: 180 },
        { field: "approvalStatus", headerName: "Status", flex: 1, minWidth: 180 },
        { field: "dateTimeCreated", headerName: "Date Added", flex: 1, minWidth: 180 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <OrganizerMenu
                        organizer={params.row}
                        onEdit={() => handleEditClick(params.row)}
                        onDelete={() => handleDeleteClick(params.row.userID)}
                        activeTab={tabValue}  // Pass the activeTab here
                    />
                </Box>
            ),
            flex: 1,  // Allow this column to flex as well
            minWidth: 250, // Adjust width for action buttons
        },
    ];

    // Define rows for the table
    const rows = filteredUsers.length
        ? filteredUsers.map((organizer) => ({
            id: organizer.organizerId,
            userID: organizer.user?.userID || "N/A",
            firstName: organizer.user?.firstName || "N/A",
            lastName: organizer.user?.lastName || "N/A",
            phoneNumber: organizer.user?.phoneNumber || "N/A",
            approvalStatus: organizer.approvalStatus,
            dateTimeCreated: organizer.user?.dateTimeCreated || "N/A",
        }))
        : [];

    // Handle edit click
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    // Handle delete click
    const handleDeleteClick = (userID) => {
        setUserToDelete(userID);
        setOpenDeleteDialog(true);
    };

    // Close delete dialog
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100vw", maxWidth: "100%" }}>
                <AdminSidebar />
                <Box component="main" sx={{
                    flexGrow: 1,
                    backgroundColor: "#F3F3F3",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
                }}>
                    <CustomAppBar title={"Organizers"} />
                    <Box sx={{
                        flexGrow: 1,
                        padding: "25px",
                        backgroundColor: "#F3F3F3"
                    }}>
                        <Box sx={{ display: "flex", marginBottom: "15px", justifyContent: "space-between" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} >
                                <Tab label="All" />
                                <Tab label="Approved" />
                                <Tab label="Pending" />
                            </Tabs>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    size="small"
                                    onChange={handleSearch}
                                    sx={{ marginRight: "10px", backgroundColor: "#FFFFFF" }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#D32F2F",
                                        color: "#FFFFFF",
                                        "&:hover": { backgroundColor: "#B71C1C" },
                                    }}
                                    onClick={() => setOpenRegisterModal(true)}
                                >
                                    + Add User
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{
                            backgroundColor: "#FFFFFF",
                            width: "auto",
                            boxShadow: "5px 5px 5px #aaaaaa",
                            overflowY: "auto"
                        }}>
                            <AdminTable rows={rows} columns={columns} />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <AddOrganizerModal open={openRegisterModal} onClose={() => setOpenRegisterModal(false)} />
            <EditUserModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                user={selectedUser}
                onEditSuccess={handleEditUserSuccess}
            />
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeleteUser} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </div>
    );
}

export default AdminOrganizer;
