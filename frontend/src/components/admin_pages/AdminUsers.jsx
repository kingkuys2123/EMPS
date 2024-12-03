import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import UserService from "../../services/UserService.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import SearchableDataGrid from "./SearchTableGrid.jsx";
import AddUserModal from "./AddUserModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import LongMenu from "./LongMenu";  // Import the LongMenu component
import "../styles/FontStyle.css";

function AdminUsers() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await UserService.getAllUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error("Failed to fetch Users", error);
            }
        };
        fetchData();
    }, [currentUser, nav]);

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
        if (reason === "clickaway") {
            return;
        }
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

    const handleEditClick = (user) => {
        // Check the user object to ensure all required fields exist
        console.log("Selected user:", user);
        
        setSelectedUser({
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            accountType: user.accountType,
            phoneNumber: user.phoneNumber,
            dateTimeCreated: user.dateTimeCreated,
            email: user.email || "",  
            username: user.username || "",  
            password: user.password || "" 
        });
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

    const columns = [
        { field: "userID", headerName: "User ID", flex: 1, minWidth: 100 },
        { field: "firstName", headerName: "First Name", flex: 1, minWidth: 100 },
        { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 100 },
        { field: "accountType", headerName: "Account Type", flex: 1, minWidth: 100 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1, minWidth: 100 },
        { field: "dateTimeCreated", headerName: "Date Added", flex: 1, minWidth: 100 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: (params) => (
                <Box>
                    {/* check pass row for empty username,email, password*/}
                    <LongMenu
                        onEdit={() => handleEditClick(params.row)} 
                        onDelete={() => handleDeleteClick(params.row.userID)}
                    />
                </Box>
            ),
            flex: 1,
            minWidth: 100,
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
        email: user.email || "",  
        username: user.username || "",  
        password: user.password || "" 
    }));

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
                    <CustomAppBar title={"Users"} />
                    <Box sx={{
                        flexGrow: 1,
                        padding: "25px",
                        backgroundColor: "#F3F3F3"
                    }}>
                        <Box sx={{ display: "flex", marginBottom: "15px", justifyContent: "space-between" }}>
                            <h3>All Users: {users.length}</h3>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    placeholder="Search users..."
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
                            position: "relative",
                            overflowY: "auto"
                        }}>
                            <SearchableDataGrid rows={rows} columns={columns} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Register Modal for Adding User */}
            <AddUserModal
                open={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onSuccess={(newUser) => {
                    setUsers((prevUsers) => [...prevUsers, newUser]);
                    setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
                    setSnackbarMessage("User has been added successfully.");
                    setOpenSnackbar(true);
                    setOpenRegisterModal(false);
                }}
            />

            {/* Edit User Modal */}
            <EditUserModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                user={selectedUser}
                onSuccess={handleEditUserSuccess}
            />

            {/* Delete User Dialog */}
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

export default AdminUsers;
