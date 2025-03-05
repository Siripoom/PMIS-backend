const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Project = require("../models/projectModel");
const Progress = require("../models/progressModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");

const generateReport = async (req, res) => {
  const { project_id, format } = req.body;
  const user_id = req.user ? req.user.id : "test_user"; // ✅ ป้องกัน req.user เป็น undefined

  try {
    // ตรวจสอบว่าโครงการมีอยู่จริง
    const project = await Project.findByPk(project_id, {
      include: [{ model: User, as: "creator" }, { model: Progress }],
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // สร้างรายงานใหม่
    const newReport = await Report.create({ project_id, generated_by: user_id, format });

    let filePath = "";

    if (format === "PDF") {
      filePath = await generatePDF(project);
    } else if (format === "Excel") {
      filePath = await generateExcel(project);
    }

    res.status(200).json({
      message: "Report generated successfully",
      file_url: `/reports/${path.basename(filePath)}`,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ฟังก์ชันสร้าง PDF
const generatePDF = async (project) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "../reports", `report_${project.project_id}.pdf`);
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);
  doc.fontSize(16).text(`Project Report: ${project.project_name}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Description: ${project.description}`);
  doc.text(`Budget: ${project.budget}`);
  doc.text(`Status: ${project.status}`);
  doc.text(`Created by: ${project.creator ? project.creator.username : "Unknown"}`); // ✅ ป้องกัน creator เป็น null
  doc.moveDown();
  doc.text("Progress Updates:");

  (project.Progress || []).forEach((p, index) => { // ✅ ป้องกัน Progress เป็น undefined
    doc.text(`${index + 1}. ${p.update_note} (${p.progress}%)`);
  });

  doc.end();
  return filePath;
};

// ✅ ฟังก์ชันสร้าง Excel
const generateExcel = async (project) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Project Report");
  const filePath = path.join(__dirname, "../reports", `report_${project.project_id}.xlsx`);

  worksheet.columns = [
    { header: "Project Name", key: "project_name", width: 30 },
    { header: "Description", key: "description", width: 40 },
    { header: "Budget", key: "budget", width: 15 },
    { header: "Status", key: "status", width: 20 },
    { header: "Created By", key: "created_by", width: 20 },
  ];

  worksheet.addRow({
    project_name: project.project_name,
    description: project.description,
    budget: project.budget,
    status: project.status,
    created_by: project.creator ? project.creator.username : "Unknown", // ✅ ป้องกัน creator เป็น null
  });

  worksheet.addRow([]);
  worksheet.addRow(["Progress Updates"]);
  worksheet.addRow(["#", "Update Note", "Progress (%)"]);

  (project.Progress || []).forEach((p, index) => { // ✅ ป้องกัน Progress เป็น undefined
    worksheet.addRow([index + 1, p.update_note, p.progress]);
  });

  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

// ✅ ดึงรายการรายงานที่เคยสร้าง
const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Project, attributes: ["project_name"] },
        { model: User, attributes: ["username"] },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ total: reports.length, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { generateReport, getReports };