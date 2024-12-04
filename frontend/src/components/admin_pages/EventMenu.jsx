import React from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { act } from "react";

export default function EventMenu({ activeTab, onRefuse, onApprove, onView, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView();
    handleClose();
  }

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5, // Limits menu height
            width: "20ch",
          },
        }}
      >
        {activeTab === 2 ? (
          <div>
            <MenuItem onClick={() => { onApprove(); handleClose(); }}>
              Approve
            </MenuItem>
            <MenuItem onClick={() => { onRefuse(); handleClose(); }}>
              Refuse
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem onClick={handleView}>View Event</MenuItem>
            <MenuItem onClick={handleEdit}>Edit Event</MenuItem>
            <MenuItem onClick={handleDelete}>Delete Event</MenuItem>
          </div>
        )}
      </Menu>
    </div>
  );
};
