// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Button
} from '@mui/material';
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;


const Dashboard = () => {
  const navigate = useNavigate();
  // State เก็บข้อมูลสาขาจาก API
  const [branchData, setBranchData] = useState([]);
  // State เก็บ error กรณี fetch ไม่สำเร็จ
  const [error, setError] = useState(null);
  // State สำหรับแสดง loading
  const [loading, setLoading] = useState(true);
 const userRole = localStorage.getItem('role'); 
  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchBranchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/report`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json(); 

        setBranchData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, []);

  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
  if (branchData.length === 0) return <div>ไม่มีข้อมูลสาขา</div>;

  // คำนวณ KPI จากข้อมูลที่ดึงมา
  const totalRevenue = branchData.data.reduce((sum, b) => sum + b.revenue, 0);
  const totalProfit = branchData.data.reduce((sum, b) => sum + b.profit, 0);
  const totalTarget = branchData.data.reduce((sum, b) => sum + b.target, 0);
  const targetPercent = totalTarget === 0 ? 0 : (totalRevenue / totalTarget) * 100;

  return (

    <div className="dashboard-container">
      {userRole === 'admin' && (
        <Button variant="contained" color="primary" onClick={() => navigate('/reportManager')}>
          จัดการรายงาน
        </Button>
      )}
      <h1 className="dashboard-title">📊 Dashboard รายงานผลประกอบการ</h1>

      <div className="kpi-container">
        <div className="kpi-card kpi-revenue">
          <h3>รายได้รวม</h3>
          <p>{totalRevenue.toLocaleString()} บาท</p>
        </div>
        <div className="kpi-card kpi-profit">
          <h3>กำไรรวม</h3>
          <p>{totalProfit.toLocaleString()} บาท</p>
        </div>
        <div className="kpi-card kpi-target">
          <h3>เปอร์เซ็นต์บรรลุเป้าหมาย</h3>
          <p>{targetPercent.toFixed(2)}%</p>
        </div>
      </div>

      <div className="chart-section">
        <h2>สรุปผลประกอบการตามสาขา</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={branchData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branchName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="รายได้" />
            <Bar dataKey="profit" fill="#82ca9d" name="กำไร" />
            <Bar dataKey="target" fill="#ffc658" name="เป้าหมาย" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
