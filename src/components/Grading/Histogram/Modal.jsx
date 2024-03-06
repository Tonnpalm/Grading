import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Modal = ({ onClose }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogContent>
        <p>This is the content of the modal.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired, // ตรวจสอบว่า onClose เป็น function และจำเป็นต้องส่งเข้ามา
};

export default Modal;
