import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


export default function ReCheckModal({open, onClose, onSubmit, title, detail}) {

  return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            {detail}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>ยกเลิก</Button>
            <Button onClick={onSubmit} autoFocus>
                ยืนยัน
            </Button>
        </DialogActions>
      </Dialog>
  );
}

