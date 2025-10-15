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
  id?: number;
  title: string;
  description: string;
  status: string;
  start: string;
  end: string;
  isUpdate?: boolean;
}

export default function AddOrUpdateEventModal({ ref }: { ref: Ref<AddEventModalHandles> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'scheduled',
    start: '',
    end: '',
  });
  const { actions: eventsActions } = useEvents();

  const disabled = (formData as any).isGoogleEvent;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useImperativeHandle(ref, () => ({ handleOpen, handleClose, setFormData }));

  const handleSubmit = async () => {
    if (!formData.title || !formData.start || !formData.end) {
      eventsActions.showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (formData.isUpdate) {
        await eventsActions.updateEvent({
          id: formData.id || 0,
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          start: formData.start,
          end: formData.end,
        });
      } else {
        await eventsActions.addEvent({
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          start: formData.start,
          end: formData.end,
        });
      }

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
      <DialogTitle>{formData.isUpdate ? 'Update Event' : 'Add New Event'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={disabled}
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description || ''}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
            disabled={disabled}
            slotProps={{
              input: { id: "description" },
              inputLabel: { htmlFor: "description" },
            }}
          />

          <TextField
            select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={disabled}
            slotProps={{
              input: { id: "status" },
              inputLabel: { htmlFor: "status" },
            }}
          >
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
          </TextField>

          <TextField
            name="start"
            label="Start Date & Time"
            type="datetime-local"
            value={formData.start}
            onChange={handleInputChange}
            required
            fullWidth
            disabled={disabled}
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
            disabled={disabled}
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
        <Button onClick={handleSubmit} variant="contained" disabled={loading || disabled}>
          {loading ? 'Save...' : 'Save Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
