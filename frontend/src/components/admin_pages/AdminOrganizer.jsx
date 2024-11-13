import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Tabs,
    Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import UserService from "../../services/UserService.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import AdminTable from "./AdminTable.jsx";
import AddUserModal from "./AddUserModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import "../styles/FontStyle.css";

function AdminOrganizer() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [tabValue, setTabValue] = useState(0);  // 0 for All, 1 for Approved, 2 for Pending
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            nav("/home");
        }
        const fetchData = async () => {
            try {
                const data = await UserService.getAllUsers();
                const organizers = data.filter(user => user.accountType.toLowerCase() === "organizer"); // Filter organizers
                setUsers(organizers);
                setFilteredUsers(organizers);
            } catch (error) {
                console.error("Failed to fetch Users", error);
            }
        };
        fetchData();
    }, [currentUser, nav]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        filterUsersByTab(newValue);
    };

    const filterUsersByTab = (tab) => {
        let filtered;
        if (tab === 0) {  
            filtered = users.filter(user => user.accountType.toLowerCase() === "organizer");
        } else if (tab === 1) {
            filtered = users.filter(user => user.status === "Approved" && user.accountType.toLowerCase() === "organizer");
        } else if (tab === 2) { 
            filtered = users.filter(user => user.status === "Pending" && user.accountType.toLowerCase() === "organizer");
        }
        setFilteredUsers(filtered);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.accountType.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

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

    const columns = [
        { field: "userID", headerName: "User ID", width: 100 },
        { field: "firstName", headerName: "First Name", width: 180 },
        { field: "lastName", headerName: "Last Name", width: 180 },
        { field: "accountType", headerName: "Account Type", width: 180 },
        { field: "phoneNumber", headerName: "Phone Number", width: 180 },
        { field: "dateTimeCreated", headerName: "Date Added", width: 180 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(params.row)}
                        sx={{ marginRight: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(params.row.userID)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
            width: 200,
        },
    ];

    const rows = filteredUsers.map((user) => ({
        id: user.userID,
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        phoneNumber: user.phoneNumber,
        dateTimeCreated: user.dateTimeCreated,
    }));

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    const handleDeleteClick = (userID) => {
        setUserToDelete(userID);
        setOpenDeleteDialog(true);
    };

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
                        <Box sx={{ display: "flex", marginBottom: "30px", justifyContent: "space-between" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: "20px" }}>
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
                            height: "100%",
                            boxShadow: "5px 5px 5px #aaaaaa",
                            position: "relative",
                            overflowY: "auto"
                        }}>
                            <AdminTable rows={rows} columns={columns} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <AddUserModal
                open={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onSuccess={(newUser) => {
                    setUsers((prevUsers) => [...prevUsers, newUser]);
                    filterUsersByTab(tabValue);
                    setSnackbarMessage("User has been added successfully.");
                    setOpenSnackbar(true);
                    setOpenRegisterModal(false);
                }}
            />

            <EditUserModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                user={selectedUser}
                onSuccess={handleEditUserSuccess}
            />

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} sx={{padding: '20px'}}>
                <DialogTitle  sx={{width: '250px', height: '50px'}}>Confirm Delete User?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} sx={{color: 'white', backgroundColor: '#C63F47', width:'150px'}}>Cancel</Button>
                    <Button onClick={handleDeleteUser} sx={{color: 'white', backgroundColor: '#C63F47', width:'150px'}}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={snackbarMessage} />
        </div>
    );
}

export default AdminOrganizer;
