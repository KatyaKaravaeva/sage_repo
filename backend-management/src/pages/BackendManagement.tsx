import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  getAvailableAdapters,
  getAvailableBackends,
  addBackend,
  editBackend,
  removeBackend,
} from '../services/api';
import { Backend } from '../types';

const validationSchema = yup.object({
  backendName: yup.string().required('Название бекенда обязательно'),
  adapterName: yup.string().required('Адаптер обязателен'),
  backendURL: yup.string().url('Введите корректный URL').required('URL обязателен'),
});

export const BackendManagement: React.FC = () => {
  const [backends, setBackends] = useState<Backend[]>([]);
  const [adapters, setAdapters] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBackend, setEditingBackend] = useState<Backend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [backendsList, adaptersList] = await Promise.all([
        getAvailableBackends(),
        getAvailableAdapters(),
      ]);
      setBackends(backendsList);
      setAdapters(adaptersList);
    } catch (err) {
      setError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const formik = useFormik({
    initialValues: {
      backendName: '',
      adapterName: '',
      backendURL: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingBackend) {
          await editBackend({ ...values, backendId: editingBackend.backendId });
          showSuccessMessage('Бекенд успешно обновлен');
        } else {
          await addBackend(values);
          showSuccessMessage('Бекенд успешно добавлен');
        }
        await loadData();
        handleClose();
      } catch (err) {
        setError('Ошибка сохранения. Пожалуйста, попробуйте позже.');
      }
    },
  });

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBackend(null);
    setError(null);
    formik.resetForm();
  };

  const handleEdit = (backend: Backend) => {
    setEditingBackend(backend);
    formik.setValues(backend);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (backendId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот бекенд?')) {
      try {
        await removeBackend(backendId);
        showSuccessMessage('Бекенд успешно удален');
        await loadData();
      } catch (err) {
        setError('Ошибка удаления. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const getStatusChip = (url: string) => {
    const isActive = true; // В реальном приложении здесь будет проверка доступности
    return (
      <Chip
        size="small"
        icon={isActive ? <CheckCircleIcon /> : <ErrorIcon />}
        label={isActive ? 'Активен' : 'Недоступен'}
        color={isActive ? 'success' : 'error'}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Управление бекендами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Добавляйте, редактируйте и удаляйте бекенды для обработки запросов
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Добавить бекенд
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Адаптер</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backends.map((backend) => (
              <TableRow key={backend.backendId}>
                <TableCell>{backend.backendId}</TableCell>
                <TableCell>{backend.backendName}</TableCell>
                <TableCell>
                  <Chip label={backend.adapterName} size="small" />
                </TableCell>
                <TableCell>
                  <Tooltip title={backend.backendURL}>
                    <span>{backend.backendURL}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{getStatusChip(backend.backendURL)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Редактировать">
                    <IconButton onClick={() => handleEdit(backend)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      onClick={() => handleDelete(backend.backendId)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {backends.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Нет доступных бекендов
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingBackend ? 'Редактировать бекенд' : 'Добавить бекенд'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                id="backendName"
                name="backendName"
                label="Название бекенда"
                value={formik.values.backendName}
                onChange={formik.handleChange}
                error={formik.touched.backendName && Boolean(formik.errors.backendName)}
                helperText={formik.touched.backendName && formik.errors.backendName}
              />
              <TextField
                fullWidth
                id="adapterName"
                name="adapterName"
                label="Адаптер"
                select
                value={formik.values.adapterName}
                onChange={formik.handleChange}
                error={formik.touched.adapterName && Boolean(formik.errors.adapterName)}
                helperText={formik.touched.adapterName && formik.errors.adapterName}
              >
                {adapters.map((adapter) => (
                  <MenuItem key={adapter} value={adapter}>
                    {adapter}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                id="backendURL"
                name="backendURL"
                label="URL бекенда"
                value={formik.values.backendURL}
                onChange={formik.handleChange}
                error={formik.touched.backendURL && Boolean(formik.errors.backendURL)}
                helperText={formik.touched.backendURL && formik.errors.backendURL}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                'Сохранить'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 