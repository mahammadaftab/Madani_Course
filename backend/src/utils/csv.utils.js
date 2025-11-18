const json2csv = require('json2csv').Parser;

const exportStudentsToCSV = (students) => {
  try {
    // Transform student data for CSV
    const csvData = students.map(student => ({
      Name: student.name,
      Phone: student.phone,
      Age: student.age,
      District: student.district,
      Address: student.address,
      'Course Place': student.coursePlace,
      'Registered At': new Date(student.createdAt).toLocaleDateString()
    }));

    // Define CSV fields
    const fields = ['Name', 'Phone', 'Age', 'District', 'Address', 'Course Place', 'Registered At'];

    // Create CSV parser
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(csvData);

    return csv;
  } catch (error) {
    throw new Error('Error generating CSV: ' + error.message);
  }
};

module.exports = { exportStudentsToCSV };