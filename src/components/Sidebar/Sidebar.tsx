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
} from '@mui/icons-material';
import { sidebarStyles } from './SidebarStyles';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { deleteHistory, fetchLastSevenDayHistory, fetchLastThirtyDayHistory, fetchTodayHistory, fetchYesterdayHistory, resetSelectedHistory, setSelectedHistory } from 'store/slices/historySlice';
import { RootState, useAppDispatch } from '../../store';
import { resetMessages } from 'store/slices/chatSlice';
import { Menu as MenuIcon } from '@mui/icons-material';
interface SidebarProps {
  open: boolean;
  onClose: () => void;
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
  };

  const handleNewChat = () => {
    dispatch(resetMessages());
    dispatch(resetSelectedHistory());
    setSelectedChat(null);
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
const truncateText = (text: string) => {
  if (!text) return "No Question";
  return text.length > 30 ? text.substring(0, 30) + "..." : text;
};

// Function to get first few characters
const getFirstChars = (text: string, charCount: number = 30) => {
  if (!text) return "?";
  return text.substring(0, charCount);
};



  const history = useSelector((state: RootState) => state.history.history);

  const handleDeleteConfirm = () => {
    if (itemToDelete?.sessionId) {
      dispatch(deleteHistory(itemToDelete.sessionId));
      setItemToDelete(null); 
      setDeleteDialogOpen(false);
    }
  };
  

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const renderHistoryList = (data: any[], label: string) => (
    <>
      <Typography variant="subtitle2" sx={styles.sectionTitle}>
        {label}
      </Typography>
  
      <List sx={styles.list}>
        {/* {status === 'loading' && <Typography>Loading...</Typography>} */}
        {status === "loading" && (
          <>
            {[...Array(4)].map((_, index) => (
              <ListItem key={index} disablePadding sx={{ p: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    sx={{ mr: 1 }}
                  />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </ListItem>
            ))}
          </>
        )}

        {status === 'failed' && <Typography color="error">{error}</Typography>}
  
        {data.length > 0 ? (
          data.map((item, index) => {
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
          })
        ) : (
          <Typography sx={{ 
            textAlign: "center", 
            fontSize: '12px !important',
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
          }}>
            No history found.
          </Typography>
        )}
      </List>
    </>
  );
  

  return (
    <Drawer
      className="sidebar-container"
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={styles.drawer}
      slotProps={{ paper: { sx: styles.drawerPaper } }}
    >
       <div style={{ display: 'flex', justifyContent: 'flex-start' ,marginLeft: '18px' }}>
    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      onClick={onClose}
    >
      <MenuIcon sx={{fontSize:"20px"}} />
    </IconButton>
    </div>
      <div className="sidebar-container">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={styles.newChatButton}
          onClick={handleNewChat}
        >
          New chat
        </Button>

        {renderHistoryList(todayData, 'Today')}
        {renderHistoryList(yesterdayData, 'Yesterday')}
        {renderHistoryList(lastSevenDays, 'Last-7-day')}
        {renderHistoryList(lastThirtyDays || [], 'Last-30-day')}

        <List sx={styles.bottomList}>
          <ListItem disablePadding sx={styles.bottomListItem}>
            <SettingsIcon fontSize="small" sx={styles.listItemIcon} />
            <ListItemText
              primary="Settings"
              sx={{
                '& span': {
                  fontSize: '14px !important',
                  fontFamily: 'Inter, sans-serif !important',
                  color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
                },
              }}
            />
          </ListItem>
        </List>
      </div>

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
        <MenuItem onClick={(e) => e.stopPropagation()} sx={styles.menuItem}>
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
    </Drawer>
  );
};

export default Sidebar;



