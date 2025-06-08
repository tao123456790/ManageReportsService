
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Typography, Tooltip,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ApiService from './service';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const ReportManager = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [branch, setBranch] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form, setForm] = useState({
    branchId: '',
    branchName: '',
    revenue: '',
    profit: '',
    target: '',
  });

  useEffect(() => {
    async function fetchReports() {
      try {
        // GET reports
        const reportsData = await ApiService.getJson(`${apiUrl}/report`);
        setReports(reportsData.data);

        // GET branchName 
        const branchNameData = await ApiService.getJson(`${apiUrl}/getBranchName`);
        setBranch(branchNameData.data);
      } catch (error) {
        console.error('API error:', error);
      }
    }

    fetchReports();
  }, []);

  // เปิด dialog เพื่อเพิ่มสาขาใหม่
  const handleOpenAdd = () => {
    setForm({ branchId: '', branchName: '', revenue: '', profit: '', target: '' });
    setEditingReport(null);
    setOpenDialog(true);
  };

  // เปิด dialog เพื่อแก้ไขสาขาเดิม
  const handleOpenEdit = (report) => { 
    setForm({
      branchId: report.branchId,
      branchName: report.branchName,
      revenue: report.revenue,
      profit: report.profit,
      target: report.target,
    });
    setEditingReport(report);
    setOpenDialog(true);
  };

  // บันทึกข้อมูล (เพิ่มหรือแก้ไข)
  const handleSave = async () => {
    if (!form.branchName) {
      alert('กรุณาเลือกสาขา');
      return;
    }
    const branchId = Number(form.branchId);
    const revenue = Number(form.revenue);
    const profit = Number(form.profit);
    const target = Number(form.target);
    const branchName = form.branchName



    try {
      if ([revenue, profit, target].some(val => isNaN(val) || val < 0)) {
        alert('กรุณากรอกข้อมูลรายได้ กำไร และเป้าหมาย ให้เป็นตัวเลขที่มากกว่าหรือเท่ากับ 0');
        return;
      }

      const isDuplicate = reports.some(element => element.branchId === branchId);

      if (isDuplicate) {
        alert('สาขา : ' + form.branchName + ' มีอยู่แล้ว');
        return; // หรือ return false/หยุดการดำเนินการ
      }
      if (editingReport) {
        const oldBranchId = Number(editingReport.branchId);

        // แก้ไขข้อมูล (PUT)
        const updatedReport = await ApiService.putJson(`${apiUrl}/editReport`, {
          oldBranchId: oldBranchId,
          branchId: branchId,
          branchName: branchName,
          revenue,
          profit,
          target
        });

        // อัพเดตรายการใน state จาก response 
        setReports(prev =>
          prev.map(r => (r.branchId === editingReport.branchId ? updatedReport : r))
        );
      } else {


        // เพิ่มข้อมูลใหม่ (POST)
        const newReport = await ApiService.postJson(`${apiUrl}/saveReport`, {
          branchId: branchId,
          branchName: form.branchName,
          revenue,
          profit,
          target
        });
        // เพิ่มข้อมูลที่ได้จาก server ลง state 
        setReports(prev => [...prev, newReport]);
      } 
      setOpenDialog(false);
      setEditingReport(null);
      setForm({ branchId: '', branchName: '', revenue: '', profit: '', target: '' });
    } catch (error) {
      console.error('API error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('คุณต้องการลบรายงานนี้ใช่หรือไม่?')) {
      try {
        await ApiService.deleteJson(`${apiUrl}/deleteReport?branchId=${branchId}`);
        setReports(prev => prev.filter(r => r.branchId !== branchId));
      } catch (error) {
        console.error('API error:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };


  return (
    <Box p={3}>
      <div className="dashboard-container">
        <Typography variant="h5" gutterBottom>
          จัดการรายงาน
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
            ภาพรวม
          </Button>

          <Button variant="contained" color="primary" onClick={handleOpenAdd}>
            เพิ่มรายงาน
          </Button>
        </Box>



        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อสาขา</TableCell>
              <TableCell>กำไร (บาท)</TableCell>
              <TableCell>รายได้ (บาท)</TableCell>
              <TableCell>เป้าหมาย (บาท)</TableCell>
              <TableCell align="right">การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.branchId}>
                <TableCell>{report.branchName}</TableCell>
                <TableCell>{report.profit}</TableCell>
                <TableCell>{report.revenue}</TableCell>
                <TableCell>{report.target}</TableCell>
                <TableCell align="right">
                  <Tooltip title="แก้ไข">
                    <IconButton onClick={() => handleOpenEdit(report)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="ลบ">
                    <IconButton color="error" onClick={() => handleDelete(report.branchId)}><Delete /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editingReport ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>เลือกสาขา</InputLabel>
              <Select
                value={form.branchId}
                label="เลือกสาขา"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedBranch = branch.find(b => b.branchId === selectedId); // ใช้ branchId ตรงกัน
                  setForm({
                    ...form,
                    branchId: selectedId,
                    branchName: selectedBranch ? selectedBranch.branchName : '',
                  });
                }}
              >
                {branch.map((b) => (
                  <MenuItem key={b.branchId} value={b.branchId}>
                    {b.branchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="กำไร (บาท)"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
              value={form.profit}
              onChange={(e) => setForm({ ...form, profit: e.target.value })}
            />

            <TextField
              label="รายได้ (บาท)"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
              value={form.revenue}
              onChange={(e) => setForm({ ...form, revenue: e.target.value })}
            />

            <TextField
              label="เป้าหมาย (บาท)"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ min: 0 }}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              setEditingReport(null);
              setForm({ branchId: '', branchName: '', revenue: '', profit: '', target: '' });
            }}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

export default ReportManager;
