import React, { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Pagination,
    Paper,
    Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import UserSidebar from "./user_pages/UserSidebar.jsx";
import CustomAppBar from "./CustomAppBar.jsx";
import CustomSnackbar from "./CustomSnackbar.jsx";
import PaymentMethodService from "../services/PaymentMethodService.jsx";

import './styles/FontStyle.css';
import AdminSidebar from "./admin_pages/AdminSidebar.jsx";
import OrganizerSidebar from "./organizer_pages/OrganizerSidebar.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookingService from "../services/BookingService.jsx";
import AddPaymentMethodModal from "./AddPaymentMethodModal.jsx"
import EditPaymentMethodModal from './EditPaymentMethodModal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

import { getAuth } from "../utils/AuthContext.jsx";

const ITEMS_PER_PAGE = 5;

function Billing() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser } = getAuth();

    const [bookings, setBookings] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = useState({});
    const [openConfirmDeleteUserDialog, setOpenConfirmDeleteUserDialog] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(false);

    const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] = useState(false);
    const [openEditPaymentMethodModal, setOpenEditPaymentMethodModal] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState(null);

    useEffect(() => {
        const fetchPaymentMethod = async () => {
            const data = await PaymentMethodService.getUserPaymentMethod(currentUser.userID);
            setPaymentMethod(data);
        };
        if (!currentUser) {
            nav("/");
        }
        else {
            fetchPaymentMethod();
        }
    }, [currentUser]);

    const handleOpenAddPaymentMethodModal = () => {
        setOpenAddPaymentMethodModal(true);
    };

    const handleCloseAddPaymentMethodModal = () => {
        setOpenAddPaymentMethodModal(false);
    };

    const handleOpenEditPaymentMethodModal = () => {
        setOpenEditPaymentMethodModal(true);
    };

    const handleCloseEditPaymentMethodModal = () => {
        setOpenEditPaymentMethodModal(false);
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (!currentUser) {
            nav("/");
        } else {
            setErrors({});
            fetchTransactionHistory();
        }
    }, []);

    const fetchTransactionHistory = async () => {
        try {
            const data = await BookingService.getTransactionHistory(currentUser.userID);
            setBookings(data);
        } catch (error) {
            setSnackbarMessage(error.message || 'Failed to fetch transaction history.');
            setOpenSnackbar(true);
        }
    };

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = (confirmed) => {
        setOpenConfirmDialog(false);
        if (confirmed) {
            handleDeletePaymentMethod();
        }
    };

    const handleDeletePaymentMethod = async () => {
        try {
            const data = await PaymentMethodService.deletePaymentMethod(paymentMethod.paymentMethodId);
            setPaymentMethod(null);

            setSnackbarMessage(data);
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage(error.message || 'Failed to delete payment method.');
            setOpenSnackbar(true);
        }
    };

    const Sidebars = {
        user: <UserSidebar />,
        admin: <AdminSidebar />,
        organizer: <OrganizerSidebar />
    };

    const paginatedBookings = bookings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="my-account-page" inert={openAddPaymentMethodModal || openEditPaymentMethodModal || openConfirmDialog ? "true" : undefined}>
            <Box sx={{ display: "flex" }}>

                {currentUser && Sidebars[currentUser.accountType] || null}

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Billing"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, height: "95%" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                You can add your payment details either and manage them like edit them or delete them.
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                Please note that deleting your payment details is irreversible and all your data will be permanently lost.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Your Payment Method
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Add, update or remove your payment method and details.
                                            </Typography>
                                        </Box>
                                        { paymentMethod ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <img
                                                        src={paymentMethod.paymentType === 'gcash' ? '/assets/icons/gcash_icon.png' : '/assets/icons/credit_card_icon.png'}
                                                        alt={paymentMethod.paymentType === 'gcash' ? 'GCash Icon' : 'Credit Card Icon'}
                                                        style={{ width: 24, height: 24, marginRight: 15, marginLeft: 10 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ color: "#333" }}>
                                                            {paymentMethod.paymentType === 'gcash' ? 'GCash' : 'Credit Card'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: "#7F7F7F" }}>
                                                            {new Date(paymentMethod.dateTimeCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {new Date(paymentMethod.dateTimeCreated).toLocaleTimeString('en-US')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginRight: 1, backgroundColor: '#7F7F7F', borderRadius: 0, '&:hover': { backgroundColor: '#a32d34' } }}
                                                        onClick={handleOpenConfirmDialog}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ backgroundColor: '#C63F47', borderRadius: 0, '&:hover': { backgroundColor: '#a32d34' } }}
                                                        onClick={handleOpenEditPaymentMethodModal}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (                                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ color: "#333" }}>
                                                        No payment method saved
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "#7F7F7F" }}>
                                                        Pay bookings faster by adding a payment method!
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#C63F47', borderRadius: 0, '&:hover': { backgroundColor: '#a32d34' } }}
                                                    onClick={handleOpenAddPaymentMethodModal}
                                                >
                                                    Add Payment Method
                                                </Button>
                                            </Box>
                                        )}
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Transaction History
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Listed here is your transaction history.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ padding: "25px", backgroundColor: "#F3F3F3", height: "100%" }}>
                                            <TableContainer component={Paper} sx={{ marginTop: 2, boxShadow: 3 }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Amount</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {paginatedBookings.map((booking, index) => (
                                                            <TableRow key={booking.bookingID} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                                                <TableCell>
                                                                    <Accordion
                                                                        expanded={expanded === `panel${index}`}
                                                                        onChange={handleChangeAccordion(`panel${index}`)}
                                                                        sx={{ boxShadow: 'none' }}
                                                                    >
                                                                        <AccordionSummary
                                                                            expandIcon={<ExpandMoreIcon />}
                                                                            aria-controls={`panel${index}bh-content`}
                                                                            id={`panel${index}bh-header`}
                                                                            sx={{ padding: 0 }}
                                                                        >
                                                                            <Typography>
                                                                                {new Date(booking.dateTimePaid).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                            </Typography>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails sx={{ padding: 2, backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Payment Details:</Typography>
                                                                            <Typography><strong>Event:</strong> {booking.ticket.event.name}</Typography>
                                                                            <Typography><strong>Ticket:</strong> {booking.ticket.name}</Typography>
                                                                            <Typography><strong>Quantity:</strong> {booking.ticketQuantity}</Typography>
                                                                            <Typography><strong>Total Cost:</strong> ${booking.totalPrice.toFixed(2)}</Typography>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                </TableCell>
                                                                <TableCell>{booking.ticket.name}</TableCell>
                                                                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Pagination
                                                count={Math.ceil(bookings.length / ITEMS_PER_PAGE)}
                                                page={currentPage}
                                                onChange={handleChangePage}
                                                sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{padding: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src="/assets/images/extras/extra-people-dance-4.png" alt="People Dancing" style={{borderRadius: '10px', maxWidth: '100%', height: 'auto'}} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Box>

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />

            <AddPaymentMethodModal
                open={openAddPaymentMethodModal}
                onClose={handleCloseAddPaymentMethodModal}
                userId={currentUser.userID}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />

            <EditPaymentMethodModal
                open={openEditPaymentMethodModal}
                onClose={handleCloseEditPaymentMethodModal}
                userId={currentUser.userID}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />

            <ConfirmDialog
                openDialog={openConfirmDialog}
                setOpenDialog={setOpenConfirmDialog}
                onClose={handleCloseConfirmDialog}
                title="Confirm Delete Payment Method"
                message="Are you sure you want to delete this payment method? This action is irreversible."
            />
        </div>
    );
}

export default Billing;