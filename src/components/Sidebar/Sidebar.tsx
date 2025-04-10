import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Skeleton from "@mui/material/Skeleton";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  DriveFileRenameOutlineSharp,
  Close,
  Facebook,
  LinkedIn,
  Reddit,
  Twitter,
} from '@mui/icons-material';
import { sidebarStyles } from './SidebarStyles';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { deleteHistory, fetchLastSevenDayHistory, fetchLastThirtyDayHistory, fetchTodayHistory, fetchYesterdayHistory, resetSelectedHistory, setSelectedHistory } from 'store/slices/historySlice';
import { RootState, useAppDispatch } from '../../store';
import { resetMessages } from 'store/slices/chatSlice';
import { Menu as MenuIcon } from '@mui/icons-material';
import useIsMobile from './useIsMobile';
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userType?: 'guest' | 'google' | null;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { mode } = useTheme();
  const styles = sidebarStyles(mode);

  const dispatch = useAppDispatch();
  const { todayData, yesterdayData, lastSevenDays,lastThirtyDays, status, error } = useSelector((state: RootState) => state.history);  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // State for dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItem, setMenuItem] = useState<any | null>(null);
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const isMobile = useIsMobile();

  // State for share dialog (added)
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);

  useEffect(() => {
    dispatch(fetchTodayHistory());
    dispatch(fetchYesterdayHistory());
    dispatch(fetchLastSevenDayHistory());
    dispatch(fetchLastThirtyDayHistory());
  }, [dispatch]);

  useEffect(() => {
    const logSessionIds = (data: HistoryItem[], label: string) => {
      if (data && Array.isArray(data)) {
        data.forEach((item) => {
          console.log(`${label} Session ID:`, item.sessionId);
        });
      }
    };
 
    logSessionIds(todayData, 'Today');
    logSessionIds(yesterdayData, 'Yesterday');
    logSessionIds(lastSevenDays, 'Last 7 Days');
    logSessionIds(lastThirtyDays, 'Last 30 Days');
  }, [todayData, yesterdayData, lastSevenDays, lastThirtyDays]);
  const handleHistoryClick = (item: any) => {
    dispatch(setSelectedHistory(item));
    setSelectedChat(item.id);
  
    // Update the URL with the selected session ID
    window.history.pushState({}, '', `/chatbot/${item.sessionId}`);
  };
  

  const handleNewChat = () => {
    dispatch(resetMessages());
    dispatch(resetSelectedHistory());
    setSelectedChat(null);
  
    // Clear the URL for a new chat
    window.history.pushState({}, '', `/chatbot`);
  };
  

  // Handle opening the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, item: any) => {
    event.stopPropagation(); // Prevent triggering the ListItem click
    setAnchorEl(event.currentTarget);
    setMenuItem(item);
  };

  // Handle closing the menu
  const handleMenuClose = (event?: React.MouseEvent | {}, reason?: "backdropClick" | "escapeKeyDown") => {
    if (event && "stopPropagation" in event) {
      (event as React.MouseEvent).stopPropagation();
    }
    setAnchorEl(null);
  };
  
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose(event);
    setItemToDelete(menuItem);
    setDeleteDialogOpen(true);
  };

  // Handle share click (added)
  const handleShareClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleMenuClose(event);
    setOpenShareDialog(true);
  };

  // Handle create link (added)
  const handleCreateLink = () => {
    setLinkCreated(true);
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Handle copy link (added)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

const truncateText = (text: string) => {
  if (!text) return "No Question";
  return text.length > 30 ? text.substring(0, 30) + "..." : text;
};

// Function to get first few characters
const getFirstChars = (text: string, charCount: number = 30) => {
  if (!text) return "?";
  return text.substring(0, charCount);
};



const historyData = useSelector((state: RootState) => state.history.history);


  const handleDeleteConfirm = () => {
    if (itemToDelete?.sessionId) {
      dispatch(deleteHistory(itemToDelete.sessionId));
      setItemToDelete(null); 
      setDeleteDialogOpen(false);
    }
  };

  
  

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile]);


  const renderHistoryList = (data: any[], label: string) => {
    if (status !== 'loading' && status !== 'failed' && data.length === 0) {
      return null; // completely empty if no history and not loading/failed
    }
  
    return (
      <>
        <Typography variant="subtitle2" sx={styles.sectionTitle}>
          {label}
        </Typography>
  
        {status === 'loading' ? (
          <List sx={styles.list}>
            {[...Array(4)].map((_, index) => (
              <ListItem key={index} disablePadding sx={{ p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : status === 'failed' ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List sx={styles.list}>
            {data.map((item, index) => {
              const isSelected = selectedChat === item.id;
              const question = item.questionAnswer[0]?.question || "No Question";
              const truncatedQuestion = truncateText(question);
              const firstChars = getFirstChars(question);
  
              return (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={() => handleHistoryClick(item)}
                  sx={{ cursor: 'pointer' }}
                  className={`sidebar-history-item ${isSelected ? 'selected' : ''}`}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      p: 1,
                      borderRadius: '12px',
                      transition: 'background 0.3s, box-shadow 0.3s',
                      backgroundColor: isSelected 
                        ? mode === 'dark' ? 'rgba(0, 123, 255, 0.15)' : 'rgba(0, 123, 255, 0.1)'
                        : 'transparent',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 123, 255, 0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: isSelected 
                          ? mode === 'dark' ? 'rgba(0, 123, 255, 0.15)' : 'rgba(0, 123, 255, 0.1)'
                          : mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      },
                      position: 'relative',
                    }}
                  >
                    <HistoryIcon fontSize="small" sx={styles.listItemIcon} />
                    <Tooltip title={question} placement="top" arrow>
                      <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                        <Typography
                          className="sidebar-list-item-text"
                          sx={{
                            ...styles.listItemText,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                          }}
                        >
                          {truncatedQuestion}
                        </Typography>
                        <Typography
                          className="sidebar-list-item-short"
                          sx={{
                            ...styles.listItemText,
                            display: 'none',
                            fontWeight: 'medium',
                          }}
                        >
                          {firstChars}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item)}
                      className="more-options-icon"
                      sx={{
                        ml: 1,
                        p: 0,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        position: 'absolute',
                        right: '8px',
                        '&:hover': {
                          opacity: '1 !important',
                        },
                      }}
                    >
                      <MoreHorizIcon sx={{ 
                        fontSize: '16px', 
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                      }} />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </>
    );
  };
  


  return (
    <Drawer
      className="sidebar-container"
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      disableScrollLock
      onClick={() => isMobile ? onClose() : open} 
      sx={{
        width: 300, // Set drawer width
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: {
            xs: "50%",
            sm: 280,
            md: 260,
          },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column", // Ensure content aligns vertically
        },
      }}
    >
  {/* Header */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 16px",
      position: "sticky",
      top: 0,
      backgroundColor: "inherit", // Match Drawer background
      zIndex: 100,
    }}
  >
    <IconButton edge="start" color="inherit" aria-label="menu" onClick={onClose}>
      <MenuIcon />
    </IconButton>
    <Tooltip title="New Chat" arrow>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="new chat"
        onClick={handleNewChat}
        sx={{
          color: mode === "dark" ? "#ffffff" : "#202123",
          "&:hover": {
            backgroundColor: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DriveFileRenameOutlineSharp />
      </IconButton>
    </Tooltip>
  </Box>

  {/* Content: Chat History */}
  <Box
    sx={{
      flex: 1,
      overflowY: "auto", 
      padding: "0px",
    }}
  >
    <List sx={{paddingTop:"0px"}}>
      {renderHistoryList(todayData, "Today")}
      {renderHistoryList(yesterdayData, "Yesterday")}
      {renderHistoryList(lastSevenDays, "Last 7 Days")}
      {renderHistoryList(lastThirtyDays, "Last 30 Days")}
    </List>
  </Box>

  {/* Footer */}
  <Box
    sx={{
      position: "sticky",
      bottom: 0,
      padding: "8px 16px",
      backgroundColor: mode === "dark" ? "#121212" : "#f8f9fa",
    }}
  >
    <List>
      <ListItem disablePadding>
        <SettingsIcon sx={{ marginRight: "8px" }} />
        <ListItemText
          primary="Settings"
          sx={{
            "& span": {
              fontSize: "16px",
              fontWeight: 500,
              color: mode === "dark" ? "#fff" : "#222",
              padding:'2px',
            },
          }}
        />
      </ListItem>
    </List>
  </Box>
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        className="sidebar-dropdown-menu"
        PaperProps={{
          elevation: 3,
          sx: {
            ...styles.menuPaper,
            backgroundColor: mode === 'light' ? '#FFFFFF !important' : '#2A2A2A !important',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleShareClick} sx={styles.menuItem}>
          <ShareIcon fontSize="small" sx={{ 
            marginRight: '10px',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
          }} />
          Share
        </MenuItem>
        <MenuItem onClick={(e) => e.stopPropagation()} sx={styles.menuItem}>
          <EditIcon fontSize="small" sx={{ 
            marginRight: '10px',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
          }} />
          Rename
        </MenuItem>
        <MenuItem onClick={(e) => e.stopPropagation()} sx={styles.menuItem}>
          <ArchiveIcon fontSize="small" sx={{ 
            marginRight: '10px',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
          }} />
          Archive
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteClick} 
          sx={{
            ...styles.menuItem,
            color: '#ff4d4f'
          }}
        >
          <DeleteIcon fontSize="small" sx={{ 
            marginRight: '10px',
            color: '#ff4d4f'
          }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          elevation: 5,
          sx: styles.deleteDialog
        }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          Delete chat?
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Typography sx={styles.dialogContentText}>
            This will delete{' '}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {itemToDelete?.questionAnswer[0]?.question || "this chat"}
            </Box>
            .
          </Typography>
          <Typography sx={{
            ...styles.dialogContentText,
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}>
            To clear any memories from this chat, visit your{' '}
            <Box 
              component="span" 
              sx={{ 
                color: '#1890ff',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'none',
                }
              }}
            >
              settings
            </Box>
            .
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button 
            onClick={handleDeleteCancel} 
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            sx={styles.deleteButton}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog - Added new dialog for sharing */}
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            position: 'relative',
          }}
        >
          Public link created
          <IconButton
            onClick={() => setOpenShareDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#555',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#555',
            marginBottom: '12px',
          }}
        >
          A public link to your chat has been created. Manage previously shared chats at any time via 
          <a href="#" style={{ textDecoration: 'underline' }}> Settings</a>.
        </DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: '#f1f1f1',
            borderRadius: '30px',
            marginBottom: '16px',
          }}
        >
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginRight: '8px',
              flex: 1,
            }}
          >
            {window.location.href}
          </Typography>
          <Button
            variant="contained"
            onClick={linkCreated ? handleCopyLink : handleCreateLink}
            sx={{
              color: '#fff',
              borderRadius: '20px',
              padding: '6px 16px',
            }}
          >
            {linkCreated ? 'Copy link' : 'Create link'}
          </Button>
        </Box>

        {linkCreated && (
          <DialogActions sx={{ justifyContent: 'center' }}>
            <IconButton
              size="large"
              aria-label="LinkedIn"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              size="large"
              aria-label="Facebook"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
            >
              <Facebook />
            </IconButton>
            <IconButton
              size="large"
              aria-label="Reddit"
              onClick={() => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`, '_blank')}
            >
              <Reddit />
            </IconButton>
            <IconButton
              size="large"
              aria-label="Twitter"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20out%20this%20chat!`, '_blank')}
            >
              <Twitter />
            </IconButton>
          </DialogActions>
        )}
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;