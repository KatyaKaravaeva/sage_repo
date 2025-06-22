import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  getAvailableBackends,
  getBackendToCourseRules,
  addBackendToCourseRule,
  editBackendToCourseRule,
  removeBackendToCourseRule,
  getBackendOptions,
} from '../services/api';
import { Backend, BackendRule, BackendOption } from '../types';

const validationSchema = yup.object({
  courseId: yup.string().required('ID курса обязателен'),
  backendName: yup.string().required('Бекенд обязателен'),
});

export const CourseRules: React.FC = () => {
  const [rules, setRules] = useState<BackendRule[]>([]);
  const [backends, setBackends] = useState<Backend[]>([]);
  const [backendOptions, setBackendOptions] = useState<BackendOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BackendRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesList, backendsList] = await Promise.all([
        getBackendToCourseRules(),
        getAvailableBackends(),
      ]);
      setRules(rulesList.filter(rule => rule.priority === 0));
      setBackends(backendsList);
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
      courseId: '',
      backendName: '',
      options: [] as { key: string; value: string }[],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const ruleData = {
          ...values,
          priority: 0,
          quizId: '*',
          studentIds: [],
        };

        if (editingRule) {
          await editBackendToCourseRule({ ...ruleData, ruleId: editingRule.ruleId });
          showSuccessMessage('Правило успешно обновлено');
        } else {
          await addBackendToCourseRule(ruleData);
          showSuccessMessage('Правило успешно добавлено');
        }
        await loadData();
        handleClose();
      } catch (err) {
        setError('Ошибка сохранения. Пожалуйста, попробуйте позже.');
      }
    },
  });

  const handleBackendChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const backendName = event.target.value as string;
    formik.setFieldValue('backendName', backendName);
    
    try {
      const options = await getBackendOptions(backendName);
      setBackendOptions(options);
    } catch (error) {
      console.error('Error loading backend options:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRule(null);
    setError(null);
    formik.resetForm();
    setBackendOptions([]);
  };

  const handleEdit = async (rule: BackendRule) => {
    setEditingRule(rule);
    formik.setValues({
      courseId: rule.courseId,
      backendName: rule.backendName,
      options: rule.options || [],
    });
    try {
      const options = await getBackendOptions(rule.backendName);
      setBackendOptions(options);
    } catch (error) {
      console.error('Error loading backend options:', error);
    }
    setOpen(true);
  };

  const handleDelete = async (ruleId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это правило?')) {
      try {
        await removeBackendToCourseRule(ruleId);
        showSuccessMessage('Правило успешно удалено');
        await loadData();
      } catch (err) {
        setError('Ошибка удаления. Пожалуйста, попробуйте позже.');
      }
    }
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
            Базовые правила
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Настройте правила привязки бекендов к курсам
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Добавить правило
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
              <TableCell>Курс</TableCell>
              <TableCell>Бекенд</TableCell>
              <TableCell>Настройки</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.ruleId}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="action" fontSize="small" />
                    {rule.courseId}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.backendName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {rule.options?.length ? (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {rule.options.map((opt, index) => (
                        <Chip
                          key={index}
                          label={`${opt.key}=${opt.value}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Нет настроек
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Редактировать">
                    <IconButton onClick={() => handleEdit(rule)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      onClick={() => handleDelete(rule.ruleId)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Нет активных правил
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
            {editingRule ? 'Редактировать правило' : 'Добавить правило'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                id="courseId"
                name="courseId"
                label="ID курса"
                value={formik.values.courseId}
                onChange={formik.handleChange}
                error={formik.touched.courseId && Boolean(formik.errors.courseId)}
                helperText={formik.touched.courseId && formik.errors.courseId}
              />
              <TextField
                fullWidth
                id="backendName"
                name="backendName"
                label="Бекенд"
                select
                value={formik.values.backendName}
                onChange={handleBackendChange}
                error={formik.touched.backendName && Boolean(formik.errors.backendName)}
                helperText={formik.touched.backendName && formik.errors.backendName}
              >
                {backends.map((backend) => (
                  <MenuItem key={backend.backendId} value={backend.backendName}>
                    {backend.backendName}
                  </MenuItem>
                ))}
              </TextField>

              {backendOptions.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Дополнительные настройки
                    </Typography>
                  </Divider>
                  {backendOptions.map((option) => (
                    <TextField
                      key={option.key}
                      fullWidth
                      select
                      label={option.key}
                      value={formik.values.options.find(opt => opt.key === option.key)?.value || ''}
                      onChange={(e) => {
                        const newOptions = [...formik.values.options];
                        const optionIndex = newOptions.findIndex(opt => opt.key === option.key);
                        if (optionIndex >= 0) {
                          newOptions[optionIndex].value = e.target.value;
                        } else {
                          newOptions.push({ key: option.key, value: e.target.value });
                        }
                        formik.setFieldValue('options', newOptions);
                      }}
                    >
                      {option.values.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  ))}
                </>
              )}
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