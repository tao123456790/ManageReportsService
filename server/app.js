const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Dummy users
const users = [
    { id: '1', role: 'admin', username: 'admin', password: 'P@ssw0rd', name: 'Admin User' },
    { id: '2', role: 'user', username: 'user', password: 'P@ssw0rd', name: 'User' },
];

// Dummy report data
let performanceReports = [
    { branchId: 1, branchName: "สาขาสีลม", revenue: 1200000, profit: 300000, target: 1000000 },
    { branchId: 2, branchName: "สาขาพระราม 9", revenue: 950000, profit: 150000, target: 1100000 },
    { branchId: 3, branchName: "สาขาอโศก", revenue: 1350000, profit: 400000, target: 1250000 },
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        return res.json({
            success: true,
            data: { name: user.name, role: user.role }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        });
    }
});

// GET: Performance Report
app.get('/api/report', (req, res) => {
    try {
        if (performanceReports.length > 0) {
            return res.status(200).json({
                success: true,
                data: performanceReports
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูลรายงาน"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
        });
    }
});

// GET: Branch Names
app.get('/api/getBranchName', async (req, res) => {
    try {
        const branchData = [
            { "branchId": 1, "branchName": "สาขาสีลม" },
            { "branchId": 2, "branchName": "สาขาพระราม 9" },
            { "branchId": 3, "branchName": "สาขาอโศก" },
            { "branchId": 4, "branchName": "สาขาบางนา" },
            { "branchId": 5, "branchName": "สาขาลาดพร้าว" },
            { "branchId": 6, "branchName": "สาขาจตุจักร" },
            { "branchId": 7, "branchName": "สาขาดอนเมือง" },
            { "branchId": 8, "branchName": "สาขารังสิต" },
            { "branchId": 9, "branchName": "สาขาเพลินจิต" },
            { "branchId": 10, "branchName": "สาขาเอกมัย" },
            { "branchId": 11, "branchName": "สาขาทองหล่อ" },
            { "branchId": 12, "branchName": "สาขาพระราม 3" },
            { "branchId": 13, "branchName": "สาขาบางแค" },
            { "branchId": 14, "branchName": "สาขาสุขุมวิท 101" },
            { "branchId": 15, "branchName": "สาขาบางซื่อ" },
            { "branchId": 16, "branchName": "สาขาสะพานควาย" },
            { "branchId": 17, "branchName": "สาขาสาทร" },
            { "branchId": 18, "branchName": "สาขาปิ่นเกล้า" },
            { "branchId": 19, "branchName": "สาขางามวงศ์วาน" },
            { "branchId": 20, "branchName": "สาขาฟิวเจอร์พาร์ครังสิต" }
        ];

        return res.status(200).json({ success: true, data: branchData });
    } catch (error) {
        console.error("Error fetching branch data:", error.message);
        return res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
        });
    }
});

// POST: เพิ่มข้อมูลใหม่
app.post('/api/saveReport', (req, res) => {
    try {
        const {branchId, branchName, profit, revenue, target } = req.body;

        if (!branchName || profit == null || revenue == null || target == null) {
            return res.status(400).json({ message: 'กรุณาระบุ branchName, profit, revenue, target ให้ครบถ้วน' });
        }

        // const newId = performanceReports.length ? Math.max(...performanceReports.map(r => r.id)) + 1 : 1;
        const newReport = { 
            branchId: branchId,  
            branchName,
            profit,
            revenue,
            target
        };
        performanceReports.push(newReport);

        console.log("performanceReports save : " ,performanceReports)
        res.status(200).json(newReport);
    } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});

// PUT: แก้ไขข้อมูลตาม id
app.put('/api/editReport', (req, res) => {
    try {
        const { branchId, branchName, profit, revenue, target } = req.body;

        if (isNaN(branchId)) {
            return res.status(400).json({ message: 'branchId ไม่ถูกต้อง' });
        }

        const reportIndex = performanceReports.findIndex(
            r => r.branchId === parseInt(branchId)
        );

        if (reportIndex === -1) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }

        if (!branchName || profit == null || revenue == null || target == null) {
            return res.status(400).json({
                message: 'กรุณาระบุ branchName, profit, revenue, target ให้ครบถ้วน'
            });
        }

        performanceReports[reportIndex] = {
            ...performanceReports[reportIndex],
            branchName,
            profit,
            revenue,
            target
        };
        console.log("performanceReports edit : " ,performanceReports)
        res.json(performanceReports[reportIndex]);
    } catch (error) {
        console.error('PUT Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});

// DELETE: ลบข้อมูลตาม id
app.delete('/api/deleteReport', (req, res) => {
    try {
        const id = parseInt(req.query.branchId);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID ไม่ถูกต้อง' });
        }
        console.log("Delete id : " , id)
        const initialLength = performanceReports.length;
        performanceReports = performanceReports.filter(r => r.branchId !== id);

        if (performanceReports.length === initialLength) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
        console.log("performanceReports edit : " ,performanceReports)
        res.json({ message: `ลบข้อมูล ID ${id} สำเร็จ` });
    } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
});



// Global Error Handler
app.use(errorHandler);

module.exports = app;
