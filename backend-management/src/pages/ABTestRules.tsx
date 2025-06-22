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
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Speed as SpeedIcon,
  Group as GroupIcon,
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
  priority: yup.number()
    .min(1, 'Приоритет должен быть больше 0')
    .required('Приоритет обязателен'),
  courseId: yup.string().required('ID курса обязателен'),
  quizId: yup.string().required('ID квиза обязателен'),
  backendName: yup.string().required('Бекенд обязателен'),
  studentIds: yup.string(),
});

export const ABTestRules: React.FC = () => {
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
      setRules(rulesList.filter(rule => rule.priority > 0));
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
      priority: 1,
      courseId: '',
      quizId: '*',
      backendName: '',
      studentIds: '*',
      options: [] as { key: string; value: string }[],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const ruleData = {
          ...values,
          studentIds: values.studentIds === '*' ? [] : values.studentIds.split(',').map(s => s.trim()),
        };

        if (editingRule) {
          await editBackendToCourseRule({ ...ruleData, ruleId: editingRule.ruleId });
          showSuccessMessage('Правило A/B теста успешно обновлено');
        } else {
          await addBackendToCourseRule(ruleData);
          showSuccessMessage('Правило A/B теста успешно добавлено');
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
      priority: rule.priority,
      courseId: rule.courseId,
      quizId: rule.quizId,
      backendName: rule.backendName,
      studentIds: rule.studentIds.length === 0 ? '*' : rule.studentIds.join(','),
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
    if (window.confirm('Вы уверены, что хотите удалить это правило A/B теста?')) {
      try {
        await removeBackendToCourseRule(ruleId);
        showSuccessMessage('Правило A/B теста успешно удалено');
        await loadData();
      } catch (err) {
        setError('Ошибка удаления. Пожалуйста, попробуйте позже.');
      }
    }
  };

  // Group rules by courseId and quizId
  const groupedRules = rules.reduce((acc, rule) => {
    const key = `${rule.courseId}-${rule.quizId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(rule);
    return acc;
  }, {} as Record<string, BackendRule[]>);

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
            A/B тесты
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Настройте правила для проведения A/B тестирования различных бекендов
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Добавить тест
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

      {Object.entries(groupedRules).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет активных A/B тестов
          </Typography>
        </Paper>
      ) : (
        Object.entries(groupedRules).map(([key, groupRules]) => {
          const [courseId, quizId] = key.split('-');
          return (
            <Card key={key} sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="h6">
                      Курс: {courseId}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <QuizIcon color="secondary" />
                    <Typography variant="h6">
                      Квиз: {quizId}
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Приоритет</TableCell>
                        <TableCell>Бекенд</TableCell>
                        <TableCell>Студенты</TableCell>
                        <TableCell>Настройки</TableCell>
                        <TableCell align="right">Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupRules.sort((a, b) => b.priority - a.priority).map((rule) => (
                        <TableRow key={rule.ruleId}>
                          <TableCell>
                            <Chip
                              icon={<SpeedIcon />}
                              label={rule.priority}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.backendName}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {rule.studentIds.length === 0 ? (
                              <Chip
                                icon={<GroupIcon />}
                                label="Все студенты"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            ) : (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {rule.studentIds.map((id) => (
                                  <Chip
                                    key={id}
                                    label={id}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            )}
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          );
        })
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingRule ? 'Редактировать A/B тест' : 'Добавить A/B тест'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                fullWidth
                id="priority"
                name="priority"
                label="Приоритет"
                type="number"
                value={formik.values.priority}
                onChange={formik.handleChange}
                error={formik.touched.priority && Boolean(formik.errors.priority)}
                helperText={formik.touched.priority && formik.errors.priority}
              />
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
                id="quizId"
                name="quizId"
                label="ID квиза"
                placeholder="* для всех квизов"
                value={formik.values.quizId}
                onChange={formik.handleChange}
                error={formik.touched.quizId && Boolean(formik.errors.quizId)}
                helperText={formik.touched.quizId && formik.errors.quizId}
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
              <TextField
                fullWidth
                id="studentIds"
                name="studentIds"
                label="ID студентов"
                placeholder="* для всех студентов или список через запятую"
                value={formik.values.studentIds}
                onChange={formik.handleChange}
                error={formik.touched.studentIds && Boolean(formik.errors.studentIds)}
                helperText={formik.touched.studentIds && formik.errors.studentIds}
              />

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