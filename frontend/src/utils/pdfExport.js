import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (elementId, fileName = "document.pdf") => {
  const input = document.getElementById(elementId);

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save(fileName);
};