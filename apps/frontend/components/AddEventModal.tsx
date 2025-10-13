'use client';
import { useImperativeHandle, useState, Ref } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { useEvents } from '../contexts/AppProviders';

export interface AddEventModalHandles {
  handleOpen: () => void;
  handleClose: () => void;
  setFormData: (data: FormData) => void;
}

interface FormData {
  userId: string;
  title: string;
  description: string;
  status: string;
  start: string;
  end: string;
}

export default function AddEventFab({ ref }: { ref: Ref<AddEventModalHandles> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userId: '',
    title: '',
    description: '',
    status: 'scheduled',
    start: '',
    end: '',
  });

  const { actions: eventsActions } = useEvents();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useImperativeHandle(ref, () => ({ handleOpen, handleClose, setFormData }));

  const handleSubmit = async () => {
    // TODO: validate form data
    /*if (!formData.userId || !formData.title || !formData.start || !formData.end) {
      alert('Please fill in all required fields');
      return;
    }*/

    setLoading(true);
    try {
      await eventsActions.addEvent({
        userId: 1,
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        start: formData.start,
        end: formData.end,
      });

      handleClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            required
            fullWidth
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>

          <TextField
            name="start"
            label="Start Date & Time"
            type="datetime-local"
            value={formData.start}
            onChange={handleInputChange}
            required
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            name="end"
            label="End Date & Time"
            type="datetime-local"
            value={formData.end}
            onChange={handleInputChange}
            required
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
